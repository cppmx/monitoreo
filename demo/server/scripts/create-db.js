import { connection } from '../db/connection.js';

const { schema } = connection;

await schema.dropTableIfExists('user');
await schema.dropTableIfExists('job');
await schema.dropTableIfExists('company');

await schema.createTable('company', (table) => {
  table.text('id').notNullable().primary();
  table.text('name').notNullable();
  table.text('description');
});

await schema.createTable('job', (table) => {
  table.text('id').notNullable().primary();
  table.text('companyId').notNullable()
    .references('id').inTable('company');
  table.text('title').notNullable();
  table.text('description');
  table.text('createdAt').notNullable();
});

await schema.createTable('user', (table) => {
  table.text('id').notNullable().primary();
  table.text('companyId').notNullable()
    .references('id').inTable('company');
  table.text('email').notNullable().unique();
  table.text('password').notNullable();
});

await connection.table('company').insert([
  {
    id: 'FjcJCHJALA4i',
    name: 'Facegle',
    description: 'Somos una startup con la misión de revolucionar los motores de búsqueda sociales. Piense que Facebook se unió con Google.',
  },
  {
    id: 'Gu7QW9LcnF5d',
    name: 'Goobook',
    description: 'Somos una startup con la misión de revolucionar las redes sociales de búsqueda. Piensa que Google se unió con Facebook.',
  },
]);

await connection.table('job').insert([
  {
    id: 'f3YzmnBZpK0o',
    companyId: 'FjcJCHJALA4i',
    title: 'Frontend Developer',
    description: 'Buscamos un desarrollador frontend familiarizado con React.',
    createdAt: '2024-01-26T11:00:00.000Z',
  },
  {
    id: 'XYZNJMXFax6n',
    companyId: 'FjcJCHJALA4i',
    title: 'Backend Developer',
    description: 'Buscamos un desarrollador backend familiarizado con Node.js y Express.',
    createdAt: '2024-02-02T11:00:00.000Z',
  },
  {
    id: '6mA05AZxvS1R',
    companyId: 'Gu7QW9LcnF5d',
    title: 'Full-Stack Developer',
    description: 'Buscamos un desarrollador Full-Stack familiarizado con Node.js, Express y React.',
    createdAt: '2024-01-30T11:00:00.000Z',
  },
]);

await connection.table('user').insert([
  {
    id: 'AcMJpL7b413Z',
    companyId: 'FjcJCHJALA4i',
    email: 'elena@unir.mx',
    password: 'elena123',
  },
  {
    id: 'BvBNW636Z89L',
    companyId: 'Gu7QW9LcnF5d',
    email: 'carlos@unir.mx',
    password: 'carlos123',
  },
]);

process.exit();
