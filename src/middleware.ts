import { Request, Response, NextFunction } from "express";
import { JwtPayload, validateToken } from "./utils/token";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401); // Não autorizado

  const tokenValidated: JwtPayload | null = validateToken(token);
  if (!tokenValidated) return res.sendStatus(401); // Não autorizado

  req.headers.usuarioId = `${tokenValidated.id}`;
  req.headers.usuarioNome = `${tokenValidated.nome}`;
  req.headers.hotelId = `${tokenValidated.hotelId}`;
  next();
}
