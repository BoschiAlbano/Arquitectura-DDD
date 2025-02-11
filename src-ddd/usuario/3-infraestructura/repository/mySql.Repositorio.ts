import { Pool } from "mysql2/promise";
import { IUsuarioRepositorio } from "../../1-dominio/IRepositorio";
import { usuarioRegister, usuario } from "../../1-dominio/IUsuario.entidad";

export class MySqlRepositorio implements IUsuarioRepositorio {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async Create(usuarioRegister: usuarioRegister): Promise<usuario | null> {
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
        } catch (error) {
            throw new Error("Error en la base de datos");
        }
    }
    async GetByEmail(mail: string): Promise<usuario | null> {
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
    async GetAll(): Promise<usuario[] | null> {
        throw new Error("Method not implemented.");
    }
    async Update(_usuarioRegister: usuarioRegister): Promise<usuario | null> {
        throw new Error("Method not implemented.");
    }
    async Delete(_id: string): Promise<usuario | null> {
        throw new Error("Method not implemented.");
    }
}
