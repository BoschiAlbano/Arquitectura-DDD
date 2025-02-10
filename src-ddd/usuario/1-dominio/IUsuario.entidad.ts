export interface usuario {
    id: number;
    Nombre: string;
    Apellido: string;
    Dni: string;
    Email: string;
    Password: string;
}

export type usuarioRegister = Omit<usuario, "id">;
export type usuarioLogin = Omit<usuario, "Nombre" | "Apellido" | "Dni" | "id">;
