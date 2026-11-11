// src/database/seed.ts
import { db } from './db';

export interface CasoPrueba {
    entrada: string;
    salidaEsperada: string;
    esPublico: boolean;
}

export interface RetoSemilla {
    id: string;
    empresa: string;
    titulo: string;
    notaPractica: string;
    descripcion: string;
    formatoEntrada: string;
    formatoSalida: string;
    ejemplo: {
        entrada: string;
        salida: string;
    };
    codigoInicial: string;
    casosPrueba: CasoPrueba[];
}

export const RETOS_SEMILLA: RetoSemilla[] = [
    {
        id: 'meli-envio',
        empresa: 'Mercado Libre',
        titulo: 'Umbral de Envío Gratis',
        notaPractica: 'Material de práctica inspirado en Mercado Libre (no oficial)',
        descripcion:
            'Dados dos números enteros separados por un espacio (el monto actual del carrito y el monto mínimo requerido para obtener envío gratis), imprime cuánto dinero falta agregar al carrito para alcanzar el envío gratis. Si el carrito ya alcanzó o superó el monto mínimo, imprime 0.',
        formatoEntrada:
            'Una línea de texto con dos enteros positivos separados por espacio: <totalCarrito> <minimoEnvioGratis>.',
        formatoSalida:
            'Un único número entero que representa el monto faltante para el envío gratis (o 0 si ya aplica).',
        ejemplo: {
            entrada: '15000 20000',
            salida: '5000'
        },
        codigoInicial: `import * as fs from "fs";

const input = fs.readFileSync(0, "utf8").trim();
const [carrito, minimo] = input.split(/\\s+/).map(Number);

// Escribe tu solución en TypeScript aquí y muestra el resultado con console.log()
`,
        casosPrueba: [
            {
                entrada: '15000 20000',
                salidaEsperada: '5000',
                esPublico: true
            },
            {
                entrada: '25000 20000',
                salidaEsperada: '0',
                esPublico: false
            }
        ]
    },
    {
        id: 'globant-sprint',
        empresa: 'Globant',
        titulo: 'Velocidad Promedio del Sprint',
        notaPractica: 'Material de práctica inspirado en Globant (no oficial)',
        descripcion:
            'Dada una lista de números separados por espacio que representan los puntos de historia completados por cada integrante del equipo durante un sprint, calcula e imprime el promedio de puntos completados redondeado a un máximo de 2 decimales.',
        formatoEntrada:
            'Una línea con números enteros separados por espacio (ej. "10 20 30").',
        formatoSalida:
            'El promedio numérico de los valores recibidos (se acepta tolerancia decimal de ±0.01).',
        ejemplo: {
            entrada: '10 20 30',
            salida: '20'
        },
        codigoInicial: `import * as fs from "fs";

const input = fs.readFileSync(0, "utf8").trim();
const puntos = input.split(/\\s+/).map(Number);

// Escribe tu solución en TypeScript aquí y muestra el resultado con console.log()
`,
        casosPrueba: [
            {
                entrada: '10 20 30',
                salidaEsperada: '20',
                esPublico: true
            },
            {
                entrada: '5 8 7',
                salidaEsperada: '6.67',
                esPublico: false
            }
        ]
    },
    {
        id: 'workana-comision',
        empresa: 'Workana',
        titulo: 'Pago Neto Freelance',
        notaPractica: 'Material de práctica inspirado en Workana (no oficial)',
        descripcion:
            'Dados el monto total acordado para un proyecto y el porcentaje de comisión de la plataforma separados por un espacio, calcula e imprime el monto neto final que recibe el freelancer luego de descontar la comisión.',
        formatoEntrada:
            'Dos números separados por espacio: <montoProyecto> <porcentajeComision>.',
        formatoSalida:
            'Un número que indica el pago neto que recibe el freelancer.',
        ejemplo: {
            entrada: '1000 10',
            salida: '900'
        },
        codigoInicial: `import * as fs from "fs";

const input = fs.readFileSync(0, "utf8").trim();
const [monto, comision] = input.split(/\\s+/).map(Number);

// Escribe tu solución en TypeScript aquí y muestra el resultado con console.log()
`,
        casosPrueba: [
            {
                entrada: '1000 10',
                salidaEsperada: '900',
                esPublico: true
            },
            {
                entrada: '250 20',
                salidaEsperada: '200',
                esPublico: false
            }
        ]
    }
];

export async function ejecutarSeedRetos() {
    const batch = db.batch();

    for (const reto of RETOS_SEMILLA) {
        const docRef = db.collection('retos').doc(reto.id);
        batch.set(
            docRef,
            {
                empresa: reto.empresa,
                titulo: reto.titulo,
                notaPractica: reto.notaPractica,
                descripcion: reto.descripcion,
                formatoEntrada: reto.formatoEntrada,
                formatoSalida: reto.formatoSalida,
                ejemplo: reto.ejemplo,
                codigoInicial: reto.codigoInicial,
                casosPrueba: reto.casosPrueba,
                updatedAt: new Date().toISOString()
            },
            { merge: true }
        );
    }

    await batch.commit();
    console.log('Seed completado: 3 retos cargados en la colección "retos" de Firestore.');
}

if (require.main === module) {
    ejecutarSeedRetos()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error('Error al ejecutar seed:', err);
            process.exit(1);
        });
}