import { ApiError, type PracticeApi } from '../services/api'
import type { Challenge, Evaluation, EvaluationStatus } from '../types/api'

// Datos públicos del reto semilla. La demo no incluye ni ejecuta casos ocultos.
const firstChallenge: Challenge = {
  id: 'meli-envio',
  empresa: 'Mercado Libre',
  titulo: 'Umbral de Envío Gratis',
  notaPractica: 'Material de práctica inspirado en Mercado Libre (no oficial)',
  descripcion: 'Dados dos números enteros separados por un espacio (el monto actual del carrito y el monto mínimo requerido para obtener envío gratis), imprime cuánto dinero falta agregar al carrito para alcanzar el envío gratis. Si el carrito ya alcanzó o superó el monto mínimo, imprime 0.',
  formatoEntrada: 'Una línea de texto con dos enteros positivos separados por espacio: <totalCarrito> <minimoEnvioGratis>.',
  formatoSalida: 'Un único número entero que representa el monto faltante para el envío gratis (o 0 si ya aplica).',
  ejemplo: { entrada: '15000 20000', salida: '5000' },
  codigoInicial: `import * as fs from "fs";

const input = fs.readFileSync(0, "utf8").trim();
const [carrito, minimo] = input.split(/\\s+/).map(Number);

// Escribe tu solución en TypeScript aquí y muestra el resultado con console.log()
`,
}

function simulatedResult(status: EvaluationStatus): Evaluation {
  const common = { passedCases: 0, totalCases: 2, sampleOutput: null, failedCase: null }
  switch (status) {
    case 'APPROVED':
      return { ...common, status, estadoVisible: 'Aprobado (demo)', passedCases: 2, sampleOutput: '5000', errorDetail: 'Resultado simulado: el código no se ejecutó.' }
    case 'FAILED':
      return { ...common, status, estadoVisible: 'Falló (demo)', errorDetail: 'Resultado simulado: el código no se ejecutó.', failedCase: { caseNumber: 1, input: '15000 20000', expectedOutput: '5000', actualOutput: '0' } }
    case 'SYNTAX_ERROR':
      return { ...common, status, estadoVisible: 'Error de sintaxis (demo)', errorDetail: 'Resultado simulado: el código no se ejecutó.' }
    case 'EVALUATION_UNAVAILABLE':
      return { ...common, status, estadoVisible: 'No se pudo evaluar (demo)', totalCases: 0, errorDetail: 'Fallo técnico simulado. El código permanece en el editor.' }
  }
}

export function createDemoApi(getOutcome: () => EvaluationStatus): PracticeApi {
  return {
    async challenges() { return [firstChallenge] },
    async challenge(id) {
      if (id !== firstChallenge.id) throw new ApiError('Reto no disponible en esta demo.', 404)
      return firstChallenge
    },
    async execute() {
      await new Promise(resolve => setTimeout(resolve, 350))
      return simulatedResult(getOutcome())
    },
  }
}
