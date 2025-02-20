import { UnitOfWork } from "../../shared/unitOfwork/UnitOfWork";
import { Agenda } from "../1-dominio/Agenda.entidad";
import { AgendaActualizarDto, AgendaDto, AgendaNewDto } from "./Dtos/agendaDto";

export class AgendaCasoUso {
    private readonly UnitOfWork: UnitOfWork;

    constructor({ unitOfWork }: { unitOfWork: UnitOfWork }) {
        this.UnitOfWork = unitOfWork;
    }

    public Create = async ({
        agendaNewDto,
    }: {
        agendaNewDto: AgendaNewDto;
    }): Promise<AgendaDto | null> => {
        // recibe un dto y lo convierte en una entidad para ser guardada en la base de datos y retorna un dto.
        try {
            // Iniciamos la conexion con la base de datos
            await this.UnitOfWork.BeginTransaction();
            // Obtenemos el repositorio de la entidad Agenda
            const agendaRepositorio =
                this.UnitOfWork.GetRepository<Agenda>("agendaRepositorio");
            // Creamos una nueva entidad de tipo Agenda
            const agenda = new Agenda({
                Apellido: agendaNewDto.Apellido,
                Direccion: agendaNewDto.Direccion,
                Email: agendaNewDto.Email,
                Nombre: agendaNewDto.Nombre,
                Telefono: agendaNewDto.Telefono,
                Nota: agendaNewDto.Nota,
                UsuarioId: agendaNewDto.UsuarioId,
            });
            // Guardamos la entidad en la base de datos
            const result = await agendaRepositorio.Create(agenda);

            // Persistimos los cambios en la base de datos
            await this.UnitOfWork.Commit();

            // Si no se guardo la entidad retornamos null
            if (!result) return null;

            // Retornamos un dto con la entidad guardada
            return new AgendaDto({
                id: result.id,
                UsuarioId: result.UsuarioId,
                Apellido: result.Apellido,
                DateTime: new Date().toLocaleDateString(),
                Direccion: result.Direccion,
                Email: result.Email,
                Nombre: result.Nombre,
                Telefono: result.Telefono,
                Nota: result.Nota,
            });
        } catch (error) {
            // Si ocurre un error en la transaccion se hace un rollback
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
        agenda: AgendaActualizarDto;
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
