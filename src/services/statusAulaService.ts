import {
  dbStatusAula,
  getStatusAula,
  postStatusAula,
} from "../models/statusAulaModels";
import prisma from "../prismaClient";

const mapStatusAula = (statusAula: dbStatusAula): getStatusAula => ({
  id: statusAula.STAL_ID,
  nome: statusAula.STAL_Nome,
});

export const listaStatusAula = async (): Promise<getStatusAula[]> => {
  const statusAulas: dbStatusAula[] = await prisma.statusAula.findMany();
  const mappedStatusAulas: getStatusAula[] = statusAulas.map((statusAula) =>
    mapStatusAula(statusAula)
  );

  return mappedStatusAulas;
};

export const inserirStatusAula = async (
  data: postStatusAula
): Promise<getStatusAula> => {
  const statusAula: dbStatusAula = await prisma.statusAula.create({
    data: {
      STAL_Nome: data.nome,
    },
  });
  const insertedStatusAula: getStatusAula = mapStatusAula(statusAula);
  return insertedStatusAula;
};

export const atualizarStatusAula = async (
  id: number,
  data: postStatusAula
): Promise<getStatusAula> => {
  const statusAula: dbStatusAula = await prisma.statusAula.update({
    where: { STAL_ID: id },
    data: {
      STAL_Nome: data.nome,
    },
  });
  const updatedStatusAula: getStatusAula = mapStatusAula(statusAula);
  return updatedStatusAula;
};
