import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IAgenda } from "./IAgenda.entidad";
import { Usuario } from "../../usuario/1-dominio/Usuario.entidad";

@Entity()
export class Agenda implements IAgenda {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    Nombre: string;

    @Column()
    Apellido: string;

    @Column()
    Telefono: string;

    @Column()
    Direccion: string;

    @Column()
    Email: string;

    @Column()
    Nota?: string;

    @ManyToOne(() => Usuario, (usuario) => usuario.Agendas)
    Usuario: Usuario;
}

// export class Agenda implements IAgenda {
//     id?: number | undefined;
//     UsuarioId: number;
//     Nombre: string;
//     Apellido: string;
//     Telefono: string;
//     Direccion: string;
//     Email: string;
//     Nota?: string;

//     constructor(agenda: IAgenda) {
//         this.id = agenda.id;
//         this.UsuarioId = agenda.UsuarioId;
//         this.Apellido = agenda.Apellido;
//         this.Direccion = agenda.Direccion;
//         this.Email = agenda.Email;
//         this.Nota = agenda.Nota;
//         this.Telefono = agenda.Telefono;
//         this.Nombre = agenda.Nombre;
//     }
// }
