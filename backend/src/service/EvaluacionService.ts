// src/service/EvaluacionService.ts
import { RetoService } from './RetoService';
import { compareByApproximation, normalizeOutput } from '../utils/normalizer';

export type EstadoEvaluacion =
    | 'APPROVED'
    | 'SYNTAX_ERROR'
    | 'FAILED'
    | 'EVALUATION_UNAVAILABLE';

export interface ResultadoEvaluacion {
    status: EstadoEvaluacion;
    estadoVisible: 'Aprobado' | 'Error de sintaxis' | 'Falló' | 'No se pudo evaluar';
    passedCases: number;
    totalCases: number;
    sampleOutput: string | null;
    errorDetail: string | null;
    failedCase: {
        caseNumber: number;
        input: string;
        expectedOutput: string;
        actualOutput: string;
    } | null;
}

interface Judge0SubmissionResponse {
    token?: string;
    stdout?: string | null;
    stderr?: string | null;
    compile_output?: string | null;
    message?: string | null;
    status?: {
        id: number;
        description: string;
    };
}

const DEFAULT_JUDGE0_URL = 'https://ce.judge0.com';
const JUDGE0_TIMEOUT_MS = Number(process.env.JUDGE0_TIMEOUT_MS || 15000);
const POLL_INTERVAL_MS = 900;
const MAX_POLL_ATTEMPTS = 12;

export class EvaluacionService {
    private static obtenerHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        const apiKey = process.env.JUDGE0_API_KEY;
        const apiHost = process.env.JUDGE0_API_HOST;

        if (apiKey) {
            headers['X-RapidAPI-Key'] = apiKey;
            if (apiHost) {
                headers['X-RapidAPI-Host'] = apiHost;
            }
        }

        const authToken = process.env.JUDGE0_AUTH_TOKEN;
        if (authToken) {
            headers['X-Auth-Token'] = authToken;
        }

