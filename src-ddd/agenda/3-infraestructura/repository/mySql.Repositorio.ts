import {
    AgendaNew,
    Agenda,
    AgendaActualizar,
} from "../../1-dominio/IAgenda.entidad";
import { IAgendaRepositorio } from "../../1-dominio/IRepositorio";

import { pool } from "../../../db/mySql.db";

export class MySqlRepositorio implements IAgendaRepositorio {
    async Create(agendaNew: AgendaNew): Promise<Agenda | null> {
        try {
            const query = `
                    INSERT INTO agendas (UsuarioId, Nombre, Apellido, Telefono, Direccion, Email, Nota) VALUES (?, ?, ?, ?, ?, ?, ?);
                `;

            const [data, _table] = await pool.query(query, [
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

            const [data, _table] = await pool.query(query, [usuarioId, id]);

            console.log(data);

            //@ts-ignore
            return data[0];
        } catch (error) {
            console.log(error);
            throw new Error("Error en la base de datos");
        }
    }
    async GetAll(usuarioId: string): Promise<Agenda[] | null> {
        try {
            const query = "SELECT * FROM agendas WHERE UsuarioId = ?";
            const [data, _table] = await pool.query(query, [usuarioId]);
            console.log(data);
            // @ts-ignore
            return data;
        } catch (error) {
            console.log(error);
            throw new Error("Error en la base de datos");
        }
    }
    async Update(agenda: AgendaActualizar): Promise<Agenda | null> {
        try {
            const query = `SELECT * FROM agendas WHERE id = ?`;
            const [data, _table] = await pool.query(query, [agenda.id]);

            console.log(data);
            // @ts-ignore
            if (data.length <= 0) {
                return null;
            }

            const Actualizar: Agenda = {
                //@ts-ignore
                id: data[0].id,
                //@ts-ignore
                UsuarioId: data[0].UsuarioId,
                //@ts-ignore
                Apellido: agenda.Apellido ?? data[0].Apellido,
                //@ts-ignore
                Direccion: agenda.Direccion ?? data[0].Direccion,
                //@ts-ignore
                Email: agenda.Email ?? data[0].Email,
                //@ts-ignore
                Nombre: agenda.Nombre ?? data[0].Nombre,
                //@ts-ignore
                Telefono: agenda.Telefono ?? data[0].Telefono,
                //@ts-ignore
                Nota: agenda.Nota ?? data[0].Nota,
            };

            const query2 = `update agendas set Nombre = ?, Apellido = ?, Direccion = ?, Nota = ?, Telefono = ?, Email = ? where id = ?`;

            const [data2, _table2] = await pool.query(query2, [
                Actualizar.Nombre,
                Actualizar.Apellido,
                Actualizar.Direccion,
                Actualizar.Nota,
                Actualizar.Telefono,
                Actualizar.Email,
                Actualizar.id,
            ]);

            console.log(data2);
            // @ts-ignore
            return data2.affectedRows > 0 ? Actualizar : null;
        } catch (error) {
            console.log(error);
            throw new Error("Error en la base de datos");
        }
    }
    async Delete(id: string): Promise<Agenda | null> {
        try {
            const query1 = "SELECT * FROM agendas WHERE id = ?";

            const [data, _table] = await pool.query(query1, [id]);

            console.log(data);
            // @ts-ignore
            if (data.length <= 0) {
                return null;
            }

            const query2 = "DELETE FROM agendas WHERE id = ?";
            const [data2, _table2] = await pool.query(query2, [id]);

            console.log(data2);
            // @ts-ignore
            return data2.affectedRows > 0 ? data[0] : null;
        } catch (error) {
            console.log(error);
            throw new Error("Error en la base de datos");
        }
    }
}
