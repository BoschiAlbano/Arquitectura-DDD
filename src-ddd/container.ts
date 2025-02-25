import { createContainer, asClass, asValue } from "awilix";
import { UsuarioCasoUso } from "./usuario/2-aplicacion/usuario.casoUso";
import { UsuarioController } from "./usuario/3-infraestructura/controllers/usuario.controller";
import { AgendaCasoUso } from "./agenda/2-aplicacion/agenda.casoUso";
import { AgendaController } from "./agenda/3-infraestructura/controllers/agenda.controller";
import { UnitOfWork } from "./shared/unitOfwork/UnitOfWork";
import { AppDataSource } from "./db/typeorm.db";
// Crear contenedor
const container = createContainer();

// Registrar dependencias
container.register({
    // Usuario
    // usuarioRepositorio: asClass(TypeormRepositorioUsuario).scoped(),
    usuarioCasoUso: asClass(UsuarioCasoUso).scoped(),
    usuarioController: asClass(UsuarioController).singleton(),
    // Agenda
    // agendaRepositorio: asClass(TypeormRepositorioAgenda).scoped(),
    agendaCasoUso: asClass(AgendaCasoUso).scoped(),
    agendaController: asClass(AgendaController).singleton(),
    // Pool
    // pool: asValue(pool),
    unitOfWork: asClass(UnitOfWork).scoped(),

    // typeorm
    dataSource: asValue(AppDataSource),
});

export default container;

/* 
    Repositorios: Cambiados a "scoped" para manejar transacciones y estados por solicitud.
    Casos de Uso: Cambiados a "scoped" para garantizar que cada solicitud tenga su propia instancia.
    Controladores: Mantenidos como "singleton" porque no necesitan estado y son más eficientes.
    Pool de Conexiones: Mantenido como "singleton" porque es un recurso compartido.
    Unit Of Work: Cambiado a "scoped" para manejar transacciones por solicitud.
    Caso de uso para pruebas: Cambiado a transient para asegurar que cada prueba tenga una instancia limpia.
*/
