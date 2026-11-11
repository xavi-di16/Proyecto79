export interface User { id: string; nombre: string; email: string }
export interface Session { token: string; user: User }
export interface Challenge {
  id: string; empresa: string; titulo: string; notaPractica: string;
  descripcion: string; formatoEntrada: string; formatoSalida: string;
  ejemplo: { entrada: string; salida: string }; codigoInicial: string
}
export type EvaluationStatus = 'APPROVED' | 'FAILED' | 'SYNTAX_ERROR' | 'EVALUATION_UNAVAILABLE'
export interface Evaluation {
  status: EvaluationStatus; estadoVisible: string; passedCases: number; totalCases: number;
  sampleOutput: string | null; errorDetail: string | null;
  failedCase: { caseNumber: number; input: string; expectedOutput: string; actualOutput: string } | null
}
