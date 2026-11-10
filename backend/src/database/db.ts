//src/database/db.ts
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

// Si usas Render, crea una variable de entorno FIREBASE_CREDENTIALS 
// y pega ahí el contenido del JSON de Firebase.
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS || '{}');

initializeApp({
  credential: cert(serviceAccount as any)
});

export const db = getFirestore();
console.log('Conectado exitosamente a Firebase Firestore');