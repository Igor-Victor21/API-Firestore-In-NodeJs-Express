import 'dotenv/config';
import admin from 'firebase-admin';

if (!process.env.FIREBASE_CONFIG) {
  throw new Error("Variável FIREBASE_CONFIG não definida");
}

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default db;
