// src/router/router.ts
import { Router } from 'express';
import { healthController } from '../controllers/healthController';
import {
    registerUser,
    loginUser,
    getAllUsers,
    updateUser
} from '../controllers/usuarioController';
import {
    validateAuthInput,
    authenticateJWT
} from '../middleware/middleware';
import {
    getRetos,
    getRetosByEmpresa,
    getRetoById
} from '../controllers/retoController';
import { ejecutarReto } from '../controllers/evaluacionController';

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Verificar estado del servicio
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: El backend está funcionando correctamente
 */
router.get('/health', healthController);

/**
 * @openapi
 * /api/usuario/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Xavi Lorenzo
 *               email:
 *                 type: string
 *                 example: estudiante@gmail.com
 *               password:
 *                 type: string
 *                 example: "Password123"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente y token emitido
 *       400:
 *         description: Datos de entrada inválidos o correo ya registrado
 */
router.post('/usuario/register', validateAuthInput, registerUser);
router.post('/auth/register', validateAuthInput, registerUser);

/**
 * @openapi
 * /api/usuario/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: estudiante@gmail.com
 *               password:
 *                 type: string
 *                 example: "Password123"
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/usuario/login', validateAuthInput, loginUser);
router.post('/auth/login', validateAuthInput, loginUser);

/**
 * @openapi
 * /api/usuario:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios (sin passwords)
 *       401:
 *         description: No autorizado
 */
router.get('/usuario', authenticateJWT, getAllUsers);

/**
 * @openapi
 * /api/usuario/actualizar-contrasena:
 *   put:
 *     summary: Actualizar contraseña de usuario
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: estudiante@gmail.com
 *               password:
 *                 type: string
 *                 example: nuevaContrasena123
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: El correo y la nueva contraseña son obligatorios
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.put(
    '/usuario/actualizar-contrasena',
    authenticateJWT,
    validateAuthInput,
    updateUser
);

/**
 * @openapi
 * /api/retos:
 *   get:
 *     summary: Obtener el catálogo de retos (protegido con JWT)
 *     tags:
 *       - Retos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de retos disponibles sin casos de prueba ocultos
 *       401:
 *         description: No autorizado o sesión vencida
 */
router.get('/retos', authenticateJWT, getRetos);
router.get('/challenges', authenticateJWT, getRetos);

/**
 * @openapi
 * /api/retos/detalle/{id}:
 *   get:
 *     summary: Obtener el detalle de un reto específico (protegido con JWT)
 *     tags:
 *       - Retos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID único del reto (meli-envio, globant-sprint, workana-comision)
 *     responses:
 *       200:
 *         description: Datos del reto (sin casos de prueba ocultos)
 *       401:
 *         description: No autorizado o sesión vencida
 *       404:
 *         description: Reto no encontrado
 */
router.get('/retos/detalle/:id', authenticateJWT, getRetoById);
router.get('/challenges/:id', authenticateJWT, getRetoById);

/**
 * @openapi
 * /api/retos/ejecutar:
 *   post:
 *     summary: Evaluar solución en TypeScript con Judge0 (protegido con JWT)
 *     tags:
 *       - Evaluación
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - challengeId
 *               - code
 *             properties:
 *               challengeId:
 *                 type: string
 *                 example: meli-envio
 *               language:
 *                 type: string
 *                 example: typescript
 *               code:
 *                 type: string
 *                 example: |
 *                   import * as fs from "fs";
 *                   const [carrito, minimo] = fs.readFileSync(0, "utf8").trim().split(/\s+/).map(Number);
 *                   console.log(Math.max(0, minimo - carrito));
 *     responses:
 *       200:
 *         description: Resultado de evaluación (APPROVED | SYNTAX_ERROR | FAILED | EVALUATION_UNAVAILABLE)
 *       400:
 *         description: Código vacío o datos faltantes
 *       401:
 *         description: No autorizado o sesión vencida
 *       404:
 *         description: Reto no encontrado
 */
router.post('/retos/ejecutar', authenticateJWT, ejecutarReto);
router.post('/execute', authenticateJWT, ejecutarReto);
router.post('/challenges/:id/execute', authenticateJWT, ejecutarReto);

/**
 * @openapi
 * /api/retos/{empresa}:
 *   get:
 *     summary: Obtener retos filtrados por empresa (protegido con JWT)
 *     tags:
 *       - Retos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: empresa
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la empresa (Mercado Libre, Globant, Workana)
 *     responses:
 *       200:
 *         description: Lista de retos filtrados
 *       401:
 *         description: No autorizado o sesión vencida
 */
router.get('/retos/:empresa', authenticateJWT, getRetosByEmpresa);

export default router;