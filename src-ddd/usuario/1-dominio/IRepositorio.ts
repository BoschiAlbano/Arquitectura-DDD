import { usuario, usuarioRegister } from "./IUsuario.entidad";

export interface IUsuarioRepositorio {
    Create(usuarioRegister: usuarioRegister): Promise<usuario | null>;
    GetByEmail(mail: string): Promise<usuario | null>;
    GetAll(): Promise<usuario[] | null>;
    Update(usuarioRegister: usuarioRegister): Promise<usuario | null>;
    Delete(id: string): Promise<usuario | null>;
}
