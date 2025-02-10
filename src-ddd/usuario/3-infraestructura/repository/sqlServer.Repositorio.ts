import { IUsuarioRepositorio } from "../../1-dominio/IRepositorio";
import { usuario, usuarioRegister } from "../../1-dominio/IUsuario.entidad";
// import { getConnection, sql } from "../../../db/sqlServer.db";
import { SqlServerConnection, sql } from "../../../db/sqlServer.db";

export class SqlServerRepositorio implements IUsuarioRepositorio {
    private db = SqlServerConnection.getInstance();

    async Create(usuarioRegister: usuarioRegister): Promise<usuario | null> {
        try {
            const query = `
            INSERT INTO usuarios (Nombre, Apellido, Dni, Email, Password)
            VALUES (@Nombre, @Apellido, @Dni, @Email, @Password)`;

            // const pool = await getConnection();
            const pool = await this.db.getConnection();
            const request = pool.request();

            // Agregar los parámetros de forma segura
            request
                .input("Nombre", usuarioRegister.Nombre)
                .input("Apellido", usuarioRegister.Apellido)
                .input("Dni", usuarioRegister.Dni)
                .input("Email", usuarioRegister.Email)
                .input("Password", usuarioRegister.Password);

            const result = await request.query(query);

            return result.recordset[0];
        } catch (error) {
            throw new Error("Error en la base de datos");
        }
    }
    async GetByEmail(email: string): Promise<usuario | null> {
        try {
            // Preparar la consulta parametrizada
            // const pool = await getConnection();
            const pool = await this.db.getConnection();

            const result = await pool
                .request()
                .input("email", sql.VarChar, email)
                .query(
                    "SELECT TOP(1) * FROM usuarios AS Us WHERE Us.Email = @email"
                );

            return result.recordset[0];
        } catch (error) {
            throw new Error("Error en la base de datos");
        }
    }
    GetAll(): Promise<usuario[] | null> {
        throw new Error("Method not implemented.");
    }
    Update(_usuarioRegister: usuarioRegister): Promise<usuario | null> {
        throw new Error("Method not implemented.");
    }
    Delete(_id: string): Promise<usuario | null> {
        throw new Error("Method not implemented.");
    }
}
