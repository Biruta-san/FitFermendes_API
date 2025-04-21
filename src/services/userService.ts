import { randomUUID } from "crypto";
import {
  dbUsuario,
  getUsuario,
  loginUsuario,
  loginUsuarioResponse,
  postUsuario,
} from "../models/userModels";
import prisma from "../prismaClient";
import { twoFactorAuthEmail } from "../utils/constants";
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
  const valido = speakeasy.totp.verify({
    secret: process.env.TOTP_SECRET!,
    encoding: "base32",
    token: codigo,
    window: 1,
  });

  if (!valido || decrypted !== codigo) return null;

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