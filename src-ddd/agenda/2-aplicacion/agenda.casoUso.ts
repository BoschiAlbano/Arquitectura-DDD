import { UnitOfWork } from "../../shared/unitOfwork/UnitOfWork";
import { Usuario } from "../../usuario/1-dominio/Usuario.entidad";
import { CustomError } from "../../utilities/customError";
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
                await this.UnitOfWork.GetRepository<Agenda>(Agenda);

            // Creamos una nueva entidad de tipo Agenda
            const agenda = new Agenda();
            agenda.Apellido = agendaNewDto.Apellido;
            agenda.Direccion = agendaNewDto.Direccion;
            agenda.Email = agendaNewDto.Email;
            agenda.Nombre = agendaNewDto.Nombre;
            agenda.Telefono = agendaNewDto.Telefono;
            agenda.Nota = agendaNewDto.Nota;
            agenda.Usuario = new Usuario();
            agenda.Usuario.id = agendaNewDto.UsuarioId;

            // Guardamos la entidad en la base de datos
            const result = await agendaRepositorio.Create(agenda);

            // Persistimos los cambios en la base de datos
            await this.UnitOfWork.Commit();

            // Si no se guardo la entidad retornamos null
            if (!result) return null;

            // Retornamos un dto con la entidad guardada
            return new AgendaDto({
                id: result.id,
                Apellido: result.Apellido,
                DateTime: new Date().toLocaleDateString(),
                Direccion: result.Direccion,
                Email: result.Email,
                Nombre: result.Nombre,
                Telefono: result.Telefono,
                Nota: result.Nota,
                UsuarioId: result.Usuario.id,
            });
        } catch (error: any) {
            // Si ocurre un error en la transaccion se hace un rollback
            await this.UnitOfWork.Rollback();
            throw new CustomError(error.message);
        }
    };

    public GetById = async ({
        id,
        usuarioId,
    }: {
        id: string;
        usuarioId: string;
    }): Promise<AgendaDto | null> => {
        try {
            await this.UnitOfWork.BeginTransaction();
            const agendaRepositorio =
                await this.UnitOfWork.GetRepository<Agenda>(Agenda);

            const result = await agendaRepositorio.GetById(id, usuarioId);
            console.log(result);

            if (!result) return null;

            return new AgendaDto({
                ...result,
                UsuarioId: result.Usuario.id,
                DateTime: new Date().toLocaleTimeString(),
            });
        } catch (error) {
            throw new CustomError("Error al obtener la agenda.");
        }
    };

    public GetAll = async (usuarioId: string): Promise<AgendaDto[] | null> => {
        try {
            await this.UnitOfWork.BeginTransaction();
            const agendaRepositorio =
                await this.UnitOfWork.GetRepository<Agenda>(Agenda);

            const result = await agendaRepositorio.GetAll(usuarioId);
            if (!result) return null;

            const mapper = result?.map((item) => {
                return new AgendaDto({
                    ...item,
                    UsuarioId: 1,
                    DateTime: new Date().toLocaleDateString(),
                });
            });

            return mapper;
        } catch (error) {
            throw new CustomError("Error al obtener las agendas.");
        }
    };

    public Update = async ({
        agenda,
    }: {
        agenda: AgendaActualizarDto;
    }): Promise<AgendaDto | null> => {
        try {
            await this.UnitOfWork.BeginTransaction();

            const agendaRepositorio =
                await this.UnitOfWork.GetRepository<Agenda>(Agenda);

            // buscar agenda por id y usuarioId
            const agendaDB = await agendaRepositorio.GetById(
                agenda.id.toString(),
                agenda.UsuarioId.toString()
            );

            if (!agendaDB) {
                return null;
            }

            const Actualizar: Agenda = new Agenda();

            Actualizar.id = agendaDB.id;
            Actualizar.Nombre = agenda.Nombre || agendaDB.Nombre;
            Actualizar.Apellido = agenda.Apellido || agendaDB.Apellido;
            Actualizar.Telefono = agenda.Telefono || agendaDB.Telefono;
            Actualizar.Direccion = agenda.Direccion || agendaDB.Direccion;
            Actualizar.Email = agenda.Email || agendaDB.Email;
            Actualizar.Nota = agenda.Nota || agendaDB.Nota;

            const result = await agendaRepositorio.Update(Actualizar);
            await this.UnitOfWork.Commit();

            if (!result) return null;

            return new AgendaDto({
                ...result,
                UsuarioId: agendaDB.Usuario.id,
                DateTime: new Date().toLocaleDateString(),
            });
        } catch (error: any) {
            await this.UnitOfWork.Rollback();
            throw new CustomError(error.message);
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
                await this.UnitOfWork.GetRepository<Agenda>(Agenda);

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
                      UsuarioId: agendaDB.Usuario.id,
                      DateTime: new Date().toLocaleDateString(),
                  })
                : null;
        } catch (error: any) {
            await this.UnitOfWork.Rollback();
            throw new CustomError(error.message);
        }
    };
}
