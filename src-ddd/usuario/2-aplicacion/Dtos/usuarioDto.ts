export interface IusuarioDto {
    Nombre: string;
    Apellido: string;
    Dni: string;
    Email: string;
    Password: string;
}

type usuarioRegister = Omit<IusuarioDto, "id">;
type usuarioLogin = Omit<IusuarioDto, "Nombre" | "Apellido" | "Dni" | "id">;

export class UsuarioDto implements IusuarioDto {
    Nombre: string;
    Apellido: string;
    Dni: string;
    Email: string;
    Password: string;

    constructor(usuarioRegister: IusuarioDto) {
        this.Nombre = usuarioRegister.Nombre;
        this.Apellido = usuarioRegister.Apellido;
        this.Dni = usuarioRegister.Dni;
        this.Email = usuarioRegister.Email;
        this.Password = usuarioRegister.Nombre;
    }
}

export class UsuarioRegisterDto implements usuarioRegister {
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

export class UsuarioLoginDto implements usuarioLogin {
    Email: string;
    Password: string;

    constructor(usuarioLogin: usuarioLogin) {
        this.Email = usuarioLogin.Email;
        this.Password = usuarioLogin.Password;
    }
}
