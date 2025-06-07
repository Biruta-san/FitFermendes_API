import { Request, Response } from "express";
import {
  atualizarUsuario,
  consultarUsuario,
  inserirUsuario,
  listaUsuario,
  solicitarRecuperacaoSenha,
  validar2FA,
  validarCredenciais,
  validarRecuperacaoSenha,
} from "../services/userService";
import { getErrorMessage, sendError, sendSuccess } from "../utils/apiFunctions";
import { getUsuario, loginUsuarioResponse } from "../models/userModels";

/**
 * @swagger
 * tags:
 *   - name: Usuário
 *     description: Endpoints relacionados a usuários
 */

/**
 * @swagger
 * /usuario/lista:
 *   get:
 *     summary: Retorna uma lista de usuários
 *     tags:
 *       - Usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Uma lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   email:
 *                     type: string
 */
export async function getListaUsuario(req: Request, res: Response) {
  try {
    const usuario = await listaUsuario();
    if (!usuario)
      return sendError(
        res,
        404,
        "Erro ao consultar usuários",
        "Usuários não encontrados"
      );
    return sendSuccess<getUsuario[]>(res, usuario, "consultados com sucesso");
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao consultar usuários",
      getErrorMessage(error)
    );
  }
}

/**
 * @swagger
 * /usuario/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags:
 *       - Usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser consultado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Um Usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuário não encontrado
 */
export async function getUsuario(req: Request, res: Response) {
  try {
    const usuario = await consultarUsuario(parseInt(req.params.id, 10));
    if (!usuario)
      return sendError(
        res,
        404,
        "Erro ao consultar usuário",
        "Usuário não encontrado"
      );
    return sendSuccess<getUsuario>(res, usuario, "consultado com sucesso");
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao consultar usuário",
      getErrorMessage(error)
    );
  }
}

/**
 * @swagger
 * /usuario/loginEmail:
 *   post:
 *     summary: Verifica credenciais de login (email e senha)
 *     tags:
 *       - Usuário
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@example.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: senhaSegura123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso
 *       400:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Credenciais inválidas
 *                 message:
 *                   type: string
 *                   example: Email ou senha incorretos
 *       500:
 *         description: Erro interno ao realizar login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Erro ao realizar login
 *                 message:
 *                   type: string
 *                   example: Erro desconhecido
 */
export async function logEmailSenha(req: Request, res: Response) {
  try {
    const { email, senha } = req.body;
    const validado = await validarCredenciais({ email, senha });

    if (!validado) {
      return sendError(
        res,
        400,
        "Credenciais inválidas",
        "Email ou senha incorretos"
      );
    }
    return sendSuccess<string>(res, validado, "Login realizado com sucesso");
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao realizar login",
      getErrorMessage(error)
    );
  }
}

/**
 * @swagger
 * /usuario/2fa:
 *   post:
 *     summary: Valida o código de autenticação 2FA
 *     tags:
 *       - Usuário
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - verificador
 *               - codigo
 *             properties:
 *               verificador:
 *                 type: string
 *                 example: "ZXY1234TOKEN"
 *               codigo:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Código 2FA validado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     usuario:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         nome:
 *                           type: string
 *                           example: "João Silva"
 *                         email:
 *                           type: string
 *                           example: "joao@email.com"
 *                 message:
 *                   type: string
 *                   example: Código de verificação validado
 *       400:
 *         description: Código 2FA inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Código inválido
 *                 message:
 *                   type: string
 *                   example: Código de verificação inválido
 *       500:
 *         description: Erro interno ao validar 2FA
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Erro ao realizar login
 *                 message:
 *                   type: string
 *                   example: Erro inesperado
 */
export async function log2FA(req: Request, res: Response) {
  try {
    const { verificador, codigo } = req.body;

    const response = await validar2FA(verificador, codigo);

    if (!response) {
      return sendError(
        res,
        400,
        "Código inválido",
        "Código de verificação inválido"
      );
    }

    return sendSuccess<loginUsuarioResponse>(
      res,
      response,
      "Código de verificação validado"
    );
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao realizar login",
      getErrorMessage(error)
    );
  }
}

/**
 * @swagger
 * /usuario/data:
 *   post:
 *     summary: Realiza login na aplicação
 *     tags:
 *       - Usuário
 *     security: []
 *     responses:
 *       200:
 *         description: Um Usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao consultar data
 */
