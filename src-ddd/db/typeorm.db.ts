import { DataSource } from "typeorm";
import config from "../config";

export const AppDataSource = new DataSource({
    type: config.DB_TYPE,
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: ["src-ddd/**/*.entidad.ts", "src-ddd/**/*.entidad.js"],
    migrations: ["src-ddd/migrations/**/*.ts", "src-ddd/migrations/**/*.js"],
});
