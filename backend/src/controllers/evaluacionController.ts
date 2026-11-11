// src/controllers/evaluacionController.ts
import { Request, Response } from 'express';
import { EvaluacionService } from '../service/EvaluacionService';

const MAX_CODE_LENGTH = 20000;

export const ejecutarReto = async (req: Request, res: Response) => {
    try {
        const challengeId =
            (req.params.id as string) ||
            req.body?.challengeId ||
            req.body?.retoId ||
            req.body?.id;

        const code = req.body?.code ?? req.body?.codigo;
        const language = req.body?.language || req.body?.lenguaje || 'typescript';

        if (!challengeId) {
            return res.status(400).json({
                msg: 'El identificador del reto (challengeId) es obligatorio'
            });
        }

        if (typeof code !== 'string' || code.trim().length === 0) {
            return res.status(400).json({
                msg: 'El código de la solución no puede estar vacío'
            });
        }

        if (code.length > MAX_CODE_LENGTH) {
            return res.status(400).json({
                msg: `El código excede el límite permitido de ${MAX_CODE_LENGTH} caracteres`
            });
        }

        const resultado = await EvaluacionService.evaluarSolucion(
            challengeId,
            code,
            language
        );

        return res.status(resultado.httpStatus).json(resultado.body);
    } catch (error) {
        console.error('Error inesperado en ejecutarReto:', error);
        return res.status(200).json({
            status: 'EVALUATION_UNAVAILABLE',
            estadoVisible: 'No se pudo evaluar',
            passedCases: 0,
            totalCases: 0,
            sampleOutput: null,
            errorDetail:
                'Ocurrió un fallo técnico al procesar la evaluación. Intenta nuevamente.',
            failedCase: null
        });
    }
};