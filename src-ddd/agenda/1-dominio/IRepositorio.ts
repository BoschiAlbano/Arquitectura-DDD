import { AgendaNew, Agenda } from "./IAgenda.entidad";

export interface IAgendaRepositorio {
    Create(agendaNew: AgendaNew): Promise<Agenda | null>;
    GetById(id: string, usuarioId: string): Promise<Agenda | null>;
    GetAll(usuarioId: string): Promise<Agenda[] | null>;
    Update(agenda: Agenda): Promise<Agenda | null>;
    Delete(id: string): Promise<boolean>;
}
