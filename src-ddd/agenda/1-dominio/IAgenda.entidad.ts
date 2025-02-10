export interface Agenda {
    id: number;
    UsuarioId: number;
    Nombre: string;
    Apellido: string;
    Telefono: string;
    Direccion: string;
    Email: string;
    Nota?: string;
}

export type AgendaNew = Omit<Agenda, "id">;

export interface AgendaActualizar {
    id: number;
    Nombre?: string;
    Apellido?: string;
    Telefono?: string;
    Direccion?: string;
    Email?: string;
    Nota?: string;
}
