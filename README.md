# 🚀 Proyecto Xenry (a79) — Plataforma de Práctica de Retos Técnicos

Plataforma web MVP diseñada para que estudiantes de desarrollo practiquen retos de código inspirados en empresas reales (**Mercado Libre, Globant y Workana**), escriban soluciones en un editor integrado (**Monaco Editor**) y reciban evaluación automatizada y determinista en tiempo real mediante **Judge0**.

> **Aviso importante:** Todos los retos incluidos en esta plataforma son material pedagógico y de práctica inspirado en contextos técnicos de la industria. No representan pruebas oficiales ni implican afiliación con las marcas mencionadas.

---

## 🔗 Enlaces de Producción (Demo P0)

| Entorno | URL Pública | Estado |
| :--- | :--- | :--- |
| **Frontend (Vercel)** | `https://proyecto-xenry.vercel.app` *(Actualizar)* | 🟡 En configuración |
| **Backend API (Render)** | `https://proyecto-xenry-api.onrender.com/api` *(Actualizar)* | 🟡 En configuración |
| **Healthcheck** | `https://proyecto-xenry-api.onrender.com/api/health` | 🟡 En configuración |
| **Colección Postman** | [`/docs/postman/xenry.postman_collection.json`](./docs/postman/xenry.postman_collection.json) | 📄 Incluida en repo |

---

## 🎯 Flujo Principal del Producto (P0)

1. **Acceso (`R1`):** Registro e inicio de sesión con correo y contraseña (sesión gestionada vía JWT con manejo de expiración limpio).
2. **Catálogo por Empresa (`R2`):** Selección de retos técnicos asociados a **Mercado Libre**, **Globant** y **Workana**.
3. **Espacio de Práctica (`R3`):** Lectura de consigna, contrato de entrada/salida, caso de ejemplo y codificación en **TypeScript** sobre **Monaco Editor** con persistencia en sesión activa.
4. **Evaluación Confiable (`R4`, `R5`):** Ejecución en backend contra **Judge0** evaluando casos de prueba deterministas con regla de aprobación por aproximación (normalización de `stdout` y tolerancia numérica de $\pm 0.01$).
5. **Resiliencia y Recuperación (`R6`):** Distinción estricta entre errores del estudiante (`Aprobado`, `Error de sintaxis`, `Falló`) y fallos técnicos de infraestructura (`No se pudo evaluar`), permitiendo reintentar sin perder el código escrito.

---

## 🛠️ Stack Tecnológico

### Frontend (`/frontend`)
* **Framework:** React + TypeScript (Vite)
* **Editor de Código:** `@monaco-editor/react` (configurado para TypeScript)
* **Estilos:** Antigravity / CSS adaptable (Diseño *Desktop-first* con apilado responsivo en móvil y navegación por teclado)
* **Hosting:** Vercel

### Backend (`/backend`)
* **Runtime & Framework:** Node.js + Express con TypeScript
* **Persistencia y Datos:** Firebase (Cloud Firestore vía `firebase-admin`)
* **Seguridad:** Hash de contraseñas con `bcrypt`, autenticación por `jsonwebtoken` (JWT) y validación de payloads/rate-limiting
* **Motor de Ejecución:** Integración con **Judge0 CE API** (`language_id: 74` para TypeScript / `63` para JS Node.js)
* **Hosting:** Render

---

## 📂 Estructura del Repositorio (Monorepo)

```text
proyecto-xenry/
├── frontend/                  # Aplicación React + TypeScript + Monaco (Despliegue en Vercel)
│   ├── src/
│   │   ├── components/        # Componentes UI reutilizables y estados de carga/error
│   │   ├── features/          # Módulos: auth, catalog, workspace
│   │   ├── services/          # Cliente HTTP y manejo de token JWT
│   │   └── types/             # Contratos TypeScript compartidos con la API
│   ├── .env.example
│   └── package.json
│
├── backend/                   # API REST Node + Express + TypeScript (Despliegue en Render)
│   ├── src/
│   │   ├── config/            # Inicialización de Firebase Admin, CORS y variables de entorno
│   │   ├── middlewares/       # Validación de JWT y control de errores
│   │   ├── modules/           # Módulos: auth, challenges, judge
│   │   ├── scripts/           # seed.ts (Carga idempotente de retos de MeLi, Globant y Workana)
│   │   └── app.ts             # Punto de entrada de Express
│   ├── .env.example
│   └── package.json
│
├── docs/                      # Documentación técnica y artefactos de prueba
│   ├── postman/               # Colección Postman para validar R1 a R7
│   └── PRD_Xenry_v1.0.pdf     # Documento de Requisitos de Producto
│
└── README.md
```

---

## ⚙️ Configuración e Instalación Local

### 1. Prerrequisitos
* **Node.js** $\ge 18.x$ y **npm**
* Credenciales de servicio de **Firebase** (Service Account JSON o variables de entorno)
* API Key de **Judge0** (vía RapidAPI o instancia configurada)

### 2. Clonar el repositorio
```bash
git clone https://github.com/TU-USUARIO/proyecto-xenry.git
cd proyecto-xenry
```

### 3. Configurar y levantar el Backend
```bash
cd backend
cp .env.example .env
# Completar las variables en .env
npm install
npm run seed    # Carga los retos semilla de MeLi, Globant y Workana en Firestore
npm run dev     # Levanta el servidor en http://localhost:4000
```

**Variables de entorno del Backend (`backend/.env.example`):**
```env
PORT=4000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=reemplazar_por_secreto_seguro
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_CLIENT_EMAIL=tu_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=tu_api_key_de_rapidapi
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
```

### 4. Configurar y levantar el Frontend
En otra terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev     # Levanta el cliente en http://localhost:5173
```

**Variables de entorno del Frontend (`frontend/.env.example`):**
```env
VITE_API_URL=http://localhost:4000/api
```

---

## 📡 Contrato de API (Resumen)

| Método | Endpoint | Auth | Descripción |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/health` | No | Verifica estado del servidor en Render. |
| `POST` | `/api/auth/register` | No | Crea cuenta de estudiante (`email`, `password`) y retorna JWT. |
| `POST` | `/api/auth/login` | No | Inicia sesión y retorna `{ token, user }`. |
| `GET` | `/api/challenges` | Bearer JWT | Lista empresas (`MeLi`, `Globant`, `Workana`) y sus retos activos. |
| `GET` | `/api/challenges/:id` | Bearer JWT | Obtiene consigna, ejemplo público y `starterCode` (oculta casos privados). |
| `POST` | `/api/execute` | Bearer JWT | Evalúa `{ challengeId, language, code }` en Judge0 y retorna uno de los 4 estados (`APPROVED`, `SYNTAX_ERROR`, `FAILED`, `EVALUATION_UNAVAILABLE`). |

---

## 👥 Equipo y Responsabilidades

| Integrante | Rol | Enfoque Principal |
| :--- | :--- | :--- |
| **Miguel Miranda** | Product Owner & Frontend | Alcance P0, flujo de Autenticación, Catálogo y criterios de aceptación (`R1`, `R2`). |
| **Santiago Sánchez** | Frontend Developer | Vista de Práctica, integración de Monaco Editor, accesibilidad y estados de resultado (`R3`, `R4`, `R6`). |
| **Xavi Lorenzo** | Backend Developer | Arquitectura en Render + Firebase, Autenticación JWT, Catálogo y script de datos semilla (`R1`, `R2`, `D-03`). |
| **César Manzano** | Backend Developer | Motor de ejecución con Judge0, regla de aprobación por aproximación, resiliencia y Postman (`R4`, `R5`, `R6`, `R7`). |