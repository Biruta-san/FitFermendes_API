import { Request, Response } from "express";
import {
    atualizarModalidade,
  inserirModalidade,
  listaModalidade,
} from "../services/modalidadeService";

/**
 * @swagger
 * tags:
 *   - name: Modalidade
 *     description: Endpoints relacionados a modalidade
 */

/**
 * @swagger
 * /modalidade/lista:
 *   get:
 *     summary: Retorna uma lista de modalidades
 *     tags:
 *       - Modalidade
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Uma lista de modalidades
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
 */
export async function getListaModalidade(req: Request, res: Response) {
  try {
    const modalidade = await listaModalidade();
    if (!modalidade)
      return res.status(404).json({ error: "Modalidade não encontrada" });
    res.status(200).json(modalidade);
  } catch (error) {
    res.status(500).json({ error });
  }
}

/**
 * @swagger
 * /modalidade:
 *   post:
 *     summary: Insere uma modalidade e a retorna
 *     tags:
 *       - Modalidade
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
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       201:
 *         description: Uma modalidade
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 */
export async function postModalidade(req: Request, res: Response) {
  try {
    const modalidade = await inserirModalidade(req.body);
    res.status(201).json(modalidade);
  } catch (error) {
    res.status(500).json({ error: "Erro Inserindo usuário" });
  }
}

/**
 * @swagger
 * /modalidade/{id}:
 *   put:
 *     summary: Atualiza uma modalidade existente
 *     tags:
 *       - Modalidade
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da modalidade a ser atualizada
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
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       200:
 *         description: Modalidade atualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *       400:
 *         description: Requisição inválida
 *       500:
 *         description: Erro no servidor
 */
export async function putModalidade(req: Request, res: Response) {
  try {
    const modalidade = await atualizarModalidade(
      parseInt(req.params.id, 10),
      req.body
    );
    res.status(200).json(modalidade);
  } catch (error) {
    res.status(500).json({ error: "Erro atualizando usuário" });
  }
}
