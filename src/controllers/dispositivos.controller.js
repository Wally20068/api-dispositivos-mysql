import { validationResult } from "express-validator";
import { pool } from "../db.js";

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
}

export async function listar(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT id, hostname, ip_address, tipo, ubicacion, modelo, fabricante, serie, estado, vlan_id, created_at, updated_at FROM dispositivos ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error listando dispositivos" });
  }
}

export async function obtenerPorId(req, res) {
  if (handleValidation(req, res)) return;
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM dispositivos WHERE id = ?",
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "No encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo dispositivo" });
  }
}

export async function crear(req, res) {
  if (handleValidation(req, res)) return;
  try {
    const {
      hostname, ip_address, tipo, ubicacion,
      modelo = null, fabricante = null, serie = null,
      estado = "activo", vlan_id = null
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO dispositivos
       (hostname, ip_address, tipo, ubicacion, modelo, fabricante, serie, estado, vlan_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [hostname, ip_address, tipo, ubicacion, modelo, fabricante, serie, estado, vlan_id]
    );

    const [rows] = await pool.query("SELECT * FROM dispositivos WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);

  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "hostname o ip_address ya existen" });
    }
    res.status(500).json({ message: "Error creando dispositivo" });
  }
}

export async function actualizar(req, res) {
  if (handleValidation(req, res)) return;
  try {
    const { id } = req.params;

    const [exist] = await pool.query("SELECT id FROM dispositivos WHERE id = ?", [id]);
    if (exist.length === 0) return res.status(404).json({ message: "No encontrado" });

    const permitidos = ["hostname","ip_address","tipo","ubicacion","modelo","fabricante","serie","estado","vlan_id"];
    const entries = Object.entries(req.body).filter(([k]) => permitidos.includes(k));
    if (entries.length === 0) return res.status(400).json({ message: "Nada para actualizar" });

    const setClause = entries.map(([k]) => `${k} = ?`).join(", ");
    const values = entries.map(([, v]) => v);

    await pool.query(`UPDATE dispositivos SET ${setClause} WHERE id = ?`, [...values, id]);
    const [rows] = await pool.query("SELECT * FROM dispositivos WHERE id = ?", [id]);
    res.json(rows[0]);

  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "hostname o ip_address ya existen" });
    }
    res.status(500).json({ message: "Error actualizando dispositivo" });
  }
}

export async function eliminar(req, res) {
  if (handleValidation(req, res)) return;
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM dispositivos WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "No encontrado" });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error eliminando dispositivo" });
  }
}
