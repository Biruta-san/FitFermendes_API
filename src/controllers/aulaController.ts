import { Request, Response } from "express";
import {
  atualizarAula,
  atualizarAulaStatus,
  consultarAula,
  inserirAula,
  listaAula,
} from "../services/aulaService";
import { getAula } from "../models/aulaModels";
import { getErrorMessage, sendError, sendSuccess } from "../utils/apiFunctions";
import { StatusAula } from "../utils/enums";

/**
 * @swagger
 * tags:
 *   - name: Aula
 *     description: Endpoints relacionados a Aula
 */

/**
 * @swagger
 * /aula/{id}:
 *   get:
 *     summary: Consulta uma aula pelo ID
 *     tags:
 *       - Aula
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da aula a ser consultada
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Aula consultada com sucesso
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
 *                       example: 1
 *                     modalidadeId:
 *                       type: integer
 *                       example: 2
 *                     modalidadeNome:
 *                       type: string
 *                       example: Pilates
 *                     observacao:
 *                       type: string
 *                       nullable: true
 *                       example: Aula de reabilitação
 *                     data:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-04-21T14:00:00.000Z
 *                     statusAulaId:
 *                       type: integer
 *                       example: 1
 *                     statusAulaNome:
 *                       type: string
 *                       example: Ativa
 *                     alunos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           nome:
 *                             type: string
 *                             example: João da Silva
 *                           email:
 *                             type: string
 *                             nullable: true
 *                             example: joao@email.com
 *                           telefone:
 *                             type: string
 *                             nullable: true
 *                             example: (11) 91234-5678
 *       400:
 *         description: Aula não encontrada
 *       500:
 *         description: Erro interno ao consultar aula
 */
export async function getAula(req: Request, res: Response) {
  try {
    const aula = await consultarAula(parseInt(req.params.id, 10));
    if (!aula)
      return sendError(
        res,
        400,
        "Erro ao atualizar aula",
        "Usuário não atualizado"
      );
    return sendSuccess<getAula>(res, aula, "Atualizado com sucesso");
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao atualizar aula",
      getErrorMessage(error)
    );
  }
}

/**
 * @swagger
 * /aula/lista:
 *   get:
 *     summary: Retorna uma lista de Aulas
 *     tags:
 *       - Aula
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Data inicial para filtrar as aulas
 *       - in: query
 *         name: dataFim
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Data final para filtrar as aulas
 *     responses:
 *       200:
 *         description: Lista de Aulas retornada com sucesso
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
 *                       modalidadeId:
 *                         type: integer
 *                         example: 2
 *                       modalidadeNome:
 *                         type: string
 *                         example: Musculação
 *                       observacao:
 *                         type: string
 *                         nullable: true
 *                         example: Aula com foco em resistência
 *                       data:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-04-21T14:30:00Z
 *                       statusAulaId:
 *                         type: integer
 *                         example: 1
 *                       statusAulaNome:
 *                         type: string
 *                         example: Confirmada
 *                       alunos:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 3
 *                             nome:
 *                               type: string
 *                               example: João da Silva
 *                             email:
 *                               type: string
 *                               nullable: true
 *                               example: joao@email.com
 *                             telefone:
 *                               type: string
 *                               nullable: true
 *                               example: "(11) 91234-5678"
 *       404:
 *         description: Aulas não encontradas
 *       500:
 *         description: Erro interno ao buscar Aulas
 */
export async function getListaAula(req: Request, res: Response) {
  try {
    const dataInicio = req.query?.dataInicio
      ? new Date(req.query.dataInicio as string)
      : null;
    const dataFim = req.query?.dataFim
      ? new Date(req.query.dataFim as string)
      : null;

    const aula = await listaAula(dataInicio, dataFim);
    if (!aula) {
      return sendError(
        res,
        404,
        "Erro ao consultar aulas",
        "Aulas não encontradas"
      );
    }
    return sendSuccess<getAula[]>(res, aula, "Consultados com sucesso");
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao consultar aulas",
      getErrorMessage(error)
    );
  }
}

/**
 * @swagger
 * /aula:
 *   post:
 *     summary: Insere uma aula e a retorna
 *     tags:
 *       - Aula
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modalidadeId
 *               - data
 *             properties:
 *               modalidadeId:
 *                 type: integer
 *                 example: 2
 *               observacao:
 *                 type: string
 *                 nullable: true
 *                 example: Aula voltada para iniciantes
 *               data:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-04-21T14:30:00Z
 *               statusAulaId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               alunos:
 *                 type: array
 *                 nullable: true
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: Aula inserida com sucesso
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
 *                     modalidadeId:
 *                       type: integer
 *                       example: 2
 *                     modalidadeNome:
 *                       type: string
 *                       example: Musculação
 *                     observacao:
 *                       type: string
 *                       nullable: true
 *                       example: Aula voltada para resistência
 *                     data:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-04-21T14:30:00Z
 *                     statusAulaId:
 *                       type: integer
 *                       example: 1
 *                     statusAulaNome:
 *                       type: string
 *                       example: Confirmada
 *                     alunos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           nome:
 *                             type: string
 *                             example: João da Silva
 *                           email:
 *                             type: string
 *                             nullable: true
 *                             example: joao@email.com
 *                           telefone:
 *                             type: string
 *                             nullable: true
 *                             example: "(11) 91234-5678"
 *       404:
 *         description: Aula não encontrada
 *       500:
 *         description: Erro interno ao inserir aula
 */
export async function postAula(req: Request, res: Response) {
  try {
    const aula = await inserirAula(req.body);

    if (!aula) {
      return sendError(res, 404, "Erro ao inserir aula", "Aula não encontrada");
    }
    return sendSuccess<getAula>(res, aula, "inserido com sucesso");
  } catch (error) {
    return sendError(res, 500, "Erro ao inserir aula", getErrorMessage(error));
  }
}

