import express from "express";
import config from "./config";
import cors from "cors";
import Ruta_agenda from "./agenda/3-infraestructura/routes/agenda.route";
import Ruta_usuario from "./usuario/3-infraestructura/routes/usuario.route";
import handleErrors from "./middleware/handleErrors";
import cookieParser from "cookie-parser";
import { scopePerRequest } from "awilix-express";
import container from "./container";

const app = express();

// Settings
app.set("port", config.PORT);

const corsOptions = {
    origin: (process.env.CORS_FRONTEND || "").split(","), // Permitir a un dominio en especifico
    credentials: true, // Permitir credenciales
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    preflightContinue: false,
    optionsSuccessStatus: 200, // Para compatibilidad con algunos navegadores
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions)); // permite que los navegadores puedan hacer o no solicitudes dependiendo del domino que vengan

// Middleware para parsear cookies
app.use(cookieParser());

// Middleware para crear un nuevo scope por cada solicitud
app.use(scopePerRequest(container));

// middlewares
app.use(express.json()); // interprete json
app.use(express.urlencoded({ extended: false })); // permite ver el body de las peticiones

// rutas
app.use(Ruta_usuario);
app.use(Ruta_agenda);

// http://localhost:4000/
app.use("/", (_req, res) => {
    res.send("<h1> Pagina de Inicio 22 </h1>");
});

// cunado no encuentre una ruta
app.use((_req, res) => {
    res.status(404).json({
        error: "No existe la ruta",
    });
});

// manejar errores de los try catch
app.use(handleErrors);

export default app;
