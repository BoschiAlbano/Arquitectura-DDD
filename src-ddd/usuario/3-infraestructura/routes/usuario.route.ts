import { Router } from "express";
// import { UsuarioController } from "../controllers/usuario.controller";
// import { SqlServerRepositorio } from "../repository/sqlServer.Repositorio";
// import { UsuarioCasoUso } from "../../2-aplicacion/usuario.casoUso";
// import { MySqlRepositorio } from "../repository/mySql.Repositorio";
// import { pool } from "../../../db/mySql.db";
import container from "../../../container";
import { scopePerRequest } from "awilix-express";
import Control_Token_Usuario from "../../../middleware/controlToken";
const _router = Router();

// Iniciamos el repo
// const sqlServerUsuarioRepositorio = new SqlServerRepositorio();
// const sqlServerUsuarioRepositorio = new MySqlRepositorio(pool);

// iniciamos caso de uso
// const usuarioCasoUso = new UsuarioCasoUso(sqlServerUsuarioRepositorio);

// Iniciar usuario controller
// const usuarioController = new UsuarioController(usuarioCasoUso);

// Middleware para crear un nuevo scope por cada solicitud
_router.use(scopePerRequest(container));

// Resolver el controlador desde el contenedor
const usuarioController = container.resolve("usuarioController");

// rutas
_router.post("/login", usuarioController.Login);
_router.post("/register", usuarioController.Register);
_router.post("/logout", usuarioController.Logout);

_router.get(
    "/usuarios/agendas",
    Control_Token_Usuario,
    usuarioController.Agendas
);

export default _router;
