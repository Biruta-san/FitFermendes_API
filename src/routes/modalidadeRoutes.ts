import { Router } from "express";
import { authenticateToken } from "../middleware";
import { getListaModalidade, postModalidade, putModalidade } from "../controllers/modalidadeController";

// Inicializando rotas de usuário
const modalidadeRoutes = Router();

// #region  ROTAS

// Rota para get de todos os usuários
modalidadeRoutes.get("/lista", authenticateToken, getListaModalidade);

// Rota para post de usuário
modalidadeRoutes.post("/", authenticateToken, postModalidade);

// Rota para put de usuário
modalidadeRoutes.put("/:id", authenticateToken, putModalidade);

// #endregion

export default modalidadeRoutes;
