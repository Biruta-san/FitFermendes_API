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
// Origem permitida — defina via variável de ambiente no Render
const allowedOrigins = [process.env.WEB_APP_URL || "http://localhost:3000"];
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true, // permite cookies/autenticação
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204, // compatibilidade com navegadores antigos :contentReference[oaicite:1]{index=1}
};

// Aplica antes do JSON e das rotas
app.use(cors(corsOptions));
// Pode ser redundante, mas garante resposta a preflights
app.options("*", cors(corsOptions));
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
