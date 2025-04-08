import { Router } from "express";
import { authenticateToken } from "../middleware";
import {
  getAluno,
  getListaAluno,
  postAluno,
  putAluno,
} from "../controllers/alunoController";

// Inicializando rotas de usuário
const alunoRoutes = Router();

// #region  ROTAS

// Rota para get de todos os usuários
alunoRoutes.get("/lista", authenticateToken, getListaAluno);

// Rota para get de usuário por id
alunoRoutes.get("/:id", authenticateToken, getAluno);

// Rota para post de usuário
alunoRoutes.post("/", authenticateToken, postAluno);

// Rota para put de usuário
alunoRoutes.put("/:id", authenticateToken, putAluno);

// #endregion

export default alunoRoutes;
