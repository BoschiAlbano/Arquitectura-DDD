export interface IAgendaDto {
    id?: number;
    UsuarioId: number;
    Nombre: string;
    Apellido: string;
    Telefono: string;
    Direccion: string;
    Email: string;
    Nota?: string;
    DateTime: string;
}

export class AgendaDto implements IAgendaDto {
    id?: number | undefined;
    Nombre: string;
    Apellido: string;
    Telefono: string;
    Direccion: string;
    Email: string;
    Nota?: string | undefined;
    DateTime: string;
    UsuarioId: number;

    constructor(agendaDto: IAgendaDto) {
        (this.Apellido = agendaDto.Apellido),
            (this.Nombre = agendaDto.Nombre),
            (this.DateTime = agendaDto.DateTime),
            (this.Telefono = agendaDto.Telefono),
            (this.Direccion = agendaDto.Direccion),
            (this.Email = agendaDto.Email);
        this.Nota = agendaDto.Nota;
        this.id = agendaDto.id;
        this.UsuarioId = agendaDto.UsuarioId;
    }
}
export type AgendaNewDto = Omit<IAgendaDto, "id">;

export interface AgendaActualizarDto {
    id: number;
    UsuarioId: number;
    Nombre?: string;
    Apellido?: string;
    Telefono?: string;
    Direccion?: string;
    Email?: string;
    Nota?: string;
}
