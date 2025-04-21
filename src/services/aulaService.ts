import { getListaAluno } from "../models/alunoModels";
import { dbAula, getAula, postAula, putAula } from "../models/aulaModels";
import prisma from "../prismaClient";
import { StatusAula } from "../utils/enums";

const mapAula = (aula: dbAula): getAula => {
  const alunos: getListaAluno[] = [];

  if (aula.AlunoAulas.length > 0) {
    aula.AlunoAulas.forEach((alunoAula) => {
      alunos.push({
        id: alunoAula.Aluno.ALUN_ID,
        nome: alunoAula.Aluno.ALUN_Nome,
        email: alunoAula.Aluno.ALUN_Email,
        telefone: alunoAula.Aluno.ALUN_Telefone,
      });
    });
  }

  return {
    id: aula.AULA_ID,
    modalidadeId: aula.MODL_ID,
    modalidadeNome: aula.Modalidade.MODL_Nome,
    observacao: aula.Observacao,
    data: aula.AULA_Data,
    statusAulaId: aula.STAL_ID,
    statusAulaNome: aula.StatusAula.STAL_Nome,
    alunos: alunos,
  };
};

export const consultarAula = async (id: number): Promise<getAula | null> => {
  const aula: dbAula | null = await prisma.aula.findFirst({
    where: { AULA_ID: id },
    include: {
      StatusAula: true,
      Modalidade: true,
      AlunoAulas: { include: { Aluno: true } },
    },
  });

  if (!aula) return null;

  const insertedAula: getAula = mapAula(aula);
  return insertedAula;
};

export const listaAula = async (
  dataInicio: Date | null,
  dataFim: Date | null
): Promise<getAula[]> => {
  let aulas: dbAula[] = await prisma.aula.findMany({
    include: {
      StatusAula: true,
      Modalidade: true,
      AlunoAulas: { include: { Aluno: true } },
    },
  });

  if (dataInicio) {
    aulas = aulas.filter((aula) => {
      return aula.AULA_Data >= dataInicio;
    });
  }
  if (dataFim) {
    aulas = aulas.filter((aula) => {
      return aula.AULA_Data <= dataFim;
    });
  }

  const mappedAulas: getAula[] = aulas.map((aula) => mapAula(aula));

  return mappedAulas;
};

export const inserirAula = async (data: postAula): Promise<getAula> => {
  const aula: dbAula = await prisma.aula.create({
    data: {
      MODL_ID: data.modalidadeId,
      Observacao: data.observacao,
      AULA_Data: data.data ? new Date(data.data) : new Date(),
      STAL_ID: data.statusAulaId ?? StatusAula.AGENDADO, // StatusAula AGENDADO
      AlunoAulas: {
        create: data.alunos?.map((alunoId) => ({ ALUN_ID: alunoId })),
      },
    },
    include: {
      StatusAula: true,
      Modalidade: true,
      AlunoAulas: { include: { Aluno: true } },
    },
  });
  const insertedAula: getAula = mapAula(aula);
  return insertedAula;
};

export const atualizarAula = async (
  id: number,
  data: putAula
): Promise<getAula> => {
  // #region ATUALIZAÇÃO DE LISTAS DEPENDENTES
  if (data.excluirAlunos && data.excluirAlunos.length > 0) {
    await prisma.alunoAula.deleteMany({
      where: {
        AULA_ID: id,
        ALUN_ID: { in: data.excluirAlunos },
      },
    });
  }

  if (data.alunos && data.alunos.length > 0) {
    data.alunos.forEach(async (alunoId) => {
      const alunoAula = await prisma.alunoAula.findFirst({
        where: {
          AULA_ID: id,
          ALUN_ID: alunoId,
        },
      });
      if (!alunoAula) {
        await prisma.alunoAula.create({
          data: {
            AULA_ID: id,
            ALUN_ID: alunoId,
          },
        });
      }
    });
  }
  // #endregion

  const aula: dbAula = await prisma.aula.update({
    where: { AULA_ID: id },
    data: {
      MODL_ID: data.modalidadeId,
      Observacao: data.observacao,
      AULA_Data: data.data ? new Date(data.data) : new Date(),
      STAL_ID: data.statusAulaId ?? StatusAula.AGENDADO, // StatusAula AGENDADO
    },
    include: {
      StatusAula: true,
      Modalidade: true,
      AlunoAulas: { include: { Aluno: true } },
    },
  });
  const updatedAula: getAula = mapAula(aula);
  return updatedAula;
};

export const atualizarAulaStatus = async (
  id: number,
  statusAulaId: number
): Promise<getAula> => {
  const aula: dbAula = await prisma.aula.update({
    where: { AULA_ID: id },
    data: {
      STAL_ID: statusAulaId,
    },
    include: {
      StatusAula: true,
      Modalidade: true,
      AlunoAulas: { include: { Aluno: true } },
    },
  });
  const updatedAula: getAula = mapAula(aula);
  return updatedAula;
};
