import { Router } from "express";
import { AgendaController } from "../controllers/agenda.controller";
import { AgendaCasoUso } from "../../2-aplicacion/agenda.casoUso";
// import { SqlServerRepositorio } from "../repository/sqlServer.Repositorio";
import Control_Token_Usuario from "../../../middleware/controlToken";
import { MySqlRepositorio } from "../repository/mySql.Repositorio";
import { pool } from "../../../db/mySql.db";

const _router = Router();

// const sqlServerAgendaRepositorio = new SqlServerRepositorio();

const sqlServerAgendaRepositorio = new MySqlRepositorio(pool);

const agendaCasoUso = new AgendaCasoUso(sqlServerAgendaRepositorio);
const agendaController = new AgendaController(agendaCasoUso);

_router.get("/agenda", Control_Token_Usuario, agendaController.GET);

_router.post("/agenda", Control_Token_Usuario, agendaController.POST);

_router.delete("/agenda/:id", Control_Token_Usuario, agendaController.DELETE);

_router.put("/agenda", Control_Token_Usuario, agendaController.UPDATE);

export default _router;
