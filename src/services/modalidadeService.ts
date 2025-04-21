import {
  dbModalidade,
  getModalidade,
  postModalidade,
} from "../models/modalidadeModels";
import prisma from "../prismaClient";

const mapModalidade = (modalidade: dbModalidade): getModalidade => ({
  id: modalidade.MODL_ID,
  nome: modalidade.MODL_Nome,
});

export const listaModalidade = async (): Promise<getModalidade[]> => {
  const modalidades: dbModalidade[] = await prisma.modalidade.findMany();
  const mappedModalidades: getModalidade[] = modalidades.map((modalidade) =>
    mapModalidade(modalidade)
  );

  return mappedModalidades;
};

export const inserirModalidade = async (
  data: postModalidade
): Promise<getModalidade> => {
  const modalidade: dbModalidade = await prisma.modalidade.create({
    data: {
      MODL_Nome: data.nome,
    },
  });
  const insertedModalidade: getModalidade = mapModalidade(modalidade);
  return insertedModalidade;
};

export const atualizarModalidade = async (
  id: number,
  data: postModalidade
): Promise<getModalidade> => {
  const modalidade: dbModalidade = await prisma.modalidade.update({
    where: { MODL_ID: id },
    data: {
      MODL_Nome: data.nome,
    },
  });
  const updatedModalidade: getModalidade = mapModalidade(modalidade);
  return updatedModalidade;
};
