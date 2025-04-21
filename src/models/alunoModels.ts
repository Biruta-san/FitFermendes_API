import { Decimal } from "@prisma/client/runtime/library";

export interface dbAluno {
  ALUN_ID: number;
  ALUN_Nome: string;
  ALUN_Altura: number;
  ALUN_Peso: Decimal;
  ALUN_Email: string | null;
  ALUN_Telefone: string | null;
  ALUN_CPF: string | null;
  ALUN_DataNascimento: Date | null;
  ALUN_Objetivo: string | null;
  ALUN_IndicacaoMedica: string | null;
  ALUN_Lesao: string | null;
  ALUN_NomeImagem: string | null;
  ALUN_Base64Imagem: string | null;
  ALUN_Ativo: boolean;
}

export interface getAluno {
  id: number;
  nome: string;
  altura: number;
  peso: Decimal;
  email?: string | null;
  telefone?: string | null;
  cpf?: string | null;
  dataNascimento?: Date | null;
  objetivo?: string | null;
  indicacaoMedica?: string | null;
  lesao?: string | null;
  nomeImagem?: string | null;
  base64Imagem?: string | null;
  ativo: boolean;
}

export interface getListaAluno {
  id: number;
  nome: string;
  email?: string | null;
  telefone?: string | null;
}

export interface postAluno {
  nome: string;
  altura: number;
  peso: Decimal;
  email?: string | null;
  telefone?: string | null;
  cpf?: string | null;
  dataNascimento?: Date | null;
  objetivo?: string | null;
  indicacaoMedica?: string | null;
  lesao?: string | null;
  nomeImagem?: string | null;
  base64Imagem?: string | null;
  ativo?: boolean | null;
}

export interface putAluno extends postAluno {
  id: number;
}
