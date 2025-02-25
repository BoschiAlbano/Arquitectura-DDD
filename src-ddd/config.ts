import { config } from "dotenv";

config();

console.log("Puerto en Entorno: ", process.env.PORT);

export default {
    PORT: process.env.PORT || 3000,
    CLAVESECRETAJWT: process.env.ClaveSecretaJWT || "ClaveSecreta",
    JWT_TIEMPO_EXPIRA: process.env.JWT_TIEMPO_EXPIRA || "1h",

    DB_TYPE: "mysql" as "mysql",
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    DB_USERNAME: process.env.DB_USERNAME || "root",
    DB_PASSWORD: process.env.DB_PASSWORD || "",
    DB_DATABASE: process.env.DB_DATABASE || "test",
};
