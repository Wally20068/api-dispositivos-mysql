import { Router } from "express";
import { listar, obtenerPorId, crear, actualizar, eliminar } from "../controllers/dispositivos.controller.js";
import { validarIdParam, validarCrear, validarActualizar } from "../validators/dispositivos.validator.js";

const router = Router();

router.get("/dispositivos", listar);
router.get("/dispositivos/:id", validarIdParam, obtenerPorId);
router.post("/dispositivos", validarCrear, crear);
router.put("/dispositivos/:id", validarIdParam, validarActualizar, actualizar);
router.patch("/dispositivos/:id", validarIdParam, validarActualizar, actualizar);
router.delete("/dispositivos/:id", validarIdParam, eliminar);

export default router;
