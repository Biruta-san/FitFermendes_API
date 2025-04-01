import { Request, Response } from "express";
import {
  atualizarUsuario,
  consultarAgendamentoId,
  consultarAgendamentoUsuario,
  consultarUsuario,
  inserirUsuario,
  listaUsuario,
  logUser,
} from "../services/userService";
import { getUsuarioAgendamento } from "../models/userModels";

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
 *                   hotelId:
 *                     type: integer
 *                     nullable: true
 *                   hotelNome:
 *                     type: string
 *                     nullable: true
 */
export async function getListaUsuario(req: Request, res: Response) {
  try {
    const usuario = await listaUsuario();
    if (!usuario)
      return res.status(404).json({ error: "Usuário não encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error });
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
 *                 hotelId:
 *                   type: integer
 *                   nullable: true
 *                 hotelNome:
 *                   type: string
 *                   nullable: true
 *       404:
 *         description: Usuário não encontrado
 */
export async function getUsuario(req: Request, res: Response) {
  try {
    const usuario = await consultarUsuario(parseInt(req.params.id, 10));
    if (!usuario)
      return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao consultar usuário" });
  }
}

/**
 * @swagger
 * /usuario/agendamentos/{id}:
 *   get:
 *     summary: Agendamentos de usuário
 *     description: Retorna os agendamentos de um usuário pelo ID
 *     tags:
 *       - Usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Sucesso ao consultar agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 123
 *                   checkIn:
 *                     type: string
 *                     format: date
 *                     example: "2023-08-10"
 *                   checkOut:
 *                     type: string
 *                     format: date
 *                     example: "2023-08-15"
 *                   checkInConfirmado:
 *                     type: boolean
 *                     example: true
 *                   checkOutConfirmado:
 *                     type: boolean
 *                     example: true
 *                   hotelId:
 *                     type: integer
 *                     example: 789
 *                   hotelNome:
 *                     type: string
 *                     example: "Hotel Example"
 *                   hotelEndereco:
 *                     type: string
 *                     example: "123 Rua Principal"
 *                   hotelQuartoId:
 *                     type: integer
 *                     example: 456
 *                   hotelQuartoNumero:
 *                     type: integer
 *                     example: 101
 *                   usuarioId:
 *                     type: integer
 *                     example: 1
 *                   usuarioNome:
 *                     type: string
 *                     example: "John Doe"
 *                   hotelImagens:
 *                     type: array
 *                     items:
 *                       type: string
 *                       nullable: true
 *                     example: ["imagem1.jpg", "imagem2.jpg", null]
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Usuário não encontrado"
 *       500:
 *         description: Erro ao consultar usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao consultar usuário"
 */
export async function getUsuarioAgendamento(req: Request, res: Response) {
  try {
    const usuarioAgendamentos: getUsuarioAgendamento[] | null =
      await consultarAgendamentoUsuario(parseInt(req.params.id, 10));
    if (!usuarioAgendamentos || usuarioAgendamentos.length === 0)
      return res.status(404).json({ error: "Usuário não encontrado" });
    res.status(200).json(usuarioAgendamentos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao consultar usuário" });
  }
}

/**
 * @swagger
 * /usuario/agendamento/{id}:
 *   get:
 *     summary: Agendamento de usuário
 *     description: Retorna o agendamento por ud
 *     tags:
 *       - Usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Sucesso ao consultar agendamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 123
 *                 checkIn:
 *                   type: string
 *                   format: date
 *                   example: "2023-08-10"
 *                 checkOut:
 *                   type: string
 *                   format: date
 *                   example: "2023-08-15"
 *                 checkInConfirmado:
 *                   type: boolean
 *                   example: true
 *                 checkOutConfirmado:
 *                   type: boolean
 *                   example: true
 *                 hotelId:
 *                   type: integer
 *                   example: 789
 *                 hotelNome:
 *                   type: string
 *                   example: "Hotel Example"
 *                 hotelEndereco:
 *                   type: string
 *                   example: "123 Rua Principal"
 *                 hotelQuartoId:
 *                   type: integer
 *                   example: 456
 *                 hotelQuartoNumero:
 *                   type: integer
 *                   example: 101
 *                 usuarioId:
 *                   type: integer
 *                   example: 1
 *                 usuarioNome:
 *                   type: string
 *                   example: "John Doe"
 *                 hotelImagens:
 *                   type: array
 *                   items:
 *                     type: string
 *                     nullable: true
 *                   example: ["imagem1.jpg", "imagem2.jpg", null]
 *       404:
 *         description: Agendamento não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Agendamento não encontrado"
 *       500:
 *         description: Erro ao consultar agendamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao consultar usuário"
 */
export async function getAgendamento(req: Request, res: Response) {
  try {
    const agendamento: getUsuarioAgendamento | null =
      await consultarAgendamentoId(parseInt(req.params.id, 10));
    if (!agendamento)
      return res.status(404).json({ error: "Agendamento não encontrado" });
    res.status(200).json(agendamento);
  } catch (error) {
    res.status(500).json({ error: "Erro ao consultar usuário" });
  }
}

/**
 * @swagger
 * /usuario/login:
 *   post:
 *     summary: Realiza login na aplicação
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
 *               - hotelId
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               hotelId:
 *                 type: integer
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
 *         description: Erro ao realizar login
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, senha, hotelId } = req.body;
    const token = await logUser({
      email: email,
      senha: senha,
      hotelId: hotelId,
    });
    if (!token)
      return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(token);
  } catch (error) {
    res.status(500).json({ error: "Erro ao realizar login" });
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
 *         description: Erro ao realizar login
 */
export async function getData(req: Request, res: Response) {
  try {
    res.json({ data: new Date() });
  } catch (error) {
    res.status(500).json({ error: "Erro ao realizar login" });
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
 *               hotelId:
 *                 type: integer
 *                 nullable: true
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
 *                 hotelId:
 *                   type: integer
 *                   nullable: true
 *                 hotelNome:
 *                   type: string
 *                   nullable: true
 */
export async function postUsuario(req: Request, res: Response) {
  try {
    const usuario = await inserirUsuario(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro Inserindo usuário" });
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
 *               hotelId:
 *                 type: integer
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
 *                 hotelId:
 *                   type: integer
 *                   nullable: true
 *                 hotelNome:
 *                   type: string
 *                   nullable: true
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
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro atualizando usuário" });
  }
}
