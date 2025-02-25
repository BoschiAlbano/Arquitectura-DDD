import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Iusuario } from "./IUsuario.entidad";
import { Agenda } from "../../agenda/1-dominio/Agenda.entidad";

@Entity()
export class Usuario implements Iusuario {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    Nombre: string;
    @Column()
    Apellido: string;
    @Column()
    Dni: string;
    @Column()
    Email: string;
    @Column()
    Password: string;
    @OneToMany(() => Agenda, (agenda) => agenda.Usuario)
    Agendas: Agenda[];
}

// Entidad Usuario
// export class Usuario implements Iusuario {
//     id?: number;
//     Nombre: string;
//     Apellido: string;
//     Dni: string;
//     Email: string;
//     Password: string;

//     constructor(usuario: Iusuario) {
//         this.id = usuario.id;
//         this.Nombre = usuario.Nombre;
//         this.Apellido = usuario.Apellido;
//         this.Dni = usuario.Dni;
//         this.Email = usuario.Email;
//         this.Password = usuario.Password;
//     }
// }
