import "reflect-metadata";
import { DataSource } from "typeorm";

console.log(process.env.NODE_ENV);

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: __dirname + "/db.sqlite",
    synchronize: true,
    logging: process.env.NODE_ENV !== "production",
    entities: [__dirname + "/entity/*.ts"],
    migrations: [],
    subscribers: [],
});