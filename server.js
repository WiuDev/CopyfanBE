require("dotenv").config();
require("./src/models/Associations");
const app = require("./app");
const sequelize = require("./src/database");

require('./src/models/Associations')

const APP_PORT = process.env.APP_PORT;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL conectado com sucesso!");
    await sequelize.sync({ alter: true });
    app.listen(APP_PORT, () => {
      console.log(`Servidor rodando na porta ${APP_PORT}`);
    });
  } catch (error) {
    console.error("Erro ao conectar ao PostgreSQL:", error);
    process.exit(1);
  }
}

startServer();