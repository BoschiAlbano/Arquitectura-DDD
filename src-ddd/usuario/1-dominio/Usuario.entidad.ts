import { Iusuario } from "./IUsuario.entidad";

// Entidad Usuario
export class Usuario implements Iusuario {
    id?: number;
    Nombre: string;
    Apellido: string;
    Dni: string;
    Email: string;
    Password: string;

    constructor(usuario: Iusuario) {
        this.id = usuario.id;
        this.Nombre = usuario.Nombre;
        this.Apellido = usuario.Apellido;
        this.Dni = usuario.Dni;
        this.Email = usuario.Email;
        this.Password = usuario.Password;
    }
}
