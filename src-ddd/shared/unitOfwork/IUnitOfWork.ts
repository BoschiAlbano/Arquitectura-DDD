import { IRepositorioGenerico } from "../repositories/IRepositorio.Generico";

export interface IUnitOfWork {
    Commit(): Promise<void>;
    Rollback(): Promise<void>;
    GetRepository<T>(entidad: string): IRepositorioGenerico<T>;
}
