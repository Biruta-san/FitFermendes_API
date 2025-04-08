export interface dbAluno {
    ALUN_ID: number;
    ALUN_Nome: string;
    ALUN_Altura: number;
    ALUN_Peso: number;
    ALUN_Email?: string | null;
    ALUN_Telefone?: string | null;
    ALUN_CPF?: string | null;
    ALUN_DataNascimento?: Date | null;
    ALUN_Objetivo?: string | null;
    ALUN_IndicacaoMedica?: string | null;
    ALUN_Lesao?: string | null;
    ALUN_NomeImagem?: string | null;
    ALUN_Base64Imagem?: string | null;
}

export interface getAluno {
    id: number;
    nome: string;
    altura: number;
    peso: number;
    email?: string | null;
    telefone?: string | null;
    cpf?: string | null;
    dataNascimento?: Date | null;
    objetivo?: string | null;
    indicacaoMedica?: string | null;
    lesao?: string | null;
    nomeImagem?: string | null;
    base64Imagem?: string | null;
}

export interface postAluno {
    nome: string;
    altura: number;
    peso: number;
    email?: string | null;
    telefone?: string | null;
    cpf?: string | null;
    dataNascimento?: Date | null;
    objetivo?: string | null;
    indicacaoMedica?: string | null;
    lesao?: string | null;
    nomeImagem?: string | null;
    base64Imagem?: string | null;
}

export interface putAluno extends postAluno {
    id: number;
}