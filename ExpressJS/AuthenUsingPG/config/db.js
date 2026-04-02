const { Pool } = require('pg');
// imported the pool class from pg package , it allows us to interact with the DB 
require('dotenv').config();
//this allows us to use the .env configuration through process.env.variable_name

//created a object pool which have a connection with the database
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

module.exports = pool;