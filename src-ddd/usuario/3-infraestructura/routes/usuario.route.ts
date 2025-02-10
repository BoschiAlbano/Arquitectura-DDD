import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller";
import { SqlServerRepositorio } from "../repository/sqlServer.Repositorio";
import { UsuarioCasoUso } from "../../2-aplicacion/usuario.casoUso";

const _router = Router();

// Iniciamos el repo
const sqlServerUsuarioRepositorio = new SqlServerRepositorio();
// iniciamos caso de uso
const usuarioCasoUso = new UsuarioCasoUso(sqlServerUsuarioRepositorio);

// Iniciar usuario controller
const usuarioController = new UsuarioController(usuarioCasoUso);

// rutas
_router.post("/login", usuarioController.Login);
_router.post("/register", usuarioController.Register);
_router.post("/logout", usuarioController.Logout);

export default _router;
