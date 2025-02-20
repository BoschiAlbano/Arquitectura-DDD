import {
    UsuarioRegisterDto,
    UsuarioLoginDto,
    UsuarioDto,
} from "./Dtos/usuarioDto";
import { CustomError } from "../../utilities/customError";
// servicios de consulta a la base de datos
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../../config";
import { UnitOfWork } from "../../shared/unitOfwork/UnitOfWork";
import { Usuario } from "../1-dominio/Usuario.entidad";

export class UsuarioCasoUso {
    private readonly UnitOfWork: UnitOfWork;

    constructor({ unitOfWork }: { unitOfWork: UnitOfWork }) {
        this.UnitOfWork = unitOfWork;
    }

    public Login = async (UsuarioLoginDto: UsuarioLoginDto) => {
        const { Email, Password } = UsuarioLoginDto;

        await this.UnitOfWork.BeginTransaction();
        const usuarioRepositorio = this.UnitOfWork.GetRepositoryUsuario();
        const usuario = await usuarioRepositorio.GetByEmail(Email);

        if (!usuario) {
            throw new CustomError(
                "Usuario y/o Password son incorrectos o no Existen."
            );
        }

        // Comparar passwords
        const isValidPassword = await bcrypt.compare(
            Password,
            usuario.Password
        );

        if (!isValidPassword) {
            throw new CustomError(
                "Usuario y/o Password son incorrectos o no Existen."
            );
        }

        // Crear payload para el JWT con información mínima necesaria
        const tokenPayload = {
            id: usuario.id,
            usuario: `${usuario.Nombre} ${usuario.Apellido}`,
        };

        // Generar JWT
        // @ts-ignore
        const token = Jwt.sign(tokenPayload, config.CLAVESECRETAJWT as string, {
            expiresIn: config.JWT_TIEMPO_EXPIRA as string,
            algorithm: "HS256",
        });

        // Generar Token Session
        const userSession = {
            id: usuario.id,
            usuario: `${usuario.Nombre} ${usuario.Apellido}`,
            email: usuario.Email,
        };

        return { usuario, token, userSession };
    };

    public Register = async (
        usuarioRegister: UsuarioRegisterDto
    ): Promise<UsuarioDto> => {
        try {
            // Encriptar password
            const hashedPassword = await bcrypt.hash(
                usuarioRegister.Password,
                10
            );

            await this.UnitOfWork.BeginTransaction();
            const usuarioRepositorio = this.UnitOfWork.GetRepositoryUsuario();

            const usuario = new Usuario({
                Apellido: usuarioRegister.Apellido,
                Dni: usuarioRegister.Dni,
                Email: usuarioRegister.Email,
                Nombre: usuarioRegister.Nombre,
                Password: hashedPassword,
            });

            const respuesta = await usuarioRepositorio.Create(usuario);

            await this.UnitOfWork.Commit();

            if (!respuesta) {
                throw new CustomError("Error al registrar el usuario.");
            }

            return new UsuarioDto({
                Nombre: respuesta.Nombre,
                Apellido: respuesta.Apellido,
                Dni: respuesta.Dni,
                Email: respuesta.Email,
                Password: respuesta.Password,
            });
        } catch (error: any) {
            console.log("aqui ---------->");
            await this.UnitOfWork.Rollback();
            throw new CustomError(error);
        }
    };
}
