// src/middleware/middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_desarrollo_proyecto79';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    nombre?: string;
    name?: string;
    email: string;
  };
}

export const NotFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    msg: 'Ruta no encontrada'
  });
};

export const validateAuthInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body) {
    return res.status(400).json({ msg: 'Debes enviar un cuerpo JSON válido' });
  }

  const { email, password, nombre, name } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ msg: 'El correo y la contraseña son obligatorios' });
  }

  const nombreRecibido = nombre ?? name;
  if (
    nombreRecibido !== undefined &&
    String(nombreRecibido).trim().length === 0
  ) {
    return res.status(400).json({ msg: 'El nombre no puede estar vacío' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(String(email).trim())) {
    return res
      .status(400)
      .json({ msg: 'Debes ingresar un correo electrónico válido' });
  }

  if (String(password).length < 4) {
    return res
      .status(400)
      .json({ msg: 'La contraseña debe tener al menos 4 caracteres' });
  }

  next();
};

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      ok: false,
      msg: 'No autorizado: debes iniciar sesión y enviar un token Bearer válido'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      nombre?: string;
      name?: string;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Sesión vencida o token inválido. Por favor, vuelve a iniciar sesión'
    });
  }
};