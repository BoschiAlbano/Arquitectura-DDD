import { IUsuarioRepositorio } from "../1-dominio/IRepositorio";
import { UsuarioRegister } from "../1-dominio/Usuario.entidad";
import { CustomError } from "../../utilities/customError";
// servicios de consulta a la base de datos
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../../config";

export class UsuarioCasoUso {
    private readonly IUsuarioRepositorio: IUsuarioRepositorio;

    constructor(iUsuarioRepositorio: IUsuarioRepositorio) {
        this.IUsuarioRepositorio = iUsuarioRepositorio;
    }

    public Login = async ({
        Email,
        Password,
    }: {
        Email: string;
        Password: string;
    }) => {
        // buscar usuario
        const usuario = await this.IUsuarioRepositorio.GetByEmail(Email);

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

    public Register = async (usuarioRegister: UsuarioRegister) => {
        // Encriptar password
        const hashedPassword = await bcrypt.hash(usuarioRegister.Password, 10);

        const respuesta = await this.IUsuarioRepositorio.Create({
            ...usuarioRegister,
            Password: hashedPassword,
        });
        return { respuesta };
    };
}
