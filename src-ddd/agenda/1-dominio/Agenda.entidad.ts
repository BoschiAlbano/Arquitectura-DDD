import { IAgenda } from "./IAgenda.entidad";

export class Agenda implements IAgenda {
    id?: number | undefined;
    UsuarioId: number;
    Nombre: string;
    Apellido: string;
    Telefono: string;
    Direccion: string;
    Email: string;
    Nota?: string;

    constructor(agenda: IAgenda) {
        this.id = agenda.id;
        this.UsuarioId = agenda.UsuarioId;
        this.Apellido = agenda.Apellido;
        this.Direccion = agenda.Direccion;
        this.Email = agenda.Email;
        this.Nota = agenda.Nota;
        this.Telefono = agenda.Telefono;
        this.Nombre = agenda.Nombre;
    }
}
