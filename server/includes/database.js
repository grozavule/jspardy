require('dotenv').config();
let {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;
const Sequelize = require('sequelize');

const connection = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: false
});

module.exports = connection;