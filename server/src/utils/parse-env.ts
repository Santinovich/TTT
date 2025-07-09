import { configDotenv } from "dotenv";
import fs from "fs";

export default function () {
    configDotenv();
    const requiredEnvVars = ["PORT", "SECRET_KEY", "NODE_ENV"];
    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
    if (missingEnvVars.length > 0) {
        var fileStr = "";
        missingEnvVars.forEach((envVar) => {
            fileStr += `${envVar}=${envVar === "NODE_ENV" ? "production" : ""}\n`;
        });
        
        fs.writeFileSync(".env", fileStr, { flag: "a" });

        throw new Error(
            `Faltan las siguientes variables de entorno: ${missingEnvVars.join(
                ", "
            )}. Definirlas en el archivo .env`
        );
    }
}
