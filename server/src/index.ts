import express from "express";
import cors from "cors";
import fs from "fs";
import { publicIpv4 } from "public-ip";
import { configDotenv } from "dotenv";
import sociosRouter from "./routes/sociosRoutes";
import ubicacionRouter from "./routes/ubicacionRoutes";


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
  app.use("/api/v1/socios", sociosRouter);
  app.use("/api/v1/ubicacion", ubicacionRouter);

  app.listen(port, async () => {
    console.log(`Servidor de TTT corriendo\n\nLocal:   http://localhost:${port}/`);
    try {
      const publicIp = await publicIpv4();
      console.log(`Público: http://${publicIp}:${port}/ (verificar puertos abiertos)`);
    } catch (error) {
      console.error(
        "No se pudo obtener la IP pública, servidor posiblemente sin acceso a internet"
      );
    }
  });
}
