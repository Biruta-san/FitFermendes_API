import { randomUUID } from "crypto";
import {
  dbUsuario,
  getUsuario,
  loginUsuario,
  loginUsuarioResponse,
  postUsuario,
} from "../models/userModels";
import prisma from "../prismaClient";
import { passwordRecoveryEmail, twoFactorAuthEmail } from "../utils/constants";
import { decriptar, encriptar } from "../utils/crypto";
import { sendEmail } from "../utils/mail";
import { generateToken, JwtPayload } from "../utils/token";
import speakeasy from "speakeasy";

const mapUsuario = (usuario: dbUsuario): getUsuario => ({
  id: usuario.USUA_ID,
  nome: usuario.USUA_Nome,
  email: usuario.USUA_Email,
});

export const listaUsuario = async (): Promise<getUsuario[]> => {
  const usuarios: dbUsuario[] = await prisma.usuario.findMany();
  const mappedUsuarios: getUsuario[] = usuarios.map((usuario) =>
    mapUsuario(usuario)
  );

  return mappedUsuarios;
};

export const consultarUsuario = async (
  id: number
): Promise<getUsuario | null> => {
  const usuario: dbUsuario | null = await prisma.usuario.findFirst({
    where: { USUA_ID: id },
  });

  if (!usuario) return null;

  const insertedUsuario: getUsuario = mapUsuario(usuario);
  return insertedUsuario;
};

export const inserirUsuario = async (
  data: postUsuario
): Promise<getUsuario> => {
  const senhaCriptografada = encriptar(data.senha);
  const usuario: dbUsuario = await prisma.usuario.create({
    data: {
      USUA_Nome: data.nome,
      USUA_Email: data.email,
      USUA_Senha: senhaCriptografada,
    },
  });
  const insertedUsuario: getUsuario = mapUsuario(usuario);
  return insertedUsuario;
};

export const atualizarUsuario = async (
  id: number,
  data: postUsuario
): Promise<getUsuario> => {
  const senhaCriptografada = encriptar(data.senha);
  const usuario: dbUsuario = await prisma.usuario.update({
    where: { USUA_ID: id },
    data: {
      USUA_Nome: data.nome,
      USUA_Email: data.email,
      USUA_Senha: senhaCriptografada,
    },
  });
  const updatedUsuario: getUsuario = {
    id: usuario.USUA_ID,
    nome: usuario.USUA_Nome,
    email: usuario.USUA_Email,
  };
  return updatedUsuario;
};

export const validarCredenciais = async (
  data: loginUsuario
): Promise<string | null> => {
  const user = await prisma.usuario.findFirst({
    where: {
      USUA_Email: data.email,
    },
  });

  if (
    !user ||
    decriptar(user.USUA_Senha) !== data.senha ||
    !process.env.TOTP_SECRET
  )
    return null;

  const otp = speakeasy.totp({
    secret: process.env.TOTP_SECRET,
    encoding: "base32",
  });

  const encryptedOtp = encriptar(otp);
  const verificador = randomUUID();
  const dataExpiracao = new Date(Date.now() + 5 * 60 * 1000);

  const usuarioAutenticacao = await prisma.usuarioAutenticacao.findFirst({
    where: {
      USUA_ID: user.USUA_ID,
    },
  });

  let usuario2FA;
  if (usuarioAutenticacao) {
    usuario2FA = await prisma.usuarioAutenticacao.update({
      where: { TWFA_ID: usuarioAutenticacao.TWFA_ID },
      data: {
        TWFA_Codigo: encryptedOtp,
        TWFA_DataExpiracao: dataExpiracao,
        TWFA_Verificador: verificador,
      },
    });
  } else {
    usuario2FA = await prisma.usuarioAutenticacao.create({
      data: {
        USUA_ID: user.USUA_ID,
        TWFA_Codigo: encryptedOtp,
        TWFA_DataExpiracao: dataExpiracao,
        TWFA_Verificador: verificador,
      },
    });
  }

  sendEmail(
    user.USUA_Email,
    "Código de verificação",
    twoFactorAuthEmail(otp, dataExpiracao),
    true
  );

  if (!usuario2FA) return null;
  return verificador;
};

