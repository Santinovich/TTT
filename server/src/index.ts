import express from "express";
import cors from "cors";
import fs from "fs";
import { configDotenv } from "dotenv";
import sociosRouter from "./routes/sociosRouter";
import ubicacionRouter from "./routes/ubicacionRouter";
import authRouter from "./routes/authRouter";
import authProfile from "./middleware/authProfile";
import path from "path";
import { AppDataSource } from "./db/data-source";
import { seedDb } from "./db/seedDb";

async function init() {
    await AppDataSource.initialize();
    await seedDb();
    configDotenv();
    
    if (!process.env.PORT || !process.env.SECRET_KEY) {
        fs.writeFileSync(".env", "PORT=\nSECRET_KEY=");
        throw new Error(
            "No se encontraron las variables de entorno en .env. Se creó un archivo .env predeterminado"
        );
    } else {
        const app = express();
        const port = parseInt(process.env.PORT);

        app.use(cors());
        app.use(express.json());
        app.use("/api/v1/socios", authProfile, sociosRouter);
        app.use("/api/v1/ubicacion", authProfile, ubicacionRouter);
        app.use("/api/v1/auth", authRouter);

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
}

init();