/**
 * @swagger
 * /aula/{id}:
 *   put:
 *     summary: Atualiza uma aula existente
 *     tags:
 *       - Aula
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da aula a ser atualizada
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - modalidadeId
 *               - data
 *             properties:
 *               modalidadeId:
 *                 type: integer
 *                 example: 2
 *               observacao:
 *                 type: string
 *                 nullable: true
 *                 example: Aula para avançados
 *               data:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-04-21T14:30:00Z
 *               statusAulaId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               alunos:
 *                 type: array
 *                 nullable: true
 *                 items:
 *                   type: integer
 *                 example: [1, 2]
 *               excluirAlunos:
 *                 type: array
 *                 nullable: true
 *                 items:
 *                   type: integer
 *                 example: [3]
 *     responses:
 *       200:
 *         description: Aula atualizada com sucesso
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
 *                     modalidadeId:
 *                       type: integer
 *                       example: 2
 *                     modalidadeNome:
 *                       type: string
 *                       example: Funcional
 *                     observacao:
 *                       type: string
 *                       nullable: true
 *                       example: Aula para avançados
 *                     data:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-04-21T14:30:00Z
 *                     statusAulaId:
 *                       type: integer
 *                       example: 1
 *                     statusAulaNome:
 *                       type: string
 *                       example: Confirmada
 *                     alunos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           nome:
 *                             type: string
 *                             example: João da Silva
 *                           email:
 *                             type: string
 *                             nullable: true
 *                             example: joao@email.com
 *                           telefone:
 *                             type: string
 *                             nullable: true
 *                             example: "(11) 91234-5678"
 *       400:
 *         description: Requisição inválida
 *       500:
 *         description: Erro interno ao atualizar aula
 */
export async function putAula(req: Request, res: Response) {
  try {
    const aula = await atualizarAula(parseInt(req.params.id, 10), req.body);
    if (!aula)
      return sendError(
        res,
        400,
        "Erro ao atualizar aula",
        "Usuário não atualizado"
      );
    return sendSuccess<getAula>(res, aula, "Atualizado com sucesso");
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao atualizar aula",
      getErrorMessage(error)
    );
  }
}

/**
 * @swagger
 * /aula/cancelar/{id}:
 *   patch:
 *     summary: Cancela uma aula existente
 *     tags:
 *       - Aula
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da aula a ser cancelada
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Aula atualizada com sucesso
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
 *                     modalidadeId:
 *                       type: integer
 *                       example: 2
 *                     modalidadeNome:
 *                       type: string
 *                       example: Funcional
 *                     observacao:
 *                       type: string
 *                       nullable: true
 *                       example: Aula para avançados
 *                     data:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-04-21T14:30:00Z
 *                     statusAulaId:
 *                       type: integer
 *                       example: 1
 *                     statusAulaNome:
 *                       type: string
 *                       example: Confirmada
 *                     alunos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           nome:
 *                             type: string
 *                             example: João da Silva
 *                           email:
 *                             type: string
 *                             nullable: true
 *                             example: joao@email.com
 *                           telefone:
 *                             type: string
 *                             nullable: true
 *                             example: "(11) 91234-5678"
 *       400:
 *         description: Requisição inválida ou aula não encontrada
 *       500:
 *         description: Erro interno ao cancelar aula
 */
export async function patchCancelarAula(req: Request, res: Response) {
  try {
    const aula = await atualizarAulaStatus(
      parseInt(req.params.id, 10),
      StatusAula.CANCELADO
    );
    if (!aula)
      return sendError(
        res,
        400,
        "Erro ao cancelar aula",
        "Usuário não atualizado"
      );
    return sendSuccess<getAula>(res, aula, "Atualizado com sucesso");
  } catch (error) {
    return sendError(res, 500, "Erro ao cancelar aula", getErrorMessage(error));
  }
}

/**
 * @swagger
 * /aula/concluir/{id}:
 *   patch:
 *     summary: Marca uma aula como concluída
 *     tags:
 *       - Aula
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da aula a ser concluída
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Aula atualizada com sucesso
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
 *                     modalidadeId:
 *                       type: integer
 *                       example: 2
 *                     modalidadeNome:
 *                       type: string
 *                       example: Funcional
 *                     observacao:
 *                       type: string
 *                       nullable: true
 *                       example: Aula para avançados
 *                     data:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-04-21T14:30:00Z
 *                     statusAulaId:
 *                       type: integer
 *                       example: 1
 *                     statusAulaNome:
 *                       type: string
 *                       example: Confirmada
 *                     alunos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           nome:
 *                             type: string
 *                             example: João da Silva
 *                           email:
 *                             type: string
 *                             nullable: true
 *                             example: joao@email.com
 *                           telefone:
 *                             type: string
 *                             nullable: true
 *                             example: "(11) 91234-5678"
 *       400:
 *         description: Requisição inválida ou aula não encontrada
 *       500:
 *         description: Erro interno ao concluir aula
 */
export async function patchConcluirAula(req: Request, res: Response) {
  try {
    const aula = await atualizarAulaStatus(
      parseInt(req.params.id, 10),
      StatusAula.CONCLUIDO
    );
    if (!aula)
      return sendError(
        res,
        400,
        "Erro ao cancelar aula",
        "Usuário não atualizado"
      );
    return sendSuccess<getAula>(res, aula, "Atualizado com sucesso");
  } catch (error) {
    return sendError(res, 500, "Erro ao cancelar aula", getErrorMessage(error));
  }
}