export async function getData(req: Request, res: Response) {
  try {
    return sendSuccess<Date>(res, new Date(), "Data consultada com sucesso");
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao consultar data",
      getErrorMessage(error)
    );
  }
}

/**
 * @swagger
 * /usuario:
 *   post:
 *     summary: Insere um usuário e retorna o usuário inserido
 *     tags:
 *       - Usuário
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Um usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 email:
 *                   type: string
 */
export async function postUsuario(req: Request, res: Response) {
  try {
    const usuario = await inserirUsuario(req.body);
    if (!usuario)
      return sendError(
        res,
        400,
        "Erro ao inserir usuário",
        "Usuário não inserido"
      );
    return sendSuccess<getUsuario>(res, usuario, "Inserido com sucesso");
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao inserir usuário",
      getErrorMessage(error)
    );
  }
}

/**
 * @swagger
 * /usuario/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags:
 *       - Usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Requisição inválida
 *       500:
 *         description: Erro no servidor
 */
export async function putUsuario(req: Request, res: Response) {
  try {
    const usuario = await atualizarUsuario(
      parseInt(req.params.id, 10),
      req.body
    );
    if (!usuario)
      return sendError(
        res,
        400,
        "Erro ao atualizar usuário",
        "Usuário não atualizado"
      );
    return sendSuccess<getUsuario>(res, usuario, "Atualizado com sucesso");
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao atualizar usuário",
      getErrorMessage(error)
    );
  }
}

// #region RECUPERAR SENHA
/**
 * @swagger
 * /usuario/solicitarRecuperacao:
 *   post:
 *     summary: Solicita recuperação de senha para um usuário
 *     tags:
 *       - Usuário
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@example.com
 *     responses:
 *       200:
 *         description: Solicitação de recuperação enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Solicitação enviada com sucesso
 *       400:
 *         description: Email não encontrado ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Email inválido
 *                 message:
 *                   type: string
 *                   example: Não foi possível localizar o email informado
 *       500:
 *         description: Erro interno ao solicitar recuperação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Erro ao solicitar recuperação
 *                 message:
 *                   type: string
 *                   example: Erro desconhecido
 */
export async function solicitarRecuperacao(req: Request, res: Response) {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return sendError(
        res,
        400,
        "Email inválido",
        "O campo 'email' é obrigatório e deve ser uma string válida"
      );
    }

    const resultado = await solicitarRecuperacaoSenha(email);

    if (!resultado) {
      return sendError(
        res,
        400,
        "Email inválido",
        "Não foi possível localizar o email informado"
      );
    }

    return sendSuccess<string>(
      res,
      resultado,
      "Solicitação enviada com sucesso"
    );
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao solicitar recuperação",
      getErrorMessage(error)
    );
  }
}

/**
 * @swagger
 * /usuario/recuperarSenha:
 *   post:
 *     summary: Recupera a senha do usuário com base no código de verificação
 *     tags:
 *       - Usuário
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - novaSenha
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: "17919c55-0de6-44ea-b3c5-009c0539012a"
 *               novaSenha:
 *                 type: string
 *                 format: password
 *                 example: "novaSenhaSegura123"
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Senha alterada com sucesso
 *       400:
 *         description: Código inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Código inválido
 *                 message:
 *                   type: string
 *                   example: Código de recuperação inválido ou expirado
 *       500:
 *         description: Erro interno ao tentar redefinir a senha
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Erro ao redefinir senha
 *                 message:
 *                   type: string
 *                   example: Erro inesperado
 */
export async function recuperarSenha(req: Request, res: Response) {
  try {
    const { codigo, novaSenha } = req.body;

    if (!codigo || !novaSenha) {
      return sendError(
        res,
        400,
        "Dados inválidos",
        "Código e nova senha são obrigatórios"
      );
    }

    const resultado = await validarRecuperacaoSenha(codigo, novaSenha);

    if (!resultado) {
      return sendError(
        res,
        400,
        "Código inválido",
        "Código de recuperação inválido ou expirado"
      );
    }

    return sendSuccess<boolean>(res, true, "Senha alterada com sucesso");
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao redefinir senha",
      getErrorMessage(error)
    );
  }
}

// #endregion RECUPERAR SENHA
