import { Request, Response } from "express";
import {
  atualizarModalidade,
  inserirModalidade,
  listaModalidade,
} from "../services/modalidadeService";
import { getErrorMessage, sendError, sendSuccess } from "../utils/apiFunctions";
import { getModalidade } from "../models/modalidadeModels";

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
 *         description: Lista de modalidades retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Consultados com sucesso
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nome:
 *                         type: string
 *                         example: Musculação
 *       404:
 *         description: Modalidades não encontradas
 *       500:
 *         description: Erro interno ao buscar modalidades
 */
export async function getListaModalidade(req: Request, res: Response) {
  try {
    const modalidade = await listaModalidade();
    if (!modalidade) {
      return sendError(
        res,
        404,
        "Erro ao consultar modalidades",
        "Modalidades não encontradas"
      );
    }
    return sendSuccess<getModalidade[]>(
      res,
      modalidade,
      "Consultados com sucesso"
    );
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao consultar modalidades",
      getErrorMessage(error)
    );
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
 *                 example: Pilates
 *     responses:
 *       201:
 *         description: Modalidade inserida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: inserido com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: Pilates
 *       404:
 *         description: Modalidade não encontrada
 *       500:
 *         description: Erro interno ao inserir modalidade
 */
export async function postModalidade(req: Request, res: Response) {
  try {
    const modalidade = await inserirModalidade(req.body);

    if (!modalidade) {
      return sendError(
        res,
        404,
        "Erro ao inserir modalidade",
        "Modalidade não encontrada"
      );
    }
    return sendSuccess<getModalidade>(res, modalidade, "inserido com sucesso");
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao inserir modalidade",
      getErrorMessage(error)
    );
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
 *                 example: Funcional
 *     responses:
 *       200:
 *         description: Modalidade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Atualizado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     nome:
 *                       type: string
 *                       example: Funcional
 *       400:
 *         description: Requisição inválida
 *       500:
 *         description: Erro interno ao atualizar modalidade
 */
export async function putModalidade(req: Request, res: Response) {
  try {
    const modalidade = await atualizarModalidade(
      parseInt(req.params.id, 10),
      req.body
    );
    if (!modalidade)
      return sendError(
        res,
        400,
        "Erro ao atualizar modalidade",
        "Usuário não atualizado"
      );
    return sendSuccess<getModalidade>(
      res,
      modalidade,
      "Atualizado com sucesso"
    );
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao atualizar modalidade",
      getErrorMessage(error)
    );
  }
}
