import { Router } from "express";
import { authenticateToken } from "../middleware";
import {
  getAula,
  getListaAula,
  patchCancelarAula,
  patchConcluirAula,
  postAula,
  putAula,
} from "../controllers/aulaController";

// Inicializando rotas de aula
const aulaRoutes = Router();

// #region ROTAS

// Rota para get de aula por id
aulaRoutes.get("/:id", authenticateToken, getAula);

// Rota para get de todos os aulas
aulaRoutes.get("/lista", authenticateToken, getListaAula);

// Rota para post de aula
aulaRoutes.post("/", authenticateToken, postAula);

// Rota para put de aula
aulaRoutes.put("/:id", authenticateToken, putAula);

// Rota para patch de aula
aulaRoutes.patch("/cancelar/:id", authenticateToken, patchCancelarAula);

// Rota para patch de aula
aulaRoutes.patch("/concluir/:id", authenticateToken, patchConcluirAula);

// #endregion

export default aulaRoutes;
