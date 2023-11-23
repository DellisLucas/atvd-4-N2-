// database/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'PI',
  password: 'ifsp',
  port: 5432, // Porta padrão do PostgreSQL
});

module.exports = pool;
