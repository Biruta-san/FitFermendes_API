import { Router } from "express";
import {
  getAgendamento,
  getData,
  getListaUsuario,
  getUsuario,
  getUsuarioAgendamento,
  login,
  postUsuario,
  putUsuario,
} from "../controllers/userController";
import { authenticateToken } from "../middleware";

// Inicializando rotas de usuário
const userRoutes = Router();

// #region  ROTAS

// Rota para get de todos os usuários
userRoutes.get("/lista", authenticateToken, getListaUsuario);

// Rota para get de usuário por id
userRoutes.get("/:id", authenticateToken, getUsuario);

// Rota para get agendamentos de usuário
userRoutes.get("/agendamentos/:id", authenticateToken, getUsuarioAgendamento);

// Rota para get agendamentos de usuário
userRoutes.get("/agendamento/:id", authenticateToken, getAgendamento);

// Rota para post de usuário
userRoutes.post("/", authenticateToken, postUsuario);

// Rota para put de usuário
userRoutes.put("/:id", authenticateToken, putUsuario);

// Realiza login
userRoutes.post("/login", login);

// Realiza login
userRoutes.post("/data", getData);

// #endregion

export default userRoutes;
