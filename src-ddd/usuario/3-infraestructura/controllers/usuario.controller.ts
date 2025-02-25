import { NextFunction, Response } from "express";
import { CustomError } from "../../../utilities/customError";
import { UsuarioCasoUso } from "../../2-aplicacion/usuario.casoUso";
// import { NextFunction, Request, Response } from "express";
// servicios de consulta a la base de datos
import { z } from "zod";
// Definir el esquema de validación
const registerSchema = z.object({
    Nombre: z
        .string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "El nombre no puede exceder 50 caracteres")
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            "El nombre solo puede contener letras"
        ),

    Apellido: z
        .string()
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(50, "El apellido no puede exceder 50 caracteres")
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            "El apellido solo puede contener letras"
        ),

    Dni: z
        .string()
        .length(8, "El DNI debe tener 8 dígitos")
        .regex(/^\d+$/, "El DNI solo puede contener números"),

    Email: z
        .string()
        .email("Email inválido")
        .max(100, "El email no puede exceder 100 caracteres"),

    Password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(100, "La contraseña no puede exceder 100 caracteres")
        .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
        .regex(/[0-9]/, "Debe contener al menos un número")
        .regex(/[!@#$%^&*]/, "Debe contener al menos un carácter especial"),
});

const loginSchema = z.object({
    Email: z.string().email("Email inválido"),
    Password: z.string(),
});

export class UsuarioController {
    // constructor(private UsuarioCasoUso: UsuarioCasoUso) {}
    private readonly UsuarioCasoUso: UsuarioCasoUso;

    constructor({ usuarioCasoUso }: { usuarioCasoUso: UsuarioCasoUso }) {
        this.UsuarioCasoUso = usuarioCasoUso;
    }

    public Login = async (req: any, res: any, next: any) => {
        console.log("Login");
        try {
            // Validar los datos de entrada
            const validatedData = loginSchema.parse(req.body);
            const { Email, Password } = validatedData;

            // Caso de uso
            const resultado = await this.UsuarioCasoUso.Login({
                Email,
                Password,
            });

            // Establecer token en cookie
            return res
                .status(200)
                .cookie("token", resultado?.token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                })
                .cookie("session", JSON.stringify(resultado?.userSession), {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                })
                .json({
                    error: 0,
                    mensaje: "Login Exitoso",
                    session: resultado?.userSession,
                });
        } catch (error) {
            console.log(error);
            // Manejar errores de validación de Zod
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 1,
                    mensaje: "Error de validación",
                    detalles: error.errors.map((err) => ({
                        campo: err.path.join("."),
                        mensaje: err.message,
                    })),
                });
            }

            if (error instanceof CustomError) {
                return res.status(400).json({
                    error: 1,
                    mensaje: error.message,
                });
            }
            return next(new Error("Error en el servidor"));
        }
    };

    public Logout = async (_req: any, res: any) => {
        return res
            .status(200)
            .clearCookie("token", {
                httpOnly: true,
                secure: true,
                path: "/",
                sameSite: "none",
            })
            .clearCookie("session", {
                httpOnly: false,
                secure: true,
                path: "/",
                sameSite: "none",
            })
            .json({
                error: 0,
                mensaje: "Cookie eliminada",
            });
    };

    public Register = async (req: any, res: any, next: any) => {
        try {
            // Validar los datos de entrada
            const validatedData = registerSchema.parse(req.body);

            // Caso de uso
            await this.UsuarioCasoUso.Register(validatedData);

            res.status(201).json({
                error: 0,
                mensaje: "Los datos se grabaron con éxito",
            });
        } catch (error) {
            // Manejar errores de validación de Zod
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 1,
                    mensaje: "Error de validación",
                    detalles: error.errors.map((err) => ({
                        campo: err.path.join("."),
                        mensaje: err.message,
                    })),
                });
            }

            // Manejar error de email o dni duplicado
            if ((error as any).number === 2627) {
                return res.status(409).json({
                    error: 1,
                    mensaje: "Ya estas registrado",
                });
            }

            if (error instanceof CustomError) {
                return res.status(400).json({
                    error: 1,
                    mensaje: error.message,
                });
            }

            // Otros errores
            return next(error);
        }
    };

    public Agendas = async (_req: any, res: Response, next: NextFunction) => {
        try {
            const result = await this.UsuarioCasoUso.UsuariosAndAgendas();

            return res.status(200).json({
                error: 0,
                mensaje: result,
            });
        } catch (error) {
            return next(error);
        }
    };
}
