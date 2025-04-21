import { Router } from "express";
import { authenticateToken } from "../middleware";
import { getListaStatusAula, postStatusAula, putStatusAula } from "../controllers/statusAulaController";

// Inicializando rotas de status de aula
const statusAulaRoutes = Router();

// #region  ROTAS

// Rota para get de todos os status de aulas
statusAulaRoutes.get("/lista", authenticateToken, getListaStatusAula);

// Rota para post de status de aula
statusAulaRoutes.post("/", authenticateToken, postStatusAula);

// Rota para put de status de aula
statusAulaRoutes.put("/:id", authenticateToken, putStatusAula);

// #endregion

export default statusAulaRoutes;
