import { dbAluno, getAluno, postAluno } from "../models/alunoModels";
import prisma from "../prismaClient";

const mapAluno = (aluno: dbAluno): getAluno => ({
  id: aluno.ALUN_ID,
  nome: aluno.ALUN_Nome,
  altura: aluno.ALUN_Altura,
  peso: aluno.ALUN_Peso,
  email: aluno.ALUN_Email,
  telefone: aluno.ALUN_Telefone,
  cpf: aluno.ALUN_CPF,
  dataNascimento: aluno.ALUN_DataNascimento,
  objetivo: aluno.ALUN_Objetivo,
  indicacaoMedica: aluno.ALUN_IndicacaoMedica,
  lesao: aluno.ALUN_Lesao,
  nomeImagem: aluno.ALUN_NomeImagem,
  base64Imagem: aluno.ALUN_Base64Imagem,
  ativo: aluno.ALUN_Ativo,
});

export const consultarAluno = async (id: number): Promise<getAluno | null> => {
  const aluno: dbAluno | null = await prisma.aluno.findFirst({
    where: { ALUN_ID: id },
  });

  if (!aluno) return null;

  const insertedAluno: getAluno = mapAluno(aluno);
  return insertedAluno;
};

export const listaAluno = async (nome: string | null): Promise<getAluno[]> => {
  const alunos: dbAluno[] = await prisma.aluno.findMany({
    where: nome ? { ALUN_Nome: { contains: nome } } : {},
  });
  const mappedAlunos: getAluno[] = alunos.map((aluno) => mapAluno(aluno));

  return mappedAlunos;
};

export const inserirAluno = async (data: postAluno): Promise<getAluno> => {
  const aluno: dbAluno = await prisma.aluno.create({
    data: {
      ALUN_Nome: data.nome,
      ALUN_Altura: data.altura,
      ALUN_Peso: data.peso,
      ALUN_Email: data.email,
      ALUN_Telefone: data.telefone,
      ALUN_CPF: data.cpf,
      ALUN_DataNascimento: data.dataNascimento
        ? new Date(data.dataNascimento)
        : null,
      ALUN_Objetivo: data.objetivo,
      ALUN_IndicacaoMedica: data.indicacaoMedica,
      ALUN_Lesao: data.lesao,
      ALUN_NomeImagem: data.nomeImagem,
      ALUN_Base64Imagem: data.base64Imagem,
    },
  });
  const insertedAluno: getAluno = mapAluno(aluno);
  return insertedAluno;
};

export const atualizarAluno = async (
  id: number,
  data: postAluno
): Promise<getAluno> => {
  const aluno: dbAluno = await prisma.aluno.update({
    where: { ALUN_ID: id },
    data: {
      ALUN_Nome: data.nome,
      ALUN_Altura: data.altura,
      ALUN_Peso: data.peso,
      ALUN_Email: data.email,
      ALUN_Telefone: data.telefone,
      ALUN_CPF: data.cpf,
      ALUN_DataNascimento: data.dataNascimento
        ? new Date(data.dataNascimento)
        : null,
      ALUN_Objetivo: data.objetivo,
      ALUN_IndicacaoMedica: data.indicacaoMedica,
      ALUN_Lesao: data.lesao,
      ALUN_NomeImagem: data.nomeImagem,
      ALUN_Base64Imagem: data.base64Imagem,
    },
  });
  const updatedAluno: getAluno = mapAluno(aluno);
  return updatedAluno;
};
