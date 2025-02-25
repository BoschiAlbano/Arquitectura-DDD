import { IUsuarioRepositorio } from "../../1-dominio/IRepositorio";
import { Usuario } from "../../1-dominio/Usuario.entidad";
import { CustomError } from "../../../utilities/customError";
import { ObjectLiteral, Repository } from "typeorm";

export class TypeormRepositorio implements IUsuarioRepositorio {
    private dbConnection: Repository<Usuario>;

    constructor(repository: Repository<ObjectLiteral>) {
        this.dbConnection = repository as Repository<Usuario>;
    }
    GetAll(): Promise<Usuario[] | null> {
        throw new Error("Method not implemented.");
    }

    async Create(usuarioRegister: Usuario): Promise<Usuario | null> {
        try {
            const data = this.dbConnection.create(usuarioRegister);
            const result = await this.dbConnection.save(data);
            return result;
        } catch (error: any) {
            console.log(error);
            throw new CustomError(error.sqlMessage);
        }
    }
    async GetByEmail(mail: string): Promise<Usuario | null> {
        try {
            const data = await this.dbConnection.findOne({
                where: { Email: mail },
            });

            return data;
        } catch (error) {
            console.log(error);
            throw new Error("Error en la base de datos");
        }
    }
}
