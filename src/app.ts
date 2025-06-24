import express, { Express } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";
import modalidadeRoutes from "./routes/modalidadeRoutes";
import alunoRoutes from "./routes/alunoRoutes";
import statusAulaRoutes from "./routes/statusAulaRoutes";
import aulaRoutes from "./routes/aulaRoutes";

dotenv.config();

// Inicializando express
const app: Express = express();

// #region CORS
const corsOptions: cors.CorsOptions = {
  origin: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
// #endregion CORS

// JSON parser
app.use(express.json());

// Raiz redireciona para swagger
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

// #region ROTAS
app.use("/usuario", userRoutes);
app.use("/modalidade", modalidadeRoutes);
app.use("/aluno", alunoRoutes);
app.use("/statusAula", statusAulaRoutes);
app.use("/aula", aulaRoutes);
// #endregion

export default app;
