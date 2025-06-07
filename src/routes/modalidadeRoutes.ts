import { Router } from "express";
import { authenticateToken } from "../middleware";
import {
  getListaModalidade,
  getModalidade,
  postModalidade,
  putModalidade,
} from "../controllers/modalidadeController";

// Inicializando rotas de modalidade
const modalidadeRoutes = Router();

// #region  ROTAS

// Rota para get de todos os modalidades
modalidadeRoutes.get("/lista", authenticateToken, getListaModalidade);

// Rota para post de modalidade
modalidadeRoutes.post("/", authenticateToken, postModalidade);

// Rota para put de modalidade
modalidadeRoutes.put("/:id", authenticateToken, putModalidade);

// get por id de modalidade
modalidadeRoutes.get("/:id", authenticateToken, getModalidade);

// #endregion

export default modalidadeRoutes;