export const validar2FA = async (
  verificador: string,
  codigo: string
): Promise<loginUsuarioResponse | null> => {
  const record = await prisma.usuarioAutenticacao.findFirst({
    where: {
      TWFA_Verificador: verificador,
      TWFA_DataExpiracao: {
        gte: new Date(),
      },
    },
    include: {
      Usuario: true,
    },
  });

  if (!record || !record.TWFA_Codigo) return null;

  const decrypted = decriptar(record.TWFA_Codigo);

  if (decrypted !== codigo) return null;

  const token: JwtPayload = {
    id: record.Usuario.USUA_ID,
    nome: record.Usuario.USUA_Nome,
    email: record.Usuario.USUA_Email,
  };
  const tokenValidated = generateToken(token);

  if (!tokenValidated) return null;

  const userLogged: loginUsuarioResponse = {
    token: tokenValidated,
    usuario: mapUsuario(record.Usuario),
  };

  return userLogged;
};

// #region RECUPERAR SENHA
export const solicitarRecuperacaoSenha = async (
  email: string
): Promise<string | null> => {
  if (!email) throw new Error("Email é obrigatório");

  const user = await prisma.usuario.findFirst({
    where: {
      USUA_Email: email,
    },
  });

  if (!user) throw new Error("Usuário não encontrado");

  const verificador = randomUUID();
  const dataExpiracao = new Date(Date.now() + 5 * 60 * 1000);

  const usuarioAutenticacao = await prisma.usuarioAutenticacao.findFirst({
    where: {
      USUA_ID: user.USUA_ID,
    },
  });

  let usuario2FA;
  if (usuarioAutenticacao) {
    usuario2FA = await prisma.usuarioAutenticacao.update({
      where: { TWFA_ID: usuarioAutenticacao.TWFA_ID },
      data: {
        TWFA_DataExpiracao: dataExpiracao,
        TWFA_Verificador: verificador,
      },
    });
  } else {
    usuario2FA = await prisma.usuarioAutenticacao.create({
      data: {
        USUA_ID: user.USUA_ID,
        TWFA_DataExpiracao: dataExpiracao,
        TWFA_Verificador: verificador,
      },
    });
  }

  sendEmail(
    user.USUA_Email,
    "Recuperação de senha",
    passwordRecoveryEmail(verificador, dataExpiracao),
    true
  );

  if (!usuario2FA) return null;
  return verificador;
};

export const validarRecuperacaoSenha = async (
  verificador: string,
  senha: string
): Promise<loginUsuarioResponse | null> => {
  const record = await prisma.usuarioAutenticacao.findFirst({
    where: {
      TWFA_Verificador: verificador,
      TWFA_DataExpiracao: {
        gte: new Date(),
      },
    },
    include: {
      Usuario: true,
    },
  });

  if (!record) throw new Error("Verificador inválido ou expirado");

  const senhaEncriptada = encriptar(senha);

  const usuarioAtualizado = await prisma.usuario.update({
    where: { USUA_ID: record.Usuario.USUA_ID },
    data: {
      USUA_Senha: senhaEncriptada,
    },
  });

  const token: JwtPayload = {
    id: usuarioAtualizado.USUA_ID,
    nome: usuarioAtualizado.USUA_Nome,
    email: usuarioAtualizado.USUA_Email,
  };
  const tokenValidated = generateToken(token);

  if (!tokenValidated) return null;

  const userLogged: loginUsuarioResponse = {
    token: tokenValidated,
    usuario: mapUsuario(record.Usuario),
  };

  return userLogged;
};
// #endregion RECUPERAR SENHA
