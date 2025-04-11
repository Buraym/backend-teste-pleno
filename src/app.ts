import express from "express";
import paycheckRouter from "./routes/paycheckRoutes";

const app = express();
app.use(express.json());
app.use("/paychecks", paycheckRouter);

export default app;
