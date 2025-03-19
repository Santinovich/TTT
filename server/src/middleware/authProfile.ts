import { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  profile?: LoginProfile;
}

export default function authProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const secretKey = process.env.SECRET_KEY as string;

  if (!secretKey) {
    throw new Error("No se encontró el SECRET_KEY en .env");
  }
  if (!authHeader) {
    res.status(401).json({ message: "Token no proporcionado" });
  } else {
    const token = authHeader.split(" ")[1];
    try {
      const profile = jsonwebtoken.verify(token, secretKey) as LoginProfile;
      req.profile = profile;
      next();
    } catch (error) {
      res.status(403).json({ message: "Token inválido" });
    }
  }
}
