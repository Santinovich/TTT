import express from "express";
import AuthService from "../service/AuthService";
import TTTError from "../utils/ttt-error";

const authRouter = express.Router();

const authService = new AuthService();

authRouter.post("/login", async (req, res) => {
    console.log(req.body)
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

export default authRouter;