        return headers;
    }

    private static obtenerLanguageId(language?: string): number {
        const lang = (language || 'typescript').trim().toLowerCase();
        if (lang === 'javascript' || lang === 'js') {
            return Number(process.env.JUDGE0_JS_LANGUAGE_ID || 63);
        }
        return Number(process.env.JUDGE0_TS_LANGUAGE_ID || 74);
    }

    private static decodificarBase64(valor?: string | null): string {
        if (!valor) return '';
        try {
            return Buffer.from(valor, 'base64').toString('utf8');
        } catch {
            return valor;
        }
    }

    private static async ejecutarEnJudge0(
        sourceCode: string,
        stdin: string,
        languageId: number
    ): Promise<Judge0SubmissionResponse> {
        const baseUrl = (process.env.JUDGE0_API_URL || DEFAULT_JUDGE0_URL).replace(/\/+$/, '');
        const headers = this.obtenerHeaders();

        const payload = {
            language_id: languageId,
            source_code: Buffer.from(sourceCode, 'utf8').toString('base64'),
            stdin: Buffer.from(stdin, 'utf8').toString('base64')
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), JUDGE0_TIMEOUT_MS);

        try {
            const createRes = await fetch(
                `${baseUrl}/submissions?base64_encoded=true&wait=true`,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload),
                    signal: controller.signal
                }
            );

            if (!createRes.ok) {
                throw new Error(`Judge0 HTTP ${createRes.status}`);
            }

            let data = (await createRes.json()) as Judge0SubmissionResponse;

            let attempts = 0;
            while (
                data.token &&
                (!data.status || data.status.id === 1 || data.status.id === 2) &&
                attempts < MAX_POLL_ATTEMPTS
            ) {
                await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
                attempts++;

                const pollRes = await fetch(
                    `${baseUrl}/submissions/${data.token}?base64_encoded=true`,
                    {
                        method: 'GET',
                        headers,
                        signal: controller.signal
                    }
                );

                if (!pollRes.ok) {
                    throw new Error(`Judge0 Poll HTTP ${pollRes.status}`);
                }

                data = (await pollRes.json()) as Judge0SubmissionResponse;
            }

            return {
                ...data,
                stdout: this.decodificarBase64(data.stdout),
                stderr: this.decodificarBase64(data.stderr),
                compile_output: this.decodificarBase64(data.compile_output),
                message: this.decodificarBase64(data.message)
            };
        } finally {
            clearTimeout(timeoutId);
        }
    }

    static async evaluarSolucion(
        challengeId: string,
        code: string,
        language = 'typescript'
    ): Promise<{ httpStatus: number; body: ResultadoEvaluacion | { msg: string } }> {
        const reto = await RetoService.obtenerParaEvaluacion(challengeId);

        if (!reto) {
            return {
                httpStatus: 404,
                body: { msg: 'Reto no encontrado' }
            };
        }

        const casos = reto.casosPrueba || [];
        if (casos.length === 0) {
            return {
                httpStatus: 200,
                body: {
                    status: 'EVALUATION_UNAVAILABLE',
                    estadoVisible: 'No se pudo evaluar',
                    passedCases: 0,
                    totalCases: 0,
                    sampleOutput: null,
                    errorDetail: 'El reto no tiene casos de prueba configurados.',
                    failedCase: null
                }
            };
        }

        const languageId = this.obtenerLanguageId(language);
        let passedCases = 0;
        let sampleOutput: string | null = null;

        try {
            for (let i = 0; i < casos.length; i++) {
                const caso = casos[i];
                const resultadoJudge = await this.ejecutarEnJudge0(
                    code,
                    caso.entrada,
                    languageId
                );

                const statusId = resultadoJudge.status?.id;

                if (!statusId || statusId === 1 || statusId === 2 || statusId === 13) {
                    return {
                        httpStatus: 200,
                        body: {
                            status: 'EVALUATION_UNAVAILABLE',
                            estadoVisible: 'No se pudo evaluar',
                            passedCases,
                            totalCases: casos.length,
                            sampleOutput,
                            errorDetail:
                                'El servicio de evaluación tardó demasiado o no estuvo disponible. Puedes reintentar sin perder tu código.',
                            failedCase: null
                        }
                    };
                }

                if (statusId === 6) {
                    const detalleCompilacion =
                        normalizeOutput(resultadoJudge.compile_output) ||
                        normalizeOutput(resultadoJudge.stderr) ||
                        'Error de sintaxis o compilación en el código enviado.';

                    return {
                        httpStatus: 200,
                        body: {
                            status: 'SYNTAX_ERROR',
                            estadoVisible: 'Error de sintaxis',
                            passedCases: 0,
                            totalCases: casos.length,
                            sampleOutput: null,
                            errorDetail: detalleCompilacion,
                            failedCase: null
                        }
                    };
                }

                if (statusId >= 5 && statusId <= 12) {
                    const detalleRuntime =
                        normalizeOutput(resultadoJudge.stderr) ||
                        normalizeOutput(resultadoJudge.message) ||
                        `Error durante la ejecución (${resultadoJudge.status?.description || 'Runtime Error'}).`;

                    return {
                        httpStatus: 200,
                        body: {
                            status: 'FAILED',
                            estadoVisible: 'Falló',
                            passedCases,
                            totalCases: casos.length,
                            sampleOutput,
                            errorDetail: detalleRuntime,
                            failedCase: {
                                caseNumber: i + 1,
                                input: caso.esPublico ? caso.entrada : 'Caso de prueba oculto',
                                expectedOutput: caso.esPublico ? caso.salidaEsperada : 'Oculto',
                                actualOutput: detalleRuntime
                            }
                        }
                    };
                }

                const stdoutLimpio = normalizeOutput(resultadoJudge.stdout);
                if (i === 0) {
                    sampleOutput = stdoutLimpio;
                }

                const aproboCaso = compareByApproximation(
                    stdoutLimpio,
                    caso.salidaEsperada
                );

                if (!aproboCaso) {
                    return {
                        httpStatus: 200,
                        body: {
                            status: 'FAILED',
                            estadoVisible: 'Falló',
                            passedCases,
                            totalCases: casos.length,
                            sampleOutput,
                            errorDetail: `La salida del caso #${i + 1} no coincide con el resultado esperado.`,
                            failedCase: {
                                caseNumber: i + 1,
                                input: caso.esPublico ? caso.entrada : 'Caso de prueba oculto',
                                expectedOutput: caso.esPublico
                                    ? normalizeOutput(caso.salidaEsperada)
                                    : 'Oculto',
                                actualOutput: stdoutLimpio || '(sin salida en consola)'
                            }
                        }
                    };
                }

                passedCases++;
            }

            return {
                httpStatus: 200,
                body: {
                    status: 'APPROVED',
                    estadoVisible: 'Aprobado',
                    passedCases,
                    totalCases: casos.length,
                    sampleOutput,
                    errorDetail: null,
                    failedCase: null
                }
            };
        } catch (error) {
            console.error('Error de comunicación con Judge0:', error);
            return {
                httpStatus: 200,
                body: {
                    status: 'EVALUATION_UNAVAILABLE',
                    estadoVisible: 'No se pudo evaluar',
                    passedCases: 0,
                    totalCases: casos.length,
                    sampleOutput: null,
                    errorDetail:
                        'No se pudo conectar con el motor de evaluación (Judge0). Por favor, presiona Reintentar.',
                    failedCase: null
                }
            };
        }
    }
}