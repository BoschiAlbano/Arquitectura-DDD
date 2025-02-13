export interface IRepositorioGenerico<T> {
    Create(entidad: T): Promise<T | null>;
    GetById(id: string, usuarioId: string): Promise<T | null>;
    GetAll(usuarioId: string): Promise<T[] | null>;
    Update(entidad: T): Promise<T | null>;
    Delete(id: string): Promise<boolean>;
}
