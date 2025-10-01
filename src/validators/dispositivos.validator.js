import { body, param } from "express-validator";

const tiposPermitidos = ["router","switch","ap","servidor","firewall","pc","printer","otro"];
const estadosPermitidos = ["activo","inactivo","mantenimiento"];

export const validarIdParam = [
  param("id").isInt({ gt: 0 }).withMessage("id debe ser entero > 0"),
];

export const validarCrear = [
  body("hostname").isLength({ min: 3 }).withMessage("hostname >= 3 chars"),
  body("ip_address").isIP(4).withMessage("ip_address IPv4 válida"),
  body("tipo").isIn(tiposPermitidos).withMessage(`tipo: ${tiposPermitidos.join(", ")}`),
  body("ubicacion").notEmpty().withMessage("ubicacion obligatoria"),
  body("estado").optional().isIn(estadosPermitidos),
  body("vlan_id").optional({ nullable: true }).isInt({ min: 1 }),
  body("modelo").optional().isLength({ max: 100 }),
  body("fabricante").optional().isLength({ max: 100 }),
  body("serie").optional().isLength({ max: 100 }),
];

export const validarActualizar = [
  body("hostname").optional().isLength({ min: 3 }),
  body("ip_address").optional().isIP(4),
  body("tipo").optional().isIn(tiposPermitidos),
  body("ubicacion").optional().notEmpty(),
  body("estado").optional().isIn(estadosPermitidos),
  body("vlan_id").optional({ nullable: true }).isInt({ min: 1 }),
  body("modelo").optional().isLength({ max: 100 }),
  body("fabricante").optional().isLength({ max: 100 }),
  body("serie").optional().isLength({ max: 100 }),
];
