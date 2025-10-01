import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dispositivosRouter from "./routes/dispositivos.routes.js";
import { verifyDbConnection } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", dispositivosRouter);

app.use((req, res) => res.status(404).json({ message: "Ruta no encontrada" }));

app.use((err, req, res, next) => {
  console.error("[ERROR]", err);
  res.status(500).json({ message: "Error interno" });
});

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await verifyDbConnection();
    app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
  } catch (err) {
    console.error("No se pudo conectar a la BD. Revisa .env y MySQL:", err.message);
    process.exit(1);
  }
})();
