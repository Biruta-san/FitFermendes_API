export interface dbModalidade {
  MODL_ID: number;
  MODL_Nome: string;
  MODL_Cor: string;
}

export interface getModalidade {
  id: number;
  nome: string;
  cor: string;
}

export interface postModalidade {
  nome: string;
  cor: string;
}
export interface putModalidade extends postModalidade {
  id: number;
}
