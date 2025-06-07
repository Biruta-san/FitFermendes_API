import {
  dbModalidade,
  getModalidade,
  postModalidade,
} from "../models/modalidadeModels";
import prisma from "../prismaClient";

const mapModalidade = (modalidade: dbModalidade): getModalidade => ({
  id: modalidade.MODL_ID,
  nome: modalidade.MODL_Nome,
  cor: modalidade.MODL_Cor,
});

export const listaModalidade = async (): Promise<getModalidade[]> => {
  const modalidades: dbModalidade[] = await prisma.modalidade.findMany();
  const mappedModalidades: getModalidade[] = modalidades.map((modalidade) =>
    mapModalidade(modalidade)
  );

  return mappedModalidades;
};

export const consultarModalidade = async (
  id: number
): Promise<getModalidade> => {
  const modalidade: dbModalidade | null = await prisma.modalidade.findFirst({
    where: { MODL_ID: id },
  });
  if(!modalidade) throw new Error("Modalidade não encontrada");
  const mappedModalidade: getModalidade = mapModalidade(modalidade);
  return mappedModalidade;
};

export const inserirModalidade = async (
  data: postModalidade
): Promise<getModalidade> => {
  const modalidade: dbModalidade = await prisma.modalidade.create({
    data: {
      MODL_Nome: data.nome,
      MODL_Cor: data.cor,
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
      MODL_Cor: data.cor,
    },
  });
  const updatedModalidade: getModalidade = mapModalidade(modalidade);
  return updatedModalidade;
};
