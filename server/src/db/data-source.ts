import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: __dirname + "/db.sqlite",
    synchronize: true,
    logging: true,
    entities: [__dirname + "/entity/*.ts"],
    migrations: [],
    subscribers: [],
});