
//src/middleware/middleware.ts
import { Request, Response, NextFunction } from 'express';

export const NotFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    msg: 'Ruta no encontrada'
  });
};

export const validateAuthInput = (req: Request, res: Response, next: NextFunction) => {
  // Comprobar que req.body exista
  if (!req.body) {
    return res.status(400).json({ msg: 'Debes enviar un cuerpo JSON válido' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'El correo y la contraseña son obligatorios' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: 'Debes ingresar un correo electrónico válido' });
  }

  next();
};