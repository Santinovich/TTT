import { configDotenv } from "dotenv";
import fs from "fs";

export default function () {
    configDotenv();
    const requiredEnvVars = ["PORT", "SECRET_KEY"];
    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
    if (missingEnvVars.length > 0) {
        fs.writeFileSync(".env", "PORT=\nSECRET_KEY=");

        throw new Error(
            `Faltan las siguientes variables de entorno: ${missingEnvVars.join(
                ", "
            )}. Definirlas en el archivo .env`
        );
    }
}
