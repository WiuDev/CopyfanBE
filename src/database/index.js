const {Sequelize} = require("sequelize");
require("dotenv").config();

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DB = process.env.DB_NAME;
const PORT = process.env.DB_PORT

const sequelize = new Sequelize(DB, USER, PASSWORD, {
    host: HOST,
    port: PORT,
    dialect: "postgres",
    logging: false,
});

module.exports = sequelize;