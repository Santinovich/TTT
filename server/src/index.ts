import parseEnv from "./utils/parse-env";
parseEnv();
import express from "express";
import cors from "cors";
import path, { parse } from "path";
import { AppDataSource } from "./db/data-source";
import { seedDb } from "./db/seedDb";
import sociosRouter from "./routes/sociosRouter";
import ubicacionRouter from "./routes/ubicacionRouter";
import authRouter from "./routes/authRouter";
import etiquetasRouter from "./routes/etiquetasRouter";
import notasRouter from "./routes/notasRouter";
import documentosRouter from "./routes/documentosRouter";
import authProfile from "./middleware/authProfile";


async function init() {
    await AppDataSource.initialize();
    await seedDb();

    const app = express();
    const port = parseInt(process.env.PORT as string);

    app.use(cors());
    app.use(express.json());

    app.use("/api/v1/socios", authProfile, sociosRouter);
    app.use("/api/v1/etiquetas", authProfile, etiquetasRouter);
    app.use("/api/v1/ubicacion", authProfile, ubicacionRouter);
    app.use("/api/v1/notas", authProfile, notasRouter);
    app.use("/api/v1/documentos", authProfile, documentosRouter);
    app.use("/api/v1/auth", authRouter);

    app.use("/api/v1/static/documentos", authProfile, express.static("uploads/documentos"));

    app.use("/assets", express.static(path.join(__dirname, "public/assets")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "index.html"));
    });

    app.listen(port, async () => {
        console.log(`Servidor de TTT corriendo\n\nLocal:   http://localhost:${port}/`);
        try {
            const response = await fetch("https://api.ipify.org?format=json");
            const data = await response.json();
            console.log(`Público: http://${data.ip}:${port}/ (verificar puertos abiertos)`);
        } catch (error) {
            console.error(
                "No se pudo obtener la IP pública, servidor posiblemente sin acceso a internet"
            );
        }
    });
}

init();
