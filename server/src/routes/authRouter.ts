import express from "express";
import AuthService from "../service/AuthService";
import TTTError from "../utils/ttt-error";
import authProfile, { AuthenticatedRequest } from "../middleware/authProfile";

const authRouter = express.Router();

const authService = new AuthService();

authRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(401).send("Se necesita un usuario y una contraseña");
        return;
    }
    try {
        const dto = await authService.login(username, password);
        res.json(dto);
    } catch (error) {
        console.log(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error desconocido al iniciar sesión" });
      }
});

authRouter.post("/register", async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)
    if (!username || !password) {
        res.status(401).send("Se necesita un usuario y una contraseña");
        return;
    }
    try {
        const dto = await authService.register(username, password);
        res.json(dto);
    } catch (error) {
        console.log(error);
        if (error instanceof TTTError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: "Error desconocido al registrarse" });
    }
});

authRouter.get("/profile", authProfile, (req: AuthenticatedRequest, res) => {
    req.usuario
    if (!req.usuario) {
        res.status(401).json({ error: "No autorizado" });
    }
    res.json(req.usuario);
});

export default authRouter;
