import { Router } from "express";
import { Login, Register, Logout } from "../controllers/usuario.controller";

const _router = Router();

_router.post("/login", Login);

_router.post("/register", Register);

_router.post("/logout", Logout);
export default _router;
