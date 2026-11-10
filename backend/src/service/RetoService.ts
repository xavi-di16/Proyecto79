import { db } from '../database/db';

export class RetoService {
  // 1. Agregamos el parámetro opcional (empresaFiltro)
  static async obtenerTodos(empresaFiltro?: string) {
    let query: any = db.collection('retos');

    // 2. Si llega el nombre de la empresa desde el controlador, filtramos la base de datos
    if (empresaFiltro) {
      // NOTA: Si en Firebase lo dejaste con mayúscula, cambia 'empresa' por 'Empresa'
      query = query.where('empresa', '==', empresaFiltro);
    }

    const snapshot = await query.get();
    
    return snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        empresa: data.empresa, // o data.Empresa
        titulo: data.titulo,   // o data.Titulo
        descripcion: data.descripcion, // o data.Descripcion
      };
    });
  }

  // Agrega esta nueva función aquí, dentro de la clase RetoService
  static async obtenerPorId(id: string) {
    const doc = await db.collection('retos').doc(id).get();
    
    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    
    return {
      id: doc.id,
      empresa: data?.empresa,
      titulo: data?.titulo,
      descripcion: data?.descripcion,
    
    };
  }
}