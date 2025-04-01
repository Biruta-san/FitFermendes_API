// #region USUARIO
export interface dbUsuario {
    USUA_ID: number;
    USUA_Nome: string;
    USUA_Email: string;
    USUA_Senha: string;
}

export interface getUsuario {
    id: number;
    nome: string;
    email: string;
}

export interface postUsuario {
    nome: string;
    email: string;
    senha: string;
}

export interface putUsuario {
    nome: string;
    email: string;
    senha: string;
}

export interface loginUsuario {
    email: string;
    senha: string;
}

export interface loginUsuarioResponse {
    token: string;
    usuario: getUsuario;
}
// #endregion