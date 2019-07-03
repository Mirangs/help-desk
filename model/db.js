const connection = require('mysql-promise')();
const dotenv = require('dotenv');

dotenv.config();

connection.configure(process.env.CONNECTION_STRING);

module.exports = connection;
