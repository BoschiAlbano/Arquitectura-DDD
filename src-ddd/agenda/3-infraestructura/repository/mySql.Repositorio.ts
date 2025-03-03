// import { PoolConnection } from "mysql2/promise";
// import { Agenda } from "../../1-dominio/Agenda.entidad";
// import { IRepositorioGenerico } from "../../../shared/repositories/IRepositorio.Generico";

// export class MySqlRepositorio implements IRepositorioGenerico<Agenda> {
//     private pool: PoolConnection;

//     constructor(pool: PoolConnection) {
//         this.pool = pool;
//     }

//     async Delete(id: string): Promise<boolean> {
//         try {
//             const query2 = "DELETE FROM agendas WHERE id = ?";
//             const [data2, _table2] = await this.pool.query(query2, [id]);

//             console.log(data2);
//             // @ts-ignore
//             return data2.affectedRows > 0 ? true : false;
//         } catch (error) {
//             console.log(error);
//             throw new Error("Error en la base de datos");
//         }
//     }
//     async Create(agendaNew: Agenda): Promise<Agenda | null> {
//         try {
//             const query = `
//                     INSERT INTO agendas (UsuarioId, Nombre, Apellido, Telefono, Direccion, Email, Nota) VALUES (?, ?, ?, ?, ?, ?, ?);
//                 `;

//             const [data, _table] = await this.pool.query(query, [
//                 // agendaNew.UsuarioId,
//                 agendaNew.Nombre,
//                 agendaNew.Apellido,
//                 agendaNew.Telefono,
//                 agendaNew.Direccion,
//                 agendaNew.Email,
//                 agendaNew.Nota,
//             ]);

//             console.log(data);

//             const agenda = new Agenda();
//             //@ts-ignore
//             agenda.id = data.insertId;
//             // agenda.UsuarioId = agendaNew.UsuarioId;
//             agenda.Nombre = agendaNew.Nombre;
//             agenda.Apellido = agendaNew.Apellido;
//             agenda.Telefono = agendaNew.Telefono;
//             agenda.Direccion = agendaNew.Direccion;
//             agenda.Email = agendaNew.Email;
//             agenda.Nota = agendaNew.Nota;

//             return agenda;
//         } catch (error) {
//             console.log(error);
//             throw new Error("Error en la base de datos");
//         }
//     }
//     async GetById(id: string, usuarioId: string): Promise<Agenda | null> {
//         try {
//             const query =
//                 "SELECT * FROM agendas WHERE UsuarioId = ? and id = ?";

//             const [data, _table] = await this.pool.query(query, [
//                 usuarioId,
//                 id,
//             ]);
//             //@ts-ignore
//             return data[0];
//         } catch (error) {
//             throw new Error("Error en la base de datos");
//         }
//     }
//     async GetAll(usuarioId: string): Promise<Agenda[] | null> {
//         console.log(usuarioId);
//         try {
//             const query = "SELECT * FROM agendas WHERE UsuarioId = ?";
//             const [data, _table] = await this.pool.query(query, [usuarioId]);
//             console.log(data);
//             // @ts-ignore
//             return data;
//         } catch (error) {
//             console.log(error);
//             throw new Error("Error en la base de datos");
//         }
//     }
//     async Update(agenda: Agenda): Promise<Agenda | null> {
//         try {
//             const query2 = `update agendas set Nombre = ?, Apellido = ?, Direccion = ?, Nota = ?, Telefono = ?, Email = ? where id = ?`;

//             const [data2, _table2] = await this.pool.query(query2, [
//                 agenda.Nombre,
//                 agenda.Apellido,
//                 agenda.Direccion,
//                 agenda.Nota,
//                 agenda.Telefono,
//                 agenda.Email,
//                 agenda.id,
//             ]);

//             console.log(data2);
//             // @ts-ignore
//             return data2.affectedRows > 0 ? agenda : null;
//         } catch (error) {
//             console.log(error);
//             throw new Error("Error en la base de datos");
//         }
//     }
// }
