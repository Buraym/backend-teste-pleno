import express from "express";
import paycheckRouter from "./routes/paycheck";
import paycheckIndexRouter from "./routes/paycheckIndex";
import spotRouter from "./routes/spot";

const app = express();
app.use(express.json());

app.use("/paychecks", paycheckRouter);
app.use("/paycheck-indexes", paycheckIndexRouter);
app.use("/spots", spotRouter);

export default app;
