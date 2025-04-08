import { dbAluno, getAluno } from "./alunoModels";
import { dbModalidade } from "./modalidadeModels";

export interface dbAula { 
    AULA_ID: number;
    MODL_ID: number;
    AULA_Observacao?: string | null;
    Modalidade: dbModalidade;
    Alunos: dbAluno[];
}

export interface getAula {
    id: number;
    modalidadeId: number;
    modalidadeNome: string;
    observacao?: string | null;
    alunos: getAluno[];
}

export interface postAula {
    modalidadeId: number;
    modalidadeNome: string;
    observacao?: string | null;
    alunos?: number[] | null;
}

export interface putAula extends postAula {
    id: number;
}
