import { Request, Response } from "express";
import {
  atualizarAluno,
  consultarAluno,
  inserirAluno,
  listaAluno,
} from "../services/alunoService";

/**
 * @swagger
 * tags:
 *   - name: Aluno
 *     description: Endpoints relacionados a usuários
 */

/**
 * @swagger
 * /aluno/lista:
 *   get:
 *     summary: Retorna uma lista de usuários
 *     tags:
 *       - Aluno
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
export async function getListaAluno(req: Request, res: Response) {
  try {
    const aluno = await listaAluno();
    if (!aluno) return res.status(404).json({ error: "Aluno não encontrado" });
    res.status(200).json(aluno);
  } catch (error) {
    res.status(500).json({ error });
  }
}

/**
 * @swagger
 * /aluno/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags:
 *       - Aluno
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
 *         description: Um Aluno
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
 *         description: Aluno não encontrado
 */
export async function getAluno(req: Request, res: Response) {
  try {
    const aluno = await consultarAluno(parseInt(req.params.id, 10));
    if (!aluno) return res.status(404).json({ error: "Aluno não encontrado" });
    res.json(aluno);
  } catch (error) {
    res.status(500).json({ error: "Erro ao consultar usuário" });
  }
}

/**
 * @swagger
 * /aluno:
 *   post:
 *     summary: Insere um usuário e retorna o usuário inserido
 *     tags:
 *       - Aluno
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
export async function postAluno(req: Request, res: Response) {
  try {
    const aluno = await inserirAluno(req.body);
    res.status(201).json(aluno);
  } catch (error) {
    res.status(500).json({ error: "Erro Inserindo usuário" });
  }
}

/**
 * @swagger
 * /aluno/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags:
 *       - Aluno
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
 *         description: Aluno atualizado com sucesso
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
export async function putAluno(req: Request, res: Response) {
  try {
    const aluno = await atualizarAluno(parseInt(req.params.id, 10), req.body);
    res.status(200).json(aluno);
  } catch (error) {
    res.status(500).json({ error: "Erro atualizando usuário" });
  }
}
