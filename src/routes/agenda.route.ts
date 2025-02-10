import { Router } from "express";
import { GET, POST, DELETE, UPDATE } from "../controllers/agenda.controller";
import Control_Token_Usuario from "../middleware/controlToken";

const _router = Router();

_router.get("/agenda", Control_Token_Usuario, GET);

_router.post("/agenda", Control_Token_Usuario, POST);

_router.delete("/agenda/:id", Control_Token_Usuario, DELETE);

_router.put("/agenda", Control_Token_Usuario, UPDATE);

export default _router;
