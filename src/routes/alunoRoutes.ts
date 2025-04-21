import { Router } from "express";
import { authenticateToken } from "../middleware";
import {
  getAluno,
  getListaAluno,
  postAluno,
  putAluno,
} from "../controllers/alunoController";

// Inicializando rotas de aluno
const alunoRoutes = Router();

// #region  ROTAS

// Rota para get de todos os alunos
alunoRoutes.get("/lista", authenticateToken, getListaAluno);

// Rota para get de aluno por id
alunoRoutes.get("/:id", authenticateToken, getAluno);

// Rota para post de aluno
alunoRoutes.post("/", authenticateToken, postAluno);

// Rota para put de aluno
alunoRoutes.put("/:id", authenticateToken, putAluno);

// #endregion

export default alunoRoutes;
