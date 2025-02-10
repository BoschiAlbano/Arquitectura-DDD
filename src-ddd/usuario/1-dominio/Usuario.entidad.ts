import { usuarioRegister, usuarioLogin } from "./IUsuario.entidad";

export class UsuarioRegister implements usuarioRegister {
    Nombre: string;
    Apellido: string;
    Dni: string;
    Email: string;
    Password: string;

    constructor(usuarioRegister: usuarioRegister) {
        this.Nombre = usuarioRegister.Nombre;
        this.Apellido = usuarioRegister.Apellido;
        this.Dni = usuarioRegister.Dni;
        this.Email = usuarioRegister.Email;
        this.Password = usuarioRegister.Nombre;
    }
}

export class UsuarioLogin implements usuarioLogin {
    Email: string;
    Password: string;

    constructor(usuarioLogin: usuarioLogin) {
        this.Email = usuarioLogin.Email;
        this.Password = usuarioLogin.Password;
    }
}
