import { PoolConnection } from "mysql2/promise";
import { IUsuarioRepositorio } from "../../1-dominio/IRepositorio";
import { Usuario } from "../../1-dominio/Usuario.entidad";
import { CustomError } from "../../../utilities/customError";

export class MySqlRepositorio implements IUsuarioRepositorio {
    private pool: PoolConnection;

    constructor(pool: PoolConnection) {
        this.pool = pool;
    }
    async Create(usuarioRegister: Usuario): Promise<Usuario | null> {
        try {
            const query = `
            INSERT INTO usuarios (Nombre, Apellido, Dni, Email, Password)
            VALUES (?, ?, ?, ?, ?)`;

            const [data, _table] = await this.pool.query(query, [
                usuarioRegister.Nombre,
                usuarioRegister.Apellido,
                usuarioRegister.Dni,
                usuarioRegister.Email,
                usuarioRegister.Password,
            ]);

            console.log(data);

            return {
                //@ts-ignore
                id: data.insertId,
                Nombre: usuarioRegister.Nombre,
                Apellido: usuarioRegister.Apellido,
                Dni: usuarioRegister.Dni,
                Email: usuarioRegister.Email,
                Password: usuarioRegister.Password,
            };
        } catch (error: any) {
            throw new CustomError(error.sqlMessage);
        }
    }
    async GetByEmail(mail: string): Promise<Usuario | null> {
        try {
            const query = `SELECT * FROM usuarios AS Us WHERE Us.Email = ?`;

            const [data, _table] = await this.pool.query(query, [mail]);

            console.log(data);
            //@ts-ignore
            return data[0];
        } catch (error) {
            console.log(error);
            throw new Error("Error en la base de datos");
        }
    }
    async GetAll(): Promise<Usuario[] | null> {
        throw new Error("Method not implemented.");
    }
    async Update(_usuarioRegister: Usuario): Promise<Usuario | null> {
        throw new Error("Method not implemented.");
    }
    async Delete(_id: string): Promise<Usuario | null> {
        throw new Error("Method not implemented.");
    }
    async GetById(_id: string): Promise<Usuario | null> {
        throw new Error("Method not implemented.");
    }
}
