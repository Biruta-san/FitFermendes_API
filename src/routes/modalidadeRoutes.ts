import { Router } from "express";
import { authenticateToken } from "../middleware";
import { getListaModalidade, postModalidade, putModalidade } from "../controllers/modalidadeController";

// Inicializando rotas de modalidade
const modalidadeRoutes = Router();

// #region  ROTAS

// Rota para get de todos os modalidades
modalidadeRoutes.get("/lista", authenticateToken, getListaModalidade);

// Rota para post de modalidade
modalidadeRoutes.post("/", authenticateToken, postModalidade);

// Rota para put de modalidade
modalidadeRoutes.put("/:id", authenticateToken, putModalidade);

// #endregion

export default modalidadeRoutes;
