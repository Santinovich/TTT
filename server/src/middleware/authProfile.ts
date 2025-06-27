import { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";
import { UsuarioProfile } from "../types";
import { UsuarioRol } from "@shared/enum/usuario-rol.enum";

export interface AuthenticatedRequest extends Request {
  usuario?: UsuarioProfile;
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
      const profile = jsonwebtoken.verify(token, secretKey) as UsuarioProfile;
      if (profile.rol !== UsuarioRol.Admin) {
        res.status(403).json({ message: "No autorizado" });
      } else {
        req.usuario = profile;
        next();
      }
    } catch (error) {
      res.status(403).json({ message: "Token inválido" });
    }
  }
}
