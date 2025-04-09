import {
  dbUsuario,
  getUsuario,
  loginUsuario,
  loginUsuarioResponse,
  postUsuario,
} from "../models/userModels";
import prisma from "../prismaClient";
import { encriptar } from "../utils/crypto";
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
  const usuario: dbUsuario = await prisma.usuario.create({
    data: {
      USUA_Nome: data.nome,
      USUA_Email: data.email,
      USUA_Senha: data.senha,
    },
  });
  const insertedUsuario: getUsuario = mapUsuario(usuario);
  return insertedUsuario;
};

export const atualizarUsuario = async (
  id: number,
  data: postUsuario
): Promise<getUsuario> => {
  const usuario: dbUsuario = await prisma.usuario.update({
    where: { USUA_ID: id },
    data: {
      USUA_Nome: data.nome,
      USUA_Email: data.email,
      USUA_Senha: data.senha,
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
): Promise<boolean> => {
  const user = await prisma.usuario.findFirst({
    where: {
      USUA_Email: data.email,
      USUA_Senha: data.senha,
    },
  });

  if (!user) return false;

  if (!process.env.TOTP_SECRET) return false;

  const otp = speakeasy.totp({
    secret: process.env.TOTP_SECRET, // Segredo compartilhado (você pode configurar ou gerar um novo para cada usuário)
    encoding: "base32",
  });
  const encryptedOtp = encriptar(otp);

  const usuario2FA = prisma.UsuarioAutenticacao.upsert({
    where: { USUA_ID: user.USUA_ID },
    update: {
      TWFA_Codigo: encryptedOtp,
      TWFA_DataExpiracao: new Date(Date.now() + 5 * 60 * 1000), // Define a expiração para 5 minutos
    },
    create: {
      USUA_ID: user.USUA_ID,
      TWFA_Codigo: encryptedOtp,
      TWFA_DataExpiracao: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  // TODO IMPLEMENTAR LOGICA PARA ENVIAR UM EMAIL COM O CODIGO

  return !!usuario2FA;
};

export const validar2FA = async (): Promise<loginUsuarioResponse | null> => {
  throw new Error("Not implemented");
};

export const logUser = async (
  data: loginUsuario
): Promise<loginUsuarioResponse | null> => {
  const user = await prisma.usuario.findFirst({
    where: {
      USUA_Email: data.email,
      USUA_Senha: data.senha,
    },
  });
  if (!user) return null;

  const token: JwtPayload = {
    id: user.USUA_ID,
    nome: user.USUA_Nome,
    email: user.USUA_Email,
  };
  const tokenValidated = generateToken(token);

  if (!tokenValidated) return null;

  const userLogged: loginUsuarioResponse = {
    token: tokenValidated,
    usuario: mapUsuario(user),
  };

  return userLogged;
};
