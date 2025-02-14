import { AgendaNew } from "./IAgenda.entidad";

export class AgendaNewClass implements AgendaNew {
    UsuarioId?: number;
    Nombre: string;
    Apellido: string;
    Telefono: string;
    Direccion: string;
    Email: string;
    Nota?: string;

    constructor(agendaNew: AgendaNew) {
        this.UsuarioId = agendaNew.UsuarioId;
        this.Apellido = agendaNew.Apellido;
        this.Direccion = agendaNew.Direccion;
        this.Email = agendaNew.Email;
        this.Nota = agendaNew.Nota;
        this.Telefono = agendaNew.Telefono;
        this.Nombre = agendaNew.Nombre;
    }
}
