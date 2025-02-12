import { createContainer, asClass, asValue } from "awilix";
import { MySqlRepositorio } from "./usuario/3-infraestructura/repository/mySql.Repositorio";
import { UsuarioCasoUso } from "./usuario/2-aplicacion/usuario.casoUso";
import { UsuarioController } from "./usuario/3-infraestructura/controllers/usuario.controller";
import { pool } from "./db/mySql.db";
import { MySqlRepositorio as MysqlRepositorioAgenda } from "./agenda/3-infraestructura/repository/mySql.Repositorio";
import { AgendaCasoUso } from "./agenda/2-aplicacion/agenda.casoUso";
import { AgendaController } from "./agenda/3-infraestructura/controllers/agenda.controller";
// Crear contenedor
const container = createContainer();

// Registrar dependencias
container.register({
    // Usuario
    usuarioRepositorio: asClass(MySqlRepositorio).singleton(),
    usuarioCasoUso: asClass(UsuarioCasoUso).singleton(),
    usuarioController: asClass(UsuarioController).singleton(),
    // Agenda
    agendaRepositorio: asClass(MysqlRepositorioAgenda).singleton(),
    agendaCasoUso: asClass(AgendaCasoUso).singleton(),
    agendaController: asClass(AgendaController).singleton(),
    // Pool
    pool: asValue(pool),
});

export default container;
