// import { SqlServerConnection, sql } from "../../../db/sqlServer.db";
// import { Agenda } from "../../1-dominio/Agenda.entidad";
// import { IAgendaRepositorio } from "../../1-dominio/IRepositorio";

// export class SqlServerRepositorio implements IAgendaRepositorio {
//     private db = SqlServerConnection.getInstance();

//     async GetById(id: string, usuarioId: string): Promise<Agenda | null> {
//         try {
//             // const pool = await getConnection();
//             const pool = await this.db.getConnection();

//             const query =
//                 "SELECT * FROM agendas WHERE UsuarioId = @usuarioId and id = @id";
//             const request = pool.request();
//             request.input("usuarioId", sql.BigInt, usuarioId);
//             request.input("id", sql.BigInt, id);

//             const result = await request.query(query);

//             return result.recordset[0];
//         } catch (error) {
//             throw new Error("Error en la base de datos");
//         }
//     }
//     async GetAll(usuarioId: string): Promise<Agenda[] | null> {
//         try {
//             // const pool = await getConnection();
//             const pool = await this.db.getConnection();

//             const query = "SELECT * FROM agendas WHERE UsuarioId = @usuarioId";
//             const request = pool.request();
//             request.input("usuarioId", sql.BigInt, usuarioId);
//             const result = await request.query(query);
//             return result.recordset;
//         } catch (error) {
//             throw new Error("Error en la base de datos");
//         }
//     }
//     async Create(agendaNew: Agenda): Promise<Agenda | null> {
//         try {
//             // const pool = await getConnection();
//             const pool = await this.db.getConnection();

//             const query = `
//                     INSERT INTO agendas (UsuarioId, Nombre, Apellido, Telefono, Direccion, Email, Nota)
//                     OUTPUT INSERTED.*
//                     VALUES (@UsuarioId, @Nombre, @Apellido, @Telefono, @Direccion, @Email, @Nota);
//                 `;

//             const request = pool.request();
//             request.input("UsuarioId", sql.BigInt, agendaNew.UsuarioId);
//             request.input("Nombre", sql.VarChar, agendaNew.Nombre);
//             request.input("Apellido", sql.VarChar, agendaNew.Apellido);
//             request.input("Telefono", sql.VarChar, agendaNew.Telefono);
//             request.input("Direccion", sql.VarChar, agendaNew.Direccion);
//             request.input("Email", sql.VarChar, agendaNew.Email);
//             request.input("Nota", sql.VarChar, agendaNew.Nota);

//             const save = await request.query(query);
//             return save.recordset[0];
//         } catch (error) {
//             throw new Error("Error en la base de datos");
//         }
//     }
//     async Update(agenda: Agenda): Promise<Agenda | null> {
//         try {
//             const pool = await this.db.getConnection();

//             if (!agenda.id) {
//                 return null;
//             }

//             const result = await pool
//                 .request()
//                 .input("id", sql.BigInt, BigInt(agenda.id))
//                 .input("Nombre", sql.VarChar, agenda.Nombre)
//                 .input("Apellido", sql.VarChar, agenda.Apellido)
//                 .input("Direccion", sql.VarChar, agenda.Direccion)
//                 .input("Nota", sql.VarChar, agenda.Nota)
//                 .input("Telefono", sql.VarChar, agenda.Telefono)
//                 .input("Email", sql.VarChar, agenda.Email)
//                 .query(
//                     "update agendas set Nombre = @Nombre, Apellido = @Apellido, Direccion = @Direccion, Nota = @Nota, Telefono = @Telefono, Email = @Email OUTPUT INSERTED.* where id = @id "
//                 );
//             return result.recordset[0];
//         } catch (error) {
//             throw new Error("Error en la base de datos");
//         }
//     }
//     async Delete(id: string): Promise<boolean> {
//         try {
//             const pool = await this.db.getConnection();

//             const result = await pool
//                 .request()
//                 .input("id", sql.BigInt, id)
//                 .query("DELETE FROM agendas WHERE id = @id");

//             return result.rowsAffected[0] === 1 ? true : false;
//         } catch (error) {
//             throw new Error("Error en la base de datos");
//         }
//     }
// }
