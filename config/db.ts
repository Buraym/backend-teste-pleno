import { Sequelize } from "sequelize";
import "dotenv/config";

export async function GetConnection() {
  const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASS!,
    {
      host: process.env.DB_HOST!,
      dialect: "postgres",
      logging: false,
    }
  );
  try {
    await sequelize.authenticate();
    console.log("CONEXÃO COM O BANCO DE DADOS ESTABELECIDA COM SUCESSO !");
  } catch (error) {
    console.error(
      "NÃO FOI POSSÍVEL ESTABELECER CONEXÃO COM O BANCO DE DADOS",
      error
    );
  }

  return sequelize;
}
