import app from "./app";
import { conn } from "../config/db";
import "dotenv/config";

const PORT = process.env.SERVER_PORT || 8000;

(async () => {
  try {
    await conn.authenticate();
    await conn.sync();

    app.listen(PORT, () => {
      console.log(`SERVIDOR ATIVO RODANDO NA PORTA ${PORT}`);
    });
  } catch (error) {
    console.error("HOUVE UM ERRO AO ATIVAR O SERVIDOR", error);
  }
})();
