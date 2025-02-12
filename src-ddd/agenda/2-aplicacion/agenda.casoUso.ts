import { AgendaActualizar, AgendaNew } from "../1-dominio/IAgenda.entidad";
import { IAgendaRepositorio } from "../1-dominio/IRepositorio";

export class AgendaCasoUso {
    private readonly IAgendaRepositorio: IAgendaRepositorio;

    constructor({
        agendaRepositorio,
    }: {
        agendaRepositorio: IAgendaRepositorio;
    }) {
        this.IAgendaRepositorio = agendaRepositorio;
    }

    public Create = async ({ agendaNew }: { agendaNew: AgendaNew }) => {
        const result = await this.IAgendaRepositorio.Create(agendaNew);
        return result;
    };

    public GetById = async ({
        id,
        usuarioId,
    }: {
        id: string;
        usuarioId: string;
    }) => {
        const result = await this.IAgendaRepositorio.GetById(id, usuarioId);
        return result;
    };

    public GetAll = async (usuarioId: string) => {
        // aqui van los DTO ? 🤔🤔🤔
        return await this.IAgendaRepositorio.GetAll(usuarioId);
    };

    public Update = async ({ agenda }: { agenda: AgendaActualizar }) => {
        return await this.IAgendaRepositorio.Update(agenda);
    };

    public Delete = async ({ id }: { id: string }) => {
        return await this.IAgendaRepositorio.Delete(id);
    };
}
