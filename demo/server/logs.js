import * as winston from 'winston';
import LogstashTransport from 'winston-logstash/lib/winston-logstash-latest.js';
import ecsFormat from '@elastic/ecs-winston-format';

let logFile = "/var/log/apollo/server.log";

if (process.env.NODE_ENV !== 'production') {
    logFile = "server.log";
}

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: ecsFormat({ convertReqRes: true }),
    defaultMeta: { service: 'ApolloServer' },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: logFile }),
        new LogstashTransport({
            max_connect_retries: -1,
            port: 9600,
            node_name: "ApolloServer",
            host: "logstash",
        })
    ],
});
