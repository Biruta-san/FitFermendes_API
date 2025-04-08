export interface dbModalidade {
    MODL_ID: number;
    MODL_Nome: string;
}

export interface getModalidade {
    id: number;
    nome: string;
}

export interface postModalidade {
    nome:
    string;
}
export interface putModalidade extends postModalidade {
    id: number;
}