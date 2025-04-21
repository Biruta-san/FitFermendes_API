import { Request, Response } from "express";
import {
  atualizarAluno,
  consultarAluno,
  inserirAluno,
  listaAluno,
} from "../services/alunoService";
import { getErrorMessage, sendError, sendSuccess } from "../utils/apiFunctions";
import { getAluno } from "../models/alunoModels";

/**
 * @swagger
 * tags:
 *   - name: Aluno
 *     description: Endpoints relacionados a alunos
 */

/**
 * @swagger
 * /aluno/lista:
 *   get:
 *     summary: Retorna uma lista de alunos
 *     tags:
 *       - Aluno
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de alunos consultada com sucesso
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
 *                   example: consultados com sucesso
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
 *                         example: João da Silva
 *                       altura:
 *                         type: number
 *                         format: float
 *                         example: 1.75
 *                       peso:
 *                         type: number
 *                         format: float
 *                         example: 72.5
 *                       email:
 *                         type: string
 *                         nullable: true
 *                         example: joao@email.com
 *                       telefone:
 *                         type: string
 *                         nullable: true
 *                         example: "(11) 99999-9999"
 *                       cpf:
 *                         type: string
 *                         nullable: true
 *                         example: "123.456.789-00"
 *                       dataNascimento:
 *                         type: string
 *                         format: date
 *                         nullable: true
 *                         example: "1990-05-20"
 *                       objetivo:
 *                         type: string
 *                         nullable: true
 *                         example: "Perder peso"
 *                       indicacaoMedica:
 *                         type: string
 *                         nullable: true
 *                         example: "Liberado para atividades físicas"
 *                       lesao:
 *                         type: string
 *                         nullable: true
 *                         example: "Lesão no ombro"
 *                       nomeImagem:
 *                         type: string
 *                         nullable: true
 *                         example: "foto_perfil.jpg"
 *                       base64Imagem:
 *                         type: string
 *                         nullable: true
 *                         example: "/9j/4AAQSkZJRgABAQAAAQABAAD..."
 *       404:
 *         description: Alunos não encontrados
 *       500:
 *         description: Erro ao consultar alunos
 */
export async function getListaAluno(req: Request, res: Response) {
  try {
    const aluno = await listaAluno();
    if (!aluno)
      return sendError(
        res,
        404,
        "Erro ao consultar alunos",
        "Alunos não encontrados"
      );
    return sendSuccess<getAluno[]>(res, aluno, "consultados com sucesso");
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao consultar alunos",
      getErrorMessage(error)
    );
  }
}

/**
 * @swagger
 * /aluno/{id}:
 *   get:
 *     summary: Retorna um Aluno pelo ID
 *     tags:
 *       - Aluno
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do Aluno a ser consultado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Aluno consultado com sucesso
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
 *                   example: consultado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: João da Silva
 *                     altura:
 *                       type: number
 *                       format: float
 *                       example: 1.75
 *                     peso:
 *                       type: number
 *                       format: float
 *                       example: 72.5
 *                     email:
 *                       type: string
 *                       nullable: true
 *                       example: joao@email.com
 *                     telefone:
 *                       type: string
 *                       nullable: true
 *                       example: "(11) 99999-9999"
 *                     cpf:
 *                       type: string
 *                       nullable: true
 *                       example: "123.456.789-00"
 *                     dataNascimento:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                       example: "1990-05-20"
 *                     objetivo:
 *                       type: string
 *                       nullable: true
 *                       example: "Ganho de massa"
 *                     indicacaoMedica:
 *                       type: string
 *                       nullable: true
 *                       example: "Liberado para academia"
 *                     lesao:
 *                       type: string
 *                       nullable: true
 *                       example: "Lesão no joelho"
 *                     nomeImagem:
 *                       type: string
 *                       nullable: true
 *                       example: "aluno123.jpg"
 *                     base64Imagem:
 *                       type: string
 *                       nullable: true
 *                       example: "/9j/4AAQSkZJRgABAQAAAQABAAD..."
 *       404:
 *         description: Aluno não encontrado
 *       500:
 *         description: Erro ao consultar aluno
 */
export async function getAluno(req: Request, res: Response) {
  try {
    const aluno = await consultarAluno(parseInt(req.params.id, 10));
    if (!aluno)
      return sendError(
        res,
        404,
        "Erro ao consultar aluno",
        "Usuário não encontrado"
      );
    return sendSuccess<getAluno>(res, aluno, "consultado com sucesso");
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao consultar aluno",
      getErrorMessage(error)
    );
  }
}

/**
 * @swagger
 * /aluno:
 *   post:
 *     summary: Insere um aluno e retorna o aluno inserido
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
 *               - altura
 *               - peso
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João da Silva
 *               altura:
 *                 type: number
 *                 format: float
 *                 example: 1.75
 *               peso:
 *                 type: number
 *                 format: float
 *                 example: 72.5
 *               email:
 *                 type: string
 *                 nullable: true
 *                 example: joao@email.com
 *               telefone:
 *                 type: string
 *                 nullable: true
 *                 example: "(11) 99999-9999"
 *               cpf:
 *                 type: string
 *                 nullable: true
 *                 example: "123.456.789-00"
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 example: "1990-05-20"
 *               objetivo:
 *                 type: string
 *                 nullable: true
 *                 example: "Hipertrofia"
 *               indicacaoMedica:
 *                 type: string
 *                 nullable: true
 *                 example: "Apto para atividades físicas"
 *               lesao:
 *                 type: string
 *                 nullable: true
 *                 example: "Lesão no joelho"
 *               nomeImagem:
 *                 type: string
 *                 nullable: true
 *                 example: "foto123.jpg"
 *               base64Imagem:
 *                 type: string
 *                 nullable: true
 *                 example: "/9j/4AAQSkZJRgABAQAAAQABAAD..."
 *     responses:
 *       201:
 *         description: Um Aluno
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
 *                   example: Inserido com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: João da Silva
 *                     altura:
 *                       type: number
 *                       example: 1.75
 *                     peso:
 *                       type: number
 *                       example: 72.5
 *                     email:
 *                       type: string
 *                       nullable: true
 *                     telefone:
 *                       type: string
 *                       nullable: true
 *                     cpf:
 *                       type: string
 *                       nullable: true
 *                     dataNascimento:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                     objetivo:
 *                       type: string
 *                       nullable: true
 *                     indicacaoMedica:
 *                       type: string
 *                       nullable: true
 *                     lesao:
 *                       type: string
 *                       nullable: true
 *                     nomeImagem:
 *                       type: string
 *                       nullable: true
 *                     base64Imagem:
 *                       type: string
 *                       nullable: true
 */
export async function postAluno(req: Request, res: Response) {
  try {
    const aluno = await inserirAluno(req.body);
    if (!aluno)
      return sendError(res, 400, "Erro ao inserir aluno", "Aluno não inserido");
    return sendSuccess<getAluno>(res, aluno, "Inserido com sucesso");
  } catch (error) {
    return sendError(res, 500, "Erro ao inserir aluno", getErrorMessage(error));
  }
}

/**
 * @swagger
 * /aluno/{id}:
 *   put:
 *     summary: Atualiza um Aluno existente
 *     tags:
 *       - Aluno
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do Aluno a ser atualizado
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
 *               - altura
 *               - peso
 *             properties:
 *               nome:
 *                 type: string
 *               altura:
 *                 type: number
 *                 format: float
 *               peso:
 *                 type: number
 *                 format: float
 *               email:
 *                 type: string
 *                 nullable: true
 *               telefone:
 *                 type: string
 *                 nullable: true
 *               cpf:
 *                 type: string
 *                 nullable: true
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *               objetivo:
 *                 type: string
 *                 nullable: true
 *               indicacaoMedica:
 *                 type: string
 *                 nullable: true
 *               lesao:
 *                 type: string
 *                 nullable: true
 *               nomeImagem:
 *                 type: string
 *                 nullable: true
 *               base64Imagem:
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
 *                     nome:
 *                       type: string
 *                       example: João da Silva
 *                     altura:
 *                       type: number
 *                       example: 1.75
 *                     peso:
 *                       type: number
 *                       example: 72.5
 *                     email:
 *                       type: string
 *                       nullable: true
 *                     telefone:
 *                       type: string
 *                       nullable: true
 *                     cpf:
 *                       type: string
 *                       nullable: true
 *                     dataNascimento:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                     objetivo:
 *                       type: string
 *                       nullable: true
 *                     indicacaoMedica:
 *                       type: string
 *                       nullable: true
 *                     lesao:
 *                       type: string
 *                       nullable: true
 *                     nomeImagem:
 *                       type: string
 *                       nullable: true
 *                     base64Imagem:
 *                       type: string
 *                       nullable: true
 *       400:
 *         description: Requisição inválida
 *       500:
 *         description: Erro no servidor
 */
export async function putAluno(req: Request, res: Response) {
  try {
    const aluno = await atualizarAluno(parseInt(req.params.id, 10), req.body);
    if (!aluno)
      return sendError(
        res,
        400,
        "Erro ao atualizar aluno",
        "Aluno não atualizado"
      );
    return sendSuccess<getAluno>(res, aluno, "Atualizado com sucesso");
  } catch (error) {
    return sendError(
      res,
      500,
      "Erro ao atualizar aluno",
      getErrorMessage(error)
    );
  }
}
