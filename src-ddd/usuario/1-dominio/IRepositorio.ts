import { Usuario } from "./Usuario.entidad";

export interface IUsuarioRepositorio {
    Create(usuarioRegister: Usuario): Promise<Usuario | null>;
    GetByEmail(mail: string): Promise<Usuario | null>;
    GetAll(): Promise<Usuario[] | null>;
}
