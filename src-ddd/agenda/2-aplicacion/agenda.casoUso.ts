import { UnitOfWork } from "../../shared/unitOfwork/UnitOfWork";
import {
    Agenda,
    AgendaActualizar,
    AgendaNew,
} from "../1-dominio/IAgenda.entidad";
import { AgendaDto } from "./Dtos/agendaDto";

export class AgendaCasoUso {
    private readonly UnitOfWork: UnitOfWork;

    constructor({ unitOfWork }: { unitOfWork: UnitOfWork }) {
        this.UnitOfWork = unitOfWork;
    }

    public Create = async ({
        agendaNew,
    }: {
        agendaNew: AgendaNew;
    }): Promise<AgendaDto | null> => {
        try {
            await this.UnitOfWork.BeginTransaction();
            const agendaRepositorio =
                this.UnitOfWork.GetRepository<Agenda>("agendaRepositorio");

            const result = await agendaRepositorio.Create(agendaNew);

            await this.UnitOfWork.Commit();

            if (!result) return null;

            return new AgendaDto({
                Apellido: result.Apellido,
                DateTime: new Date().toLocaleDateString(),
                Direccion: result.Direccion,
                Email: result.Email,
                Nombre: result.Nombre,
                Telefono: result.Telefono,
                id: result.id,
                Nota: result.Nota,
            });
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
    }): Promise<AgendaDto | null> => {
        await this.UnitOfWork.BeginTransaction();
        const agendaRepositorio =
            this.UnitOfWork.GetRepository<Agenda>("agendaRepositorio");

        const result = await agendaRepositorio.GetById(id, usuarioId);
        console.log(result);

        if (!result) return null;

        return new AgendaDto({
            ...result,
            DateTime: new Date().toLocaleTimeString(),
        });
    };

    public GetAll = async (usuarioId: string): Promise<AgendaDto[] | null> => {
        await this.UnitOfWork.BeginTransaction();
        const agendaRepositorio =
            this.UnitOfWork.GetRepository<Agenda>("agendaRepositorio");

        // Mapear Agenda ( Dominio ) a AgendaDto ()
        const result = await agendaRepositorio.GetAll(usuarioId);
        if (!result) return null;

        const mapper = result?.map((item) => {
            return new AgendaDto({
                ...item,
                DateTime: new Date().toLocaleDateString(),
            });
        });

        return mapper;
    };

    public Update = async ({
        agenda,
    }: {
        agenda: AgendaActualizar;
    }): Promise<AgendaDto | null> => {
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

            if (!result) return null;

            return new AgendaDto({
                ...result,
                DateTime: new Date().toLocaleDateString(),
            });
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
    }): Promise<AgendaDto | null> => {
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

            return borrar
                ? new AgendaDto({
                      ...agendaDB,
                      DateTime: new Date().toLocaleDateString(),
                  })
                : null;
        } catch (error) {
            await this.UnitOfWork.Rollback();
            return null;
        }
    };
}
