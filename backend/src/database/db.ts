// src/database/db.ts
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

function obtenerCredencialesFirebase(): ServiceAccount {
  // 1. Si existe la variable FIREBASE_CREDENTIALS en .env o en Render, la usamos
  if (process.env.FIREBASE_CREDENTIALS && process.env.FIREBASE_CREDENTIALS.trim() !== '') {
    try {
      return JSON.parse(process.env.FIREBASE_CREDENTIALS);
    } catch (error) {
      console.error('Error al parsear FIREBASE_CREDENTIALS desde .env');
    }
  }

  // 2. Si estamos en local y no hay .env, buscamos automáticamente el archivo .json en la raíz
  const raizProyecto = process.cwd();
  const archivosEnRaiz = fs.readdirSync(raizProyecto);
  const archivoJsonFirebase = archivosEnRaiz.find(
    (file) =>
      file === 'firebase-key.json' ||
      (file.includes('firebase-adminsdk') && file.endsWith('.json'))
  );

  if (archivoJsonFirebase) {
    const rutaCompleta = path.join(raizProyecto, archivoJsonFirebase);
    const contenido = fs.readFileSync(rutaCompleta, 'utf8');
    console.log(`Usando credenciales locales desde: ${archivoJsonFirebase}`);
    return JSON.parse(contenido);
  }

  throw new Error(
    'No se encontró FIREBASE_CREDENTIALS en .env ni un archivo *firebase-adminsdk*.json o firebase-key.json en la raíz del proyecto.'
  );
}

const serviceAccount = obtenerCredencialesFirebase();

initializeApp({
  credential: cert(serviceAccount)
});

export const db = getFirestore();
console.log('Conectado exitosamente a Firebase Firestore (Proyecto a79)');