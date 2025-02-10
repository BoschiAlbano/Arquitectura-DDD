import { SqlServerConnection, sql } from "../../../db/sqlServer.db";
import {
    AgendaNew,
    Agenda,
    AgendaActualizar,
} from "../../1-dominio/IAgenda.entidad";
import { IAgendaRepositorio } from "../../1-dominio/IRepositorio";

export class SqlServerRepositorio implements IAgendaRepositorio {
    private db = SqlServerConnection.getInstance();

    async GetById(id: string, usuarioId: string): Promise<Agenda | null> {
        try {
            // const pool = await getConnection();
            const pool = await this.db.getConnection();

            const query =
                "SELECT * FROM agendas WHERE UsuarioId = @usuarioId and id = @id";
            const request = pool.request();
            request.input("usuarioId", sql.BigInt, usuarioId);
            request.input("id", sql.BigInt, id);

            const result = await request.query(query);

            return result.recordset[0];
        } catch (error) {
            throw new Error("Error en la base de datos");
        }
    }
    async GetAll(usuarioId: string): Promise<Agenda[] | null> {
        try {
            // const pool = await getConnection();
            const pool = await this.db.getConnection();

            const query = "SELECT * FROM agendas WHERE UsuarioId = @usuarioId";
            const request = pool.request();
            request.input("usuarioId", sql.BigInt, usuarioId);
            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            throw new Error("Error en la base de datos");
        }
    }

    async Create(agendaNew: AgendaNew): Promise<Agenda | null> {
        try {
            // const pool = await getConnection();
            const pool = await this.db.getConnection();

            const query = `
                    INSERT INTO agendas (UsuarioId, Nombre, Apellido, Telefono, Direccion, Email, Nota)
                    OUTPUT INSERTED.*
                    VALUES (@UsuarioId, @Nombre, @Apellido, @Telefono, @Direccion, @Email, @Nota);
                `;

            const request = pool.request();
            request.input("UsuarioId", sql.BigInt, agendaNew.UsuarioId);
            request.input("Nombre", sql.VarChar, agendaNew.Nombre);
            request.input("Apellido", sql.VarChar, agendaNew.Apellido);
            request.input("Telefono", sql.VarChar, agendaNew.Telefono);
            request.input("Direccion", sql.VarChar, agendaNew.Direccion);
            request.input("Email", sql.VarChar, agendaNew.Email);
            request.input("Nota", sql.VarChar, agendaNew.Nota);

            const save = await request.query(query);
            return save.recordset[0];
        } catch (error) {
            throw new Error("Error en la base de datos");
        }
    }

    async Update(agenda: AgendaActualizar): Promise<Agenda | null> {
        try {
            // const pool = await getConnection();
            const pool = await this.db.getConnection();

            // Buscar Agenda
            const GetById = await pool
                .request()
                .input("id", sql.BigInt, agenda.id)
                .query("SELECT * FROM agendas WHERE id = @id");

            const db = GetById.recordset[0] as Agenda;

            if (!db) {
                return null;
            }
            // Actualizar Campos
            const Actualizar: Agenda = {
                id: db.id,
                UsuarioId: db.UsuarioId,
                Apellido: agenda.Apellido ?? db.Apellido,
                Direccion: agenda.Direccion ?? db.Direccion,
                Email: agenda.Email ?? db.Email,
                Nombre: agenda.Nombre ?? db.Nombre,
                Telefono: agenda.Telefono ?? db.Telefono,
                Nota: agenda.Nota ?? db.Nota,
            };

            const result = await pool
                .request()
                .input("id", sql.BigInt, BigInt(Actualizar.id))
                .input("Nombre", sql.VarChar, Actualizar.Nombre)
                .input("Apellido", sql.VarChar, Actualizar.Apellido)
                .input("Direccion", sql.VarChar, Actualizar.Direccion)
                .input("Nota", sql.VarChar, Actualizar.Nota)
                .input("Telefono", sql.VarChar, Actualizar.Telefono)
                .input("Email", sql.VarChar, Actualizar.Email)
                .query(
                    "update agendas set Nombre = @Nombre, Apellido = @Apellido, Direccion = @Direccion, Nota = @Nota, Telefono = @Telefono, Email = @Email OUTPUT INSERTED.* where id = @id "
                );
            return result.recordset[0];
        } catch (error) {
            throw new Error("Error en la base de datos");
        }
    }
    async Delete(id: string): Promise<Agenda | null> {
        try {
            // const pool = await getConnection();
            const pool = await this.db.getConnection();

            // Buscar Agenda
            const GetById = await pool
                .request()
                .input("id", sql.BigInt, id)
                .query("SELECT * FROM agendas WHERE id = @id");

            const db = GetById.recordset[0] as Agenda;

            if (!db) {
                return null;
            }

            const result = await pool
                .request()
                .input("id", sql.BigInt, id)
                .query("DELETE FROM agendas WHERE id = @id");

            return result.rowsAffected[0] === 1 ? db : null;
        } catch (error) {
            throw new Error("Error en la base de datos");
        }
    }
}
