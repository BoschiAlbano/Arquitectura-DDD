import { IRepositorioGenerico } from "../../../shared/repositories/IRepositorio.Generico";
import { Agenda } from "../../1-dominio/Agenda.entidad";
import { ObjectLiteral, Repository } from "typeorm";

export class TypeormRepositorio implements IRepositorioGenerico<Agenda> {
    private dbConnection: Repository<Agenda>;

    constructor(repository: Repository<ObjectLiteral>) {
        // this.dbConnection = dbC.getRepository(Agenda);
        this.dbConnection = repository as Repository<Agenda>;
    }

    async Create(entidad: Agenda): Promise<Agenda | null> {
        try {
            const data = this.dbConnection.create(entidad);
            const result = await this.dbConnection.save(data);
            return result;
        } catch (error) {
            console.log(error);
            throw new Error("Error en la base de datos");
        }
    }
    async GetById(id: string, usuarioId: string): Promise<Agenda | null> {
        try {
            const data = await this.dbConnection.findOne({
                where: { id: Number(id), Usuario: { id: Number(usuarioId) } },
                relations: ["Usuario"],
            });

            return data;
        } catch (error) {
            console.log(error);
            throw new Error("Error en la base de datos");
        }
    }
    async GetAll(usuarioId: string): Promise<Agenda[] | null> {
        try {
            const data = await this.dbConnection.find({
                where: {
                    Usuario: { id: Number(usuarioId) },
                },
                relations: ["Usuario"],
            });

            return data;
        } catch (error) {
            console.log(error);
            throw new Error("Error en la base de datos");
        }
    }
    async Update(entidad: Agenda): Promise<Agenda | null> {
        try {
            const data = await this.dbConnection.update(entidad.id, entidad);
            console.log(data);
            return data.affected ? entidad : null;
        } catch (error) {
            console.log(error);
            throw new Error("Error en la base de datos");
        }
    }
    async Delete(id: string): Promise<boolean> {
        try {
            const data = await this.dbConnection.delete(id);

            console.log(data);
            return data.affected ? true : false;
        } catch (error) {
            console.log(error);
            throw new Error("Error en la base de datos");
        }
    }
}
