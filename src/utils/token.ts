import jwt from "jsonwebtoken";

const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
const JWT_EXPIRES_IN: string | undefined = process.env.JWT_EXPIRES_IN;

export interface JwtPayload {
    id: number;
    nome: string;
    email: string;
    hotelId?: number | null;
}

export const generateToken = (payload: JwtPayload): string | null => {
    try {
        if (!JWT_SECRET || !JWT_EXPIRES_IN) return null;
        const tokenGenerated = jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        return tokenGenerated;
    } catch (error) {
        return null;
    }
};

export const validateToken = (token: string): JwtPayload | null => {
    try {
        if (!JWT_SECRET) return null;
        const tokenValidated = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return tokenValidated;
    } catch (error) {
        return null;
    }
};
