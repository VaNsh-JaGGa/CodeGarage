const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'users',
    password: '2674',
    port: 5432,
});
module.exports = pool;