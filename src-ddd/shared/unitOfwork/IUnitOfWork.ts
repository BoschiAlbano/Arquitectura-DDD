import { ObjectType } from "typeorm";
import { IRepositorioGenerico } from "../repositories/IRepositorio.Generico";
import { IUsuarioRepositorio } from "../../usuario/1-dominio/IRepositorio";

export interface IUnitOfWork {
    Commit(): Promise<void>;
    Rollback(): Promise<void>;
    Release(): Promise<void>;
    BeginTransaction(): Promise<void>;
    GetRepository<T>(entity: ObjectType<T>): Promise<IRepositorioGenerico<T>>;
    GetRepositoryUsuario(): Promise<IUsuarioRepositorio>;
}
