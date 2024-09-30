import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { router } from "./router";

const app = express();
const port = 4000;

app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors({ origin: "*" }));

app.all("/", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(router);

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
