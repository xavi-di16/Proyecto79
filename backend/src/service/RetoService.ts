// src/service/RetoService.ts
import { db } from '../database/db';
import { RETOS_SEMILLA, ejecutarSeedRetos } from '../database/seed';

export class RetoService {
  private static mapearRetoPublico(id: string, data: any) {
    const empresa = data.empresa || data.company || '';
    const titulo = data.titulo || data.title || '';
    const notaPractica =
      data.notaPractica ||
      data.disclaimer ||
      `Material de práctica inspirado en ${empresa} (no oficial)`;
    const descripcion = data.descripcion || data.statement || '';
    const formatoEntrada = data.formatoEntrada || data.inputFormat || '';
    const formatoSalida = data.formatoSalida || data.outputFormat || '';
    const ejemplo = data.ejemplo || {
      entrada: data.exampleInput || '',
      salida: data.exampleOutput || ''
    };
    const codigoInicial = data.codigoInicial || data.starterCode || '';

    return {
      id,
      empresa,
      titulo,
      notaPractica,
      descripcion,
      formatoEntrada,
      formatoSalida,
      ejemplo,
      codigoInicial,
      company: empresa,
      title: titulo,
      disclaimer: notaPractica,
      statement: descripcion,
      inputFormat: formatoEntrada,
      outputFormat: formatoSalida,
      example: {
        input: ejemplo.entrada || ejemplo.input || '',
        output: ejemplo.salida || ejemplo.output || ''
      },
      starterCode: codigoInicial
    };
  }

  static async obtenerTodos(empresaFiltro?: string) {
    let snapshot = await db.collection('retos').get();

    if (snapshot.empty) {
      await ejecutarSeedRetos();
      snapshot = await db.collection('retos').get();
    }

    let lista = snapshot.docs.map((doc: any) =>
      this.mapearRetoPublico(doc.id, doc.data())
    );

    if (empresaFiltro) {
      const filtro = empresaFiltro.trim().toLowerCase();
      lista = lista.filter((r) => r.empresa.toLowerCase() === filtro);
    }

    return lista;
  }

  static async obtenerPorId(id: string) {
    const doc = await db.collection('retos').doc(id).get();

    if (!doc.exists) {
      const semilla = RETOS_SEMILLA.find((r) => r.id === id);
      if (!semilla) return null;
      await ejecutarSeedRetos();
      return this.mapearRetoPublico(semilla.id, semilla);
    }

    return this.mapearRetoPublico(doc.id, doc.data());
  }

  static async obtenerParaEvaluacion(id: string) {
    const doc = await db.collection('retos').doc(id).get();

    if (!doc.exists) {
      const semilla = RETOS_SEMILLA.find((r) => r.id === id);
      if (!semilla) return null;
      await ejecutarSeedRetos();
      return semilla;
    }

    const data = doc.data() as any;
    const SemillaFallback = RETOS_SEMILLA.find((r) => r.id === id);

    return {
      id: doc.id,
      empresa: data.empresa || SemillaFallback?.empresa || '',
      titulo: data.titulo || SemillaFallback?.titulo || '',
      casosPrueba:
        Array.isArray(data.casosPrueba) && data.casosPrueba.length > 0
          ? data.casosPrueba
          : SemillaFallback?.casosPrueba || []
    };
  }
}