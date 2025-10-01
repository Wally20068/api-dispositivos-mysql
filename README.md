API Dispositivos (MySQL) – Trabajo Final Redes UCACUE

API REST en Node.js + Express con persistencia real en MySQL para gestionar un inventario de dispositivos de red (routers, switches, APs, etc.).

🧰 Tech stack

Node.js + Express

MySQL 8 (administrado con MySQL Workbench)

mysql2, express-validator, dotenv, cors, morgan

Postman (colección incluida)

📂 Estructura del proyecto
api-dispositivos-mysql/
├─ sql/
│  └─ 01-init.sql
├─ src/
│  ├─ index.js
│  ├─ db.js
│  ├─ routes/
│  │  └─ dispositivos.routes.js
│  └─ controllers/
│     └─ dispositivos.controller.js
├─ postman_collection.json
├─ capturas/                 (agrega aquí tus screenshots)
├─ .env                      (NO subir)
├─ .env.example
├─ .gitignore
└─ README.md

✅ Requisitos

Node.js LTS (18/20)

MySQL 8.x + MySQL Workbench

Postman

Git

1) Configuración de la Base de Datos
1.1 Ejecutar script en Workbench

Abre MySQL Workbench y conéctate al servidor local.

Abre y ejecuta sql/01-init.sql (crea DB, usuario y tabla).
El contenido del script es:

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS tarea_api
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

-- Usuario de aplicación (ajusta la clave si deseas)
CREATE USER IF NOT EXISTS 'api_user'@'localhost' IDENTIFIED BY 'Clave_Segura123!';
GRANT ALL PRIVILEGES ON tarea_api.* TO 'api_user'@'localhost';
FLUSH PRIVILEGES;

USE tarea_api;

-- Tabla principal
CREATE TABLE IF NOT EXISTS dispositivos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  hostname VARCHAR(100) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  tipo ENUM('router','switch','ap','servidor','firewall','pc','printer','otro') NOT NULL,
  ubicacion VARCHAR(150) NOT NULL,
  modelo VARCHAR(100) NULL,
  fabricante VARCHAR(100) NULL,
  serie VARCHAR(100) NULL,
  estado ENUM('activo','inactivo','mantenimiento') NOT NULL DEFAULT 'activo',
  vlan_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_dispositivos PRIMARY KEY (id),
  CONSTRAINT uk_dispositivos_hostname UNIQUE (hostname),
  CONSTRAINT uk_dispositivos_ip UNIQUE (ip_address)
) ENGINE=InnoDB;

-- Índices útiles
CREATE INDEX idx_dispositivos_tipo ON dispositivos(tipo);
CREATE INDEX idx_dispositivos_ubicacion ON dispositivos(ubicacion);
CREATE INDEX idx_dispositivos_created_at ON dispositivos(created_at);

1.2 Verificación rápida
USE tarea_api;
SHOW TABLES;
SHOW INDEX FROM dispositivos;
SELECT COUNT(*) AS total FROM dispositivos;

2) Variables de entorno

Crear archivo .env en la raíz del proyecto (NO subir al repo):

PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=api_user
DB_PASSWORD=Clave_Segura123!
DB_NAME=tarea_api


Si usas otro usuario (ej. root), ajusta DB_USER y DB_PASSWORD.
.env ya está ignorado en .gitignore. Comparte solo .env.example.

3) Instalación y ejecución
# 1) Instalar dependencias
npm install

# 2) Ejecutar en desarrollo (con nodemon)
npm run dev
# o en producción
npm start


Salida esperada:

[DB] Conectado a 127.0.0.1:3306/tarea_api
API escuchando en http://localhost:3000

4) Endpoints

GET /api/dispositivos – Lista todos

GET /api/dispositivos/:id – Obtiene por id

POST /api/dispositivos – Crea

PUT /api/dispositivos/:id – Actualiza total/parcial

PATCH /api/dispositivos/:id – Actualiza parcial

DELETE /api/dispositivos/:id – Elimina

Ejemplo POST /api/dispositivos
{
  "hostname": "RTR-Core",
  "ip_address": "192.168.10.1",
  "tipo": "router",
  "ubicacion": "Sala Telecom - Rack A",
  "modelo": "ISR4331",
  "fabricante": "Cisco",
  "serie": "FTX123ABC",
  "estado": "activo",
  "vlan_id": 10
}


Códigos HTTP esperados:
201 (crear), 200 (listar/obtener/actualizar), 204 (borrar), 400 (validación), 404 (no encontrado), 409 (duplicado), 500 (error).

5) Cómo correr las pruebas (Postman)

Abrir Postman → Import → seleccionar postman_collection.json.

Confirmar que la variable base_url sea http://localhost:3000.

Ejecutar en este orden y guardar las capturas:

POST /api/dispositivos → 201 Created

GET /api/dispositivos → 200 OK

GET /api/dispositivos/:id → 200 OK

PUT /api/dispositivos/:id → 200 OK

DELETE /api/dispositivos/:id → 204 No Content

(Opcional) POST con misma IP o hostname → 409 Conflict

Verificación directa en MySQL (Workbench)
USE tarea_api;
SELECT id, hostname, ip_address, tipo, ubicacion, estado, created_at, updated_at
FROM dispositivos
ORDER BY id DESC;

SHOW INDEX FROM dispositivos;


