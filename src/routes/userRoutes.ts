import { Router } from "express";
import {
  getData,
  getListaUsuario,
  getUsuario,
  log2FA,
  logEmailSenha,
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

// Rota para post de usuário
userRoutes.post("/", authenticateToken, postUsuario);

// Rota para put de usuário
userRoutes.put("/:id", authenticateToken, putUsuario);

// Realiza login com email e senha
userRoutes.post("/loginEmail", logEmailSenha);

// Realiza validação de 2FA
userRoutes.post("/2fa", log2FA);

// Consultar data
userRoutes.post("/data", getData);

// #endregion

export default userRoutes;
