import { config } from "dotenv";

config();

console.log("Puerto en Entorno: ", process.env.PORT);

export default {
    PORT: process.env.PORT || 3000,
    CLAVESECRETAJWT: process.env.ClaveSecretaJWT || "ClaveSecreta",
    JWT_TIEMPO_EXPIRA: process.env.JWT_TIEMPO_EXPIRA || "1h",
};
