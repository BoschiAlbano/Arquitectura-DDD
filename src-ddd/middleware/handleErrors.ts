import { Response } from "express";

const ERROR_HANDLERS = {
    ReferenceError: (res: Response) =>
        res
            .status(400)
            .send({ error: "Error en la Consulta SQL, ReferenceError" }),
    CastError: (res: Response) =>
        res.status(400).send({ error: "id used is malformed" }),

    ValidationError: (res: Response, { message }: { message: string }) =>
        res.status(409).send({ error: message }),

    JsonWebTokenError: (res: Response) =>
        res.status(401).json({ error: 1, mensaje: "Token Invalido" }),

    TokenExpirerError: (res: Response) =>
        res.status(401).json({ error: 1, mensaje: "Token Expirado" }),

    RequestError: (res: Response) =>
        res.status(401).json({ error: 1, mensaje: "Error en la Consulta SQL" }),

    TypeError: (res: Response) =>
        res.status(401).json({ error: 1, mensaje: "Error en la Consulta SQL" }),

    ErrorBaseDatos: (res: Response) =>
        res
            .status(401)
            .json({ error: 1, mensaje: "Error en la Base de datos" }),

    TokenExpiredError: (res: Response) =>
        res.status(401).json({ error: 1, mensaje: "Token Expirado" }),

    defaultError: (res: Response, error: Error) => {
        console.error(error.name);
        console.error(error.message);

        // res.status(500).end();
        res.status(500).json({
            msj: error.message,
            error: error.name,
        });
    },
};

type typesError = keyof typeof ERROR_HANDLERS;

export default (error: Error, _req: any, res: Response, _next: any) => {
    const handler =
        ERROR_HANDLERS[error.name as typesError] || ERROR_HANDLERS.defaultError;
    handler(res, error);
};
