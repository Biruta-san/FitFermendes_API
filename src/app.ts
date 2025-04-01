import express, { Express } from "express";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";

// Inicializando express
const app: Express = express();

// Configurando ambiente
dotenv.config();

// Redirecionamento da raiz para /api-docs
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

app.use(express.json());

// #region ROTAS
app.use("/usuario", userRoutes);

// #endregion

export default app;
