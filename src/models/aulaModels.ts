import { dbAluno, getAluno, getListaAluno } from "./alunoModels";
import { dbModalidade } from "./modalidadeModels";
import { dbStatusAula } from "./statusAulaModels";

export interface dbAula {
  AULA_ID: number;
  MODL_ID: number;
  Modalidade: dbModalidade;
  Observacao?: string | null;
  AULA_Data: Date;
  STAL_ID: number;
  StatusAula: dbStatusAula;
  AlunoAulas: dbAlunoAulas[];
}

export interface dbAlunoAulas {
  ALUN_ID: number;
  AULA_ID: number;
  Aluno: dbAluno;
}

export interface getAula {
  id: number;
  modalidadeId: number;
  modalidadeNome: string;
  observacao?: string | null;
  data: Date;
  statusAulaId: number;
  statusAulaNome: string;
  alunos: getListaAluno[];
}

export interface postAula {
  modalidadeId: number;
  observacao?: string | null;
  data: Date;
  statusAulaId?: number | null;
  alunos?: number[] | null;
}

export interface putAula extends postAula {
  excluirAlunos?: number[] | null;
}
