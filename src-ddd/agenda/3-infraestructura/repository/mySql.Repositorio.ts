import { PoolConnection } from "mysql2/promise";
import { AgendaNew, Agenda } from "../../1-dominio/IAgenda.entidad";
import { IRepositorioGenerico } from "../../../shared/repositories/IRepositorio.Generico";

export class MySqlRepositorio implements IRepositorioGenerico<Agenda> {
    private pool: PoolConnection;

    constructor({ pool }: { pool: PoolConnection }) {
        this.pool = pool;
    }

    async Delete(id: string): Promise<boolean> {
        try {
            const query2 = "DELETE FROM agendas WHERE id = ?";
            const [data2, _table2] = await this.pool.query(query2, [id]);

            console.log(data2);
            // @ts-ignore
            return data2.affectedRows > 0 ? true : false;
        } catch (error) {
            console.log(error);
            throw new Error("Error en la base de datos");
        }
    }
    async Create(agendaNew: AgendaNew): Promise<Agenda | null> {
        try {
            const query = `
                    INSERT INTO agendas (UsuarioId, Nombre, Apellido, Telefono, Direccion, Email, Nota) VALUES (?, ?, ?, ?, ?, ?, ?);
                `;

            const [data, _table] = await this.pool.query(query, [
                agendaNew.UsuarioId,
                agendaNew.Nombre,
                agendaNew.Apellido,
                agendaNew.Telefono,
                agendaNew.Direccion,
                agendaNew.Email,
                agendaNew.Nota,
            ]);

            console.log(data);

            return {
                //@ts-ignore
                id: data.insertId,
                UsuarioId: agendaNew.UsuarioId,
                Nombre: agendaNew.Nombre,
                Apellido: agendaNew.Apellido,
                Telefono: agendaNew.Telefono,
                Direccion: agendaNew.Direccion,
                Email: agendaNew.Email,
                Nota: agendaNew.Nota,
            };
        } catch (error) {
            console.log(error);
            throw new Error("Error en la base de datos");
        }
    }
    async GetById(id: string, usuarioId: string): Promise<Agenda | null> {
        try {
            const query =
                "SELECT * FROM agendas WHERE UsuarioId = ? and id = ?";

            const [data, _table] = await this.pool.query(query, [
                usuarioId,
                id,
            ]);
            //@ts-ignore
            return data[0];
        } catch (error) {
            throw new Error("Error en la base de datos");
        }
    }
    async GetAll(usuarioId: string): Promise<Agenda[] | null> {
        console.log(usuarioId);
        try {
            const query = "SELECT * FROM agendas WHERE UsuarioId = ?";
            const [data, _table] = await this.pool.query(query, [usuarioId]);
            console.log(data);
            // @ts-ignore
            return data;
        } catch (error) {
            console.log(error);
            throw new Error("Error en la base de datos");
        }
    }
    async Update(agenda: Agenda): Promise<Agenda | null> {
        try {
            const query2 = `update agendas set Nombre = ?, Apellido = ?, Direccion = ?, Nota = ?, Telefono = ?, Email = ? where id = ?`;

            const [data2, _table2] = await this.pool.query(query2, [
                agenda.Nombre,
                agenda.Apellido,
                agenda.Direccion,
                agenda.Nota,
                agenda.Telefono,
                agenda.Email,
                agenda.id,
            ]);

            console.log(data2);
            // @ts-ignore
            return data2.affectedRows > 0 ? agenda : null;
        } catch (error) {
            console.log(error);
            throw new Error("Error en la base de datos");
        }
    }
}
