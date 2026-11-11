# Anchor79 — frontend P0

Implementa registro, inicio/cierre de sesión, catálogo y resolución del primer reto con React, TypeScript y Monaco. El backend actual también publica los retos de Globant y Workana, por lo que el catálogo los muestra sin añadir flujos distintos.

## Ejecutar

Requiere Node.js `^20.19.0` o `>=22.12.0` y npm. Desde `frontend/`:

```bash
npm ci
npm run dev
```

Abrir `http://localhost:5173`. La app usa por defecto la API publicada en Render (`https://proyecto79-1.onrender.com/api`), así que no requiere configurar variables para esta demo. Para apuntar al backend local, crear `frontend/.env.local` con `VITE_API_URL=http://localhost:3000/api` (o el puerto real de `backend/index.ts`). `.env.example` documenta el valor de producción. Render puede tardar en responder tras un período de inactividad.

```bash
npm run build
npm audit --audit-level=moderate
```

## Flujo y organización

- `src/features/auth`: formularios de registro/login, sesión JWT, expiración y cierre de sesión.
- `src/features/catalog`: catálogo autenticado de retos reales de la API.
- `src/features/workspace`: consigna, Monaco TypeScript, ejecución y cuatro estados de evaluación.
- `src/components`: encabezado compartido.
- `src/services`: cliente HTTP y mensajes de error.
- `src/types`: contrato de datos con el backend.

El código del reto se guarda en `sessionStorage` por usuario y reto. Sigue disponible tras un error o reintento y desaparece al cerrar la sesión del navegador. El JWT se guarda en `localStorage` hasta que el usuario salga o expire a las 24 horas definidas por el backend. Una respuesta 401 fuerza el regreso a login con aviso de sesión vencida.

## Contrato utilizado

| Acción | Endpoint | Datos |
| --- | --- | --- |
| Registro | `POST /api/auth/register` | `nombre`, `email`, `password` |
| Login | `POST /api/auth/login` | `email`, `password` |
| Catálogo | `GET /api/retos` | JWT |
| Detalle | `GET /api/retos/detalle/:id` | JWT |
| Evaluar | `POST /api/retos/ejecutar` | JWT, `challengeId`, `language: "typescript"`, `code` |

El primer reto semilla es `meli-envio`, “Umbral de Envío Gratis”. El backend recibe un programa TypeScript completo que lee stdin y escribe stdout; el código inicial de la API ya incluye esa lectura. La evaluación puede devolver `APPROVED`, `FAILED`, `SYNTAX_ERROR` o `EVALUATION_UNAVAILABLE`. Los casos ocultos y sus salidas no se exponen en el frontend.

## Decisiones y límite de esta entrega

La sección R3 del PRD antiguo dice JavaScript, pero los retos semilla, la documentación del repositorio y el ejecutor actual usan TypeScript. Este frontend sigue el contrato implementado de TypeScript. El modo claro usa el diseño adjunto; el oscuro sigue `prefers-color-scheme`. Todos los colores visibles se derivan de la paleta acordada.

No incluye SSO, perfiles, historial de ejecuciones, ranking, otros flujos de producto ni despliegue de Vercel. Para confirmar el flujo completo en producción hará falta una cuenta de prueba y que Judge0 esté operativo en el backend.
