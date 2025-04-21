import express, { Express } from "express";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";
import modalidadeRoutes from "./routes/modalidadeRoutes";
import alunoRoutes from "./routes/alunoRoutes";
import statusAulaRoutes from "./routes/statusAulaRoutes";
import aulaRoutes from "./routes/aulaRoutes";

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
app.use("/modalidade", modalidadeRoutes);
app.use("/aluno", alunoRoutes);
app.use("/statusAula", statusAulaRoutes);
app.use("/aula", aulaRoutes);

// #endregion

export default app;
