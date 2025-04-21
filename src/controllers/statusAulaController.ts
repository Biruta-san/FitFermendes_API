import { Request, Response } from "express";
import { getErrorMessage, sendError, sendSuccess } from "../utils/apiFunctions";
import {
  atualizarStatusAula,
  inserirStatusAula,
  listaStatusAula,
} from "../services/statusAulaService";
import { getStatusAula } from "../models/statusAulaModels";

/**
 * @swagger
 * tags:
 *   - name: Status Aula
 *     description: Endpoints relacionados a status de aula
 */

/**
 * @swagger
 * /statusAula/lista:
 *   get:
 *     summary: Retorna uma lista de status de aula
 *     tags:
 *       - Status Aula
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de status de aula retornada com sucesso
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
 *         description: Status de Aula não encontradas
 *       500:
 *         description: Erro interno ao buscar status de aula
 */
export async function getListaStatusAula(req: Request, res: Response) {
  try {
    const statusAula = await listaStatusAula();
    if (!statusAula) {
      return sendError(
        res,
        404,
        "Erro ao consultar status de aula",
        "Status de Aula não encontrado"
      );
    }
    return sendSuccess<getStatusAula[]>(
      res,
      statusAula,
      "Consultados com sucesso"
    );
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao consultar status de aula",
      getErrorMessage(error)
    );
  }
}

/**
 * @swagger
 * /statusAula:
 *   post:
 *     summary: Insere um status de aula e a retorna
 *     tags:
 *       - Status Aula
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
 *         description: Status de Aula inserido com sucesso
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
 *         description: Status de Aula não encontrada
 *       500:
 *         description: Erro interno ao inserir status de aula
 */
export async function postStatusAula(req: Request, res: Response) {
  try {
    const statusAula = await inserirStatusAula(req.body);

    if (!statusAula) {
      return sendError(
        res,
        404,
        "Erro ao inserir status de aula",
        "Status de Aula não encontrada"
      );
    }
    return sendSuccess<getStatusAula>(res, statusAula, "inserido com sucesso");
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao inserir status de aula",
      getErrorMessage(error)
    );
  }
}

/**
 * @swagger
 * /statusAula/{id}:
 *   put:
 *     summary: Atualiza uma status de aula existente
 *     tags:
 *       - Status Aula
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do status de aula a ser atualizado
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
 *         description: Status de Aula atualizado com sucesso
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
 *         description: Erro interno ao atualizar status de aula
 */
export async function putStatusAula(req: Request, res: Response) {
  try {
    const statusAula = await atualizarStatusAula(
      parseInt(req.params.id, 10),
      req.body
    );
    if (!statusAula)
      return sendError(
        res,
        400,
        "Erro ao atualizar status de aula",
        "Status de Aula não atualizado"
      );
    return sendSuccess<getStatusAula>(
      res,
      statusAula,
      "Atualizado com sucesso"
    );
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao atualizar status de aula",
      getErrorMessage(error)
    );
  }
}
