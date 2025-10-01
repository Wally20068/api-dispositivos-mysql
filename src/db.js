import mysql from "mysql2/promise";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

export const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT ?? 3306),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function verifyDbConnection(maxRetries = 5) {
  let attempt = 0;
  let delay = 500;
  while (attempt < maxRetries) {
    try {
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      console.log(`[DB] Conectado a ${DB_HOST}:${DB_PORT}/${DB_NAME}`);
      return;
    } catch (err) {
      attempt++;
      console.warn(`[DB] Intento ${attempt}/${maxRetries} falló: ${err.message}`);
      if (attempt >= maxRetries) throw err;
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
}
