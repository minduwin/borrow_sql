const { Pool } = require('pg');
require('dotenv').config();

const inv_host = process.env.INV_HOST;
const inv_user = process.env.INV_USER;
const inv_database = process.env.INV_DATABASE;
const inv_pwd = process.env.INV_PWD;
const inv_port = process.env.INV_PORT;

module.exports = new Pool({
    host: `${inv_host}`,
    user: `${inv_user}`,
    database: `${inv_database}`,
    password: `${inv_pwd}`,
    port: `${inv_port}`,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: true,
});