//src/controllers/usuarioController.ts

import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UsuarioService } from '../service/usuarioServices'; // Ajusta la ruta y el nombre según tu archivo

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await UsuarioService.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ msg: 'El correo electrónico ya está registrado' });
    }

    const nuevoUsuario = await UsuarioService.registrar(email, password);

    return res.status(201).json({
      msg: 'Usuario creado correctamente',
      data: { id: nuevoUsuario.id, email: nuevoUsuario.email }
    });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    return res.status(500).json({ msg: 'Error al crear el usuario' });
  }
};
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Agrega ": any" a la declaración de la variable user
    const user: any = await UsuarioService.validateCredentials(email, password);
    
    if (!user) {
      return res.status(401).json({ msg: 'Credenciales inválidas' });
    }

    // Firma del token JWT real con duración de 8 horas
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secreto_desarrollo_proyecto79',
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      msg: 'Login exitoso',
      token, 
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error('Error en el login:', error);
    return res.status(500).json({ msg: 'Error interno en el inicio de sesión' });
  }
};
// export const loginUser = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     const user = await UsuarioService.validateCredentials(email, password);
//     if (!user) {
//       return res.status(401).json({ msg: 'Credenciales inválidas' });
//     }

//     return res.status(200).json({
//       msg: 'Login exitoso',
//       token: 'mock-jwt-token-semana-1',
//       user: { id: user.id, email: user.email }
//     });
//   } catch (error) {
//     console.error('Error en el login:', error);
//     return res.status(500).json({ msg: 'Error interno en el inicio de sesión' });
//   }
// };

export const getAllUsers = async (req: Request, res: Response) => {
  try { 
    const users = await UsuarioService.obtenerTodos();
    return res.status(200).json({
      msg: 'Usuarios obtenidos correctamente',
      data: users.map((user: any) => ({ id: user.id, email: user.email }))
    });
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return res.status(500).json({ msg: 'Error al obtener los usuarios' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'El correo y la nueva contraseña son obligatorios' });
    }
    const updatedUser = await UsuarioService.updatePassword(email, password);

    if (!updatedUser) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      msg: 'Contraseña actualizada correctamente',
      data: { id: updatedUser.id, email: updatedUser.email }
    });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return res.status(500).json({ msg: 'Error al actualizar el usuario' });
  }
};