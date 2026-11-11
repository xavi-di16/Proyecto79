// src/service/usuarioServices.ts
import bcrypt from 'bcrypt';
import { db } from '../database/db';

const SALT_ROUNDS = 10;

export class UsuarioService {
  static async obtenerTodos() {
    const snapshot = await db.collection('usuarios').get();
    return snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data.nombre || data.name || '',
        name: data.nombre || data.name || '',
        email: data.email,
        created_at: data.created_at
      };
    });
  }

  static async registrar(email: string, passwordPlano: string, nombre?: string) {
    const emailNormalizado = email.trim().toLowerCase();
    const nombreLimpio = (nombre || emailNormalizado.split('@')[0]).trim();
    const passwordHash = await bcrypt.hash(passwordPlano, SALT_ROUNDS);

    const nuevoUsuario = {
      nombre: nombreLimpio,
      name: nombreLimpio,
      email: emailNormalizado,
      passwordHash,
      created_at: new Date().toISOString()
    };

    const docRef = await db.collection('usuarios').add(nuevoUsuario);
    return {
      id: docRef.id,
      nombre: nuevoUsuario.nombre,
      name: nuevoUsuario.name,
      email: nuevoUsuario.email,
      created_at: nuevoUsuario.created_at
    };
  }

  static async findByEmail(email: string) {
    const emailNormalizado = email.trim().toLowerCase();
    const snapshot = await db
      .collection('usuarios')
      .where('email', '==', emailNormalizado)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...(doc.data() as any) };
  }

  static async validateCredentials(email: string, passwordPlano: string) {
    const usuario = await this.findByEmail(email);
    if (!usuario) return null;

    const nombreUsuario =
      usuario.nombre || usuario.name || usuario.email.split('@')[0];

    if (usuario.passwordHash) {
      const coincide = await bcrypt.compare(passwordPlano, usuario.passwordHash);
      if (!coincide) return null;
      return {
        id: usuario.id,
        nombre: nombreUsuario,
        name: nombreUsuario,
        email: usuario.email
      };
    }

    if (usuario.password && usuario.password === passwordPlano) {
      return {
        id: usuario.id,
        nombre: nombreUsuario,
        name: nombreUsuario,
        email: usuario.email
      };
    }

    return null;
  }

  static async updatePassword(email: string, nuevaPasswordPlano: string) {
    const emailNormalizado = email.trim().toLowerCase();
    const snapshot = await db
      .collection('usuarios')
      .where('email', '==', emailNormalizado)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data() as any;
    const passwordHash = await bcrypt.hash(nuevaPasswordPlano, SALT_ROUNDS);
    await doc.ref.update({ passwordHash });

    const nombreUsuario =
      data.nombre || data.name || emailNormalizado.split('@')[0];

    return {
      id: doc.id,
      nombre: nombreUsuario,
      name: nombreUsuario,
      email: emailNormalizado
    };
  }
}