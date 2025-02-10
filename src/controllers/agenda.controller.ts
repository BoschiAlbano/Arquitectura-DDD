import { getConnection, sql } from "../db/sqlServer.db";
import { z } from "zod";

export const GET = async (req: any, res: any, next: any) => {
    try {
        // Obtener el ID del usuario desde la cookie
        const userId = req.userId; // Asegúrate de que el nombre de la cookie sea correcto
        const pool = await getConnection();

        const query = "SELECT * FROM agendas WHERE UsuarioId = @Id";

        const request = pool.request();
        request.input("Id", sql.BigInt, userId); // Ajusta el tipo de dato según corresponda

        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                error: 1,
                mensaje: "No se encontraron contactos para este usuario.",
            });
        }

        return res.status(200).json({
            error: 0,
            mensaje: "Agendas encontradas con éxito",
            datos: result.recordset,
        });
    } catch (error) {
        return next(error);
    }
};

export const POST = async (req: any, res: any, next: any) => {
    const userId = req.userId;

    try {
        const validatedData = agendaSchema.parse(req.body);

        const pool = await getConnection();

        const query = `
            INSERT INTO agendas (UsuarioId, Nombre, Apellido, Telefono, Direccion, Email, Nota)
            OUTPUT INSERTED.*
            VALUES (@UsuarioId, @Nombre, @Apellido, @Telefono, @Direccion, @Email, @Nota);
        `;

        const request = pool.request();
        request.input("UsuarioId", sql.BigInt, userId);
        request.input("Nombre", sql.VarChar, validatedData.Nombre);
        request.input("Apellido", sql.VarChar, validatedData.Apellido);
        request.input("Telefono", sql.VarChar, validatedData.Telefono);
        request.input("Direccion", sql.VarChar, validatedData.Direccion);
        request.input("Email", sql.VarChar, validatedData.Email);
        request.input("Nota", sql.VarChar, validatedData.Nota);

        const save = await request.query(query);

        return res.status(201).json({
            error: 0,
            mensaje: "Contacto guardado con éxito.",
            datos: save.recordset[0],
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

export const DELETE = async (req: any, res: any, next: any) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();

        const selectQuery = `
            DELETE FROM agendas WHERE id = @id;
        `;

        const selectRequest = pool.request();
        selectRequest.input("id", sql.BigInt, id);

        const selectResult = await selectRequest.query(selectQuery);

        if (selectResult.rowsAffected[0] === 0) {
            return res.status(400).json({
                error: 1,
                mensaje: `Contacto no Eliminado`,
                datos: {},
            });
        }

        return res.status(200).json({
            error: 0,
            mensaje: `Contacto Eliminado`,
            datos: selectResult.recordset[0],
        });
    } catch (error) {
        return next(error);
    }
};

export const UPDATE = async (req: any, res: any, next: any) => {
    try {
        const validatedData = agendaSchemaUpdate.parse(req.body);

        const pool = await getConnection();
        const result = await pool
            .request()
            .input("id", sql.BigInt, BigInt(validatedData.id))
            .input("Nombre", sql.VarChar, validatedData.Nombre)
            .input("Apellido", sql.VarChar, validatedData.Apellido)
            .input("Direccion", sql.VarChar, validatedData.Direccion)
            .input("Nota", sql.VarChar, validatedData.Nota)
            .input("Telefono", sql.VarChar, validatedData.Telefono)
            .input("Email", sql.VarChar, validatedData.Email)
            .query(
                "update agendas set Nombre = @Nombre, Apellido = @Apellido, Direccion = @Direccion, Nota = @Nota, Telefono = @Telefono, Email = @Email OUTPUT INSERTED.* where id = @id "
            );

        if (result.rowsAffected[0] === 0) {
            return res.status(400).json({
                error: 1,
                mensaje: `Contacto no Actualizado`,
                datos: {},
            });
        }

        return res.status(200).json({
            error: 0,
            mensaje: `Contacto actualizado`,
            datos: result.recordset[0],
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

const agendaSchemaUpdate = z.object({
    id: z.string().min(1, "El id es requerido"),
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
