import { db } from '../database/db';

export class UsuarioService {
  static async obtenerTodos() {
    const snapshot = await db.collection('usuarios').get();
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  }

  static async registrar(email: string, password: string) {
    const nuevoUsuario = {
      email,
      password,
      created_at: new Date().toISOString()
    };
    // .add() crea un documento con un ID automático
    const docRef = await db.collection('usuarios').add(nuevoUsuario);
    return { id: docRef.id, ...nuevoUsuario };
  }

  static async findByEmail(email: string) {
    const snapshot = await db.collection('usuarios')
      .where('email', '==', email)
      .limit(1)
      .get();
      
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async validateCredentials(email: string, password: string) {
    const snapshot = await db.collection('usuarios')
      .where('email', '==', email)
      .where('password', '==', password)
      .limit(1)
      .get();
      
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async updatePassword(email: string, password: string) {
    const snapshot = await db.collection('usuarios')
      .where('email', '==', email)
      .limit(1)
      .get();
      
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    await doc.ref.update({ password });
    return { id: doc.id, email };
  }
}