import express from "express";
import AuthService from "../service/AuthService";
import db from "../db/db";
import authProfile, { AuthenticatedRequest } from "../middleware/authProfile";

const authRouter = express.Router();

const authService = new AuthService(db);

//TODO: ver router.all para middlewares
authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body as { username: string; password: string };
  if (!username || !password) {
    res.status(401).send("Email and password are required");
  } else {
    try {
      const { token } = await authService.login(username, password);
      res.json({ token });
    } catch (error) {
      res.status(401).json({ error });
    }
  }
});

authRouter.get("/profile", authProfile, (req: AuthenticatedRequest, res) => {
  if (req.profile) {
    res.send(req.profile);
  }
});

export default authRouter;
