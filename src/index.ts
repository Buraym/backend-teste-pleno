import app from "./app";
import GetConnection from "../config/db";
import "dotenv/config";

const PORT = process.env.SERVER_PORT || 8000;

(async () => {
  try {
    const db = await GetConnection();
    await db.authenticate();
    await db.sync();

    app.listen(PORT, () => {
      console.log(`SERVIDOR ATIVO RODANDO NA PORTA ${PORT}`);
    });
  } catch (error) {
    console.error("HOUVE UM ERRO AO ATIVAR O SERVIDOR", error);
  }
})();
