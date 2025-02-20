import { z } from "zod";
import { AgendaCasoUso } from "../../2-aplicacion/agenda.casoUso";

const agendaSchemaUpdate = z.object({
    id: z.number().min(1, "El id es requerido"),
    Nombre: z.string().min(1, "El nombre es requerido").optional(),
    Apellido: z.string().min(1, "El apellido es requerido").optional(),
    Telefono: z.string().min(1, "El teléfono es requerido").optional(),
    Direccion: z.string().min(1, "La dirección es requerida").optional(),
    Email: z.string().email("El email debe ser válido").optional(),
    Nota: z.string().optional(),
});

const agendaSchema = z.object({
    Nombre: z.string().min(1, "El nombre es requerido"),
    Apellido: z.string().min(1, "El apellido es requerido"),
    Telefono: z.string().min(1, "El teléfono es requerido"),
    Direccion: z.string().min(1, "La dirección es requerida"),
    Email: z.string().email("El email debe ser válido"),
    Nota: z.string().optional(),
});

export class AgendaController {
    private AgendaCasoUso: AgendaCasoUso;

    constructor({ agendaCasoUso }: { agendaCasoUso: AgendaCasoUso }) {
        this.AgendaCasoUso = agendaCasoUso;
    }

    public GET = async (req: any, res: any, next: any) => {
        try {
            // Obtener el ID del usuario desde la cookie
            const userId = req.userId; // Asegúrate de que el nombre de la cookie sea correcto

            // Caso de uso
            const result = await this.AgendaCasoUso.GetAll(userId);

            if (result?.length === 0) {
                return res.status(404).json({
                    error: 1,
                    mensaje: "No se encontraron contactos para este usuario.",
                });
            }

            return res.status(200).json({
                error: 0,
                mensaje: "Agendas encontradas con éxito",
                datos: result,
            });
        } catch (error) {
            console.log(error);
            return next(error);
        }
    };

    public POST = async (req: any, res: any, next: any) => {
        const UsuarioId = req.userId;

        try {
            const validatedData = agendaSchema.parse(req.body);

            const result = await this.AgendaCasoUso.Create({
                agendaNewDto: {
                    ...validatedData,
                    UsuarioId,
                    DateTime: new Date().toLocaleDateString(),
                },
            });

            return res.status(201).json({
                error: 0,
                mensaje: "Contacto guardado con éxito.",
                datos: result,
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
            return next(error);
        }
    };

    public DELETE = async (req: any, res: any, next: any) => {
        const { id } = req.params;
        const UsuarioId = req.userId;

        try {
            const result = await this.AgendaCasoUso.Delete({ id, UsuarioId });

            if (!result) {
                return res.status(400).json({
                    error: 1,
                    mensaje: `Contacto no Eliminado`,
                    datos: {},
                });
            }

            return res.status(200).json({
                error: 0,
                mensaje: `Contacto Eliminado`,
                datos: result,
            });
        } catch (error) {
            return next(error);
        }
    };

    public UPDATE = async (req: any, res: any, next: any) => {
        console.log(req.body);
        const UsuarioId = req.userId;

        try {
            const validatedData = agendaSchemaUpdate.parse(req.body);

            const result = await this.AgendaCasoUso.Update({
                agenda: { ...validatedData, UsuarioId },
            });

            if (!result) {
                return res.status(400).json({
                    error: 1,
                    mensaje: `Contacto no Actualizado`,
                    datos: {},
                });
            }

            return res.status(200).json({
                error: 0,
                mensaje: `Contacto actualizado`,
                datos: result,
            });
        } catch (error) {
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
            return next(error);
        }
    };

    public GETBYID = async (req: any, res: any, next: any) => {
        const { id } = req.params;
        const usuarioId = req.userId;

        try {
            const result = await this.AgendaCasoUso.GetById({ id, usuarioId });

            if (!result) {
                return res.status(404).json({
                    error: 1,
                    mensaje: `Agenda no Encontrado`,
                    datos: {},
                });
            }

            return res.status(200).json({
                error: 0,
                mensaje: `Agenda Encontrado`,
                datos: result,
            });
        } catch (error) {
            return next(error);
        }
    };
}
