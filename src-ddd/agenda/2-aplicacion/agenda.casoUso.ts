import { UnitOfWork } from "../../shared/unitOfwork/UnitOfWork";
import {
    Agenda,
    AgendaActualizar,
    AgendaNew,
} from "../1-dominio/IAgenda.entidad";

export class AgendaCasoUso {
    private readonly UnitOfWork: UnitOfWork;

    constructor({ unitOfWork }: { unitOfWork: UnitOfWork }) {
        this.UnitOfWork = unitOfWork;
    }

    public Create = async ({ agendaNew }: { agendaNew: AgendaNew }) => {
        try {
            await this.UnitOfWork.BeginTransaction();
            const agendaRepositorio =
                this.UnitOfWork.GetRepository<Agenda>("agendaRepositorio");

            const result = await agendaRepositorio.Create(agendaNew);

            await this.UnitOfWork.Commit();

            return result;
        } catch (error) {
            await this.UnitOfWork.Rollback();
            return null;
        }
    };

    public GetById = async ({
        id,
        usuarioId,
    }: {
        id: string;
        usuarioId: string;
    }) => {
        await this.UnitOfWork.BeginTransaction();
        const agendaRepositorio =
            this.UnitOfWork.GetRepository<Agenda>("agendaRepositorio");

        return await agendaRepositorio.GetById(id, usuarioId);
    };

    public GetAll = async (usuarioId: string) => {
        // aqui van los DTO ? 🤔🤔🤔
        await this.UnitOfWork.BeginTransaction();
        const agendaRepositorio =
            this.UnitOfWork.GetRepository<Agenda>("agendaRepositorio");

        // Mapear Agenda ( Dominio ) a AgendaDto ()
        return await agendaRepositorio.GetAll(usuarioId);
    };

    public Update = async ({ agenda }: { agenda: AgendaActualizar }) => {
        try {
            await this.UnitOfWork.BeginTransaction();

            const agendaRepositorio =
                this.UnitOfWork.GetRepository<Agenda>("agendaRepositorio");

            // buscar agenda por id y usuarioId
            const agendaDB = await agendaRepositorio.GetById(
                agenda.id.toString(),
                agenda.UsuarioId.toString()
            );

            if (!agendaDB) {
                return null;
            }

            // actualizar agenda
            const Actualizar: Agenda = {
                id: agendaDB.id,
                UsuarioId: agendaDB.UsuarioId,
                Nombre: agenda.Nombre || agendaDB.Nombre,
                Apellido: agenda.Apellido || agendaDB.Apellido,
                Telefono: agenda.Telefono || agendaDB.Telefono,
                Direccion: agenda.Direccion || agendaDB.Direccion,
                Email: agenda.Email || agendaDB.Email,
                Nota: agenda.Nota || agendaDB.Nota,
            };

            const result = await agendaRepositorio.Update(Actualizar);
            await this.UnitOfWork.Commit();
            return result;
        } catch (error) {
            await this.UnitOfWork.Rollback();
            return null;
        }
    };

    public Delete = async ({
        id,
        UsuarioId,
    }: {
        id: string;
        UsuarioId: string;
    }) => {
        try {
            await this.UnitOfWork.BeginTransaction();

            const agendaRepositorio =
                this.UnitOfWork.GetRepository<Agenda>("agendaRepositorio");

            // buscar agenda por id y usuarioId
            const agendaDB = await agendaRepositorio.GetById(id, UsuarioId);

            if (!agendaDB) {
                return null;
            }

            if (!agendaDB.id) {
                return null;
            }

            const borrar = await agendaRepositorio.Delete(
                agendaDB.id.toString()
            );

            this.UnitOfWork.Commit();

            return borrar ? agendaDB : null;
        } catch (error) {
            await this.UnitOfWork.Rollback();
            return null;
        }
    };
}
