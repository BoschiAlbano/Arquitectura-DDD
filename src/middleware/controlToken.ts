import Jwt from "jsonwebtoken";
import config from "../config";

export default async (req: any, res: any, next: any) => {
    // Permitir peticiones OPTIONS para CORS
    if (req.method === "OPTIONS") {
        return next();
    }

    const { token } = req.cookies;

    // Verificar si el token existe
    if (!token) {
        return res
            .status(401)
            .json({ message: "Acceso no autorizado. Token no proporcionado." });
    }

    try {
        // Verificar y decodificar el token
        const decodedToken = Jwt.verify(
            token,
            config.CLAVESECRETAJWT
        ) as Jwt.JwtPayload;

        if (!decodedToken.id) {
            throw new Error(
                "No se ha proporcionado un ID de usuario válido en la cookie."
            );
        }

        req.userId = decodedToken.id;
        return next();
    } catch (error) {
        next(error);
    }
};
