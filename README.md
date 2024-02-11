# Monitorización de un despliegue de Apollo Server

## ¿Por qué es importante monitorear una aplicación en producción?

Monitorear una aplicación en producción es fundamental para garantizar su rendimiento, detectar problemas potenciales y mejorar la experiencia del usuario. Proporciona información valiosa sobre el estado del sistema, la disponibilidad de recursos y el comportamiento de la aplicación en tiempo real.

## ¿Qué herramientas podemos utilizar para monitorear una aplicación?

Respuesta: Existen varias herramientas disponibles para monitorear aplicaciones, entre las cuales se incluyen Elastic Search, Kibana y herramientas de APM (Application Performance Monitoring) como Elastic APM. Estas herramientas ofrecen capacidades de registro, análisis de registros, visualización de datos y monitoreo del rendimiento de la aplicación.

## ¿Qué es Elastic Search y cuál es su función en el monitoreo de aplicaciones?

Elastic Search es un motor de búsqueda y análisis de datos distribuido y altamente escalable. En el contexto del monitoreo de aplicaciones, Elastic Search se utiliza para almacenar y analizar datos de registro y métricas generados por la aplicación en producción.

## ¿Qué es Kibana y cómo se integra con Elastic Search?

Kibana es una plataforma de visualización de datos que se utiliza junto con Elastic Search para crear gráficos, paneles y visualizaciones de datos. Se integra con Elastic Search para acceder y visualizar los datos almacenados en los índices de Elastic Search.

## ¿Qué es Elastic APM y cómo ayuda en el monitoreo de aplicaciones?

Elastic APM es una solución de monitoreo de rendimiento de aplicaciones que permite rastrear y analizar el rendimiento de las transacciones en una aplicación en tiempo real. Proporciona información detallada sobre la latencia, los errores y la salud de la aplicación, lo que facilita la identificación y resolución de problemas de rendimiento.

## ¿Cómo se configura y despliega Elastic Search y Elastic APM para monitorear una aplicación Apollo Server?

La configuración y el despliegue de Elastic Search y Elastic APM para monitorear una aplicación Apollo Server implican la instalación y configuración de estos servicios en un entorno de producción, la integración de la aplicación con Elastic APM para rastrear el rendimiento de las transacciones, y la visualización de los datos de monitoreo en Kibana para realizar análisis y tomar decisiones informadas.

## ¿Cuáles son algunos de los beneficios de monitorear una aplicación con Elastic Search y Elastic APM?

Algunos de los beneficios de monitorear una aplicación con Elastic Search y Elastic APM incluyen la capacidad de identificar y resolver problemas de rendimiento de manera proactiva, mejorar la experiencia del usuario al garantizar un rendimiento óptimo de la aplicación, y obtener información valiosa sobre el comportamiento y la salud de la aplicación en tiempo real.

## Envío de logs e información APM

En la aplicación Apollo vamos a habilitar los logs con Winston y vamos a configurarlo para que la información tenga el formato ECS.

Para esto vamos a requerir los siguientes paquetes:

```bash
npm install winston --save
npm install @elastic/ecs-winston-format --save
```

Para la información APM vamos a requerir instalar el siguiente paquete:

```bash
npm install elastic-apm-node --save
```

Después vamos a configurar el logger de la siguiente forma:

```javascript
const winston = require('winston');
const { ecsFormat } = require('@elastic/ecs-winston-format');

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: ecsFormat(
        {
            convertReqRes: true,
            apmIntegration: true
        }
    ),
    defaultMeta: { service: 'apollo-client' },
    transports: [
        new winston.transports.Console()
    ],
});
```

## Estadísticas APM y transacciones

Para etiquetar las transacciones y poder monitorearlas en ElasticSearch vamos a instalar el siguiente paquete en la aplicación con Apollo Server:

```bash
npm install elastic-apm-node --save
```

Ese paquete nos dará acceso a la API del APM de ElasticSearch.

Hay que definir las siguientes variables de ambiente:

```bash
ELASTIC_APM_SERVICE_NAME=<service name>
ELASTIC_APM_SECRET_TOKEN=<token>
ELASTIC_APM_SERVER_URL=<server url>
```

Ahora, en el archivo principal de la aplicación, lo primero que haremos será inicializar el agente APM. En nuestro caso será en el archivo [`server.js`](server.js):

```javascript
import Agent from 'elastic-apm-node/start.js'

export const apm = Agent;
```

Con la primera línea es suficiente para que el agente se inicialice de forma automática. El agente usará los valores de las variables de ambiente definidas anteriormente para enviarle estadísticas del rendimiento de la aplicación al servidor APM.

La segunda línea creará una variable llamada `apm` con el Agente como valor, y la va a exportar para que podamos usarla en cualquier parte del código. Esa variable nos va a servir para etiquetar las transacciones.

Por ejemplo, en el archivo [`resolvers.js`](resolvers.js) vamos a importar la variable  `apm` definida anteriormente y la usaremos para etiquetar transacciones de la siguiente forma:

```javascript
import { apm } from './server.js'

    ...
    company: async (_root, { id }) => {
      const transaction = apm.startTransaction('company-resolver', 'graphql'); // Se crea la transacción company-resolver
      const company = await getCompany(id);
      if (!company) {
        const span = transaction.startSpan('No Company found');
        span.end();
        logger.error('No Company found with id ' + id);
        throw notFoundError('No Company found with id ' + id);
      }
      transaction.end('success'); // Se termina la transacción company-resolver
      logger.info('Company found with id ' + id);
      return company;
    },
  ...
```

Dentro de Kibana, en el menú de observabilidad encontraremos la opción de servicios, ahí podremos ver las estadísticas APM de la aplicación. También ahí, podremos encontrar las transacciones.

## Elasitc Search y Kibana

De ser necesario, hay que aumentar la memoria de intercambio antes de iniciar el despliegue de los servicios:

```bash
sudo sysctl -w vm.max_map_count=262144
```

Despliegue de los servicios:

```bash
docker compose up –d
```

Para acceder a la aplicación hay que abrir en el navegador la siguiente URL: [http://localhost:5601/](http://localhost:5601/). Las credenciales de acceso están definidas en el archivo [.env](.env)

Ver los logs de los servicios:

```bash
docker compose logs
```

Detener los servicios:

```bash
docker compose stop
```

## Video

Puedes ver el video con la explicación en [Youtube](https://youtu.be/-ODgh-q39WQ)
