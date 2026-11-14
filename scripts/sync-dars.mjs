// scripts/sync-dars.mjs
// Dynamically parses suffa_dars.md and seeds/syncs the Dars directory to Cloud Firestore

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Read suffa_dars.md
const mdPath = path.join(rootDir, 'suffa_dars.md');
if (!fs.existsSync(mdPath)) {
  console.error(`File not found: ${mdPath}`);
  process.exit(1);
}

const mdContent = fs.readFileSync(mdPath, 'utf8');

// 2. Parse Markdown Table
// Table format: | Sl. No. | Reg. No. | Dars Name (English) | Dars Name (Malayalam) | Mudarris | Phone Number |
const lines = mdContent.split('\n');
const darsEntries = [];

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|')) continue;
  if (trimmed.includes('Sl. No.') || trimmed.includes('---')) continue;

  const cols = trimmed
    .split('|')
    .map((c) => c.trim())
    .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

  if (cols.length >= 6) {
    const slNo = parseInt(cols[0], 10) || darsEntries.length + 1;
    const regNo = cols[1];
    const nameEn = cols[2];
    const nameMl = cols[3];
    const mudarris = cols[4];
    const phone = cols[5];

    if (regNo && nameEn) {
      darsEntries.push({
        id: regNo,
        regNo,
        slNo,
        nameEn,
        nameMl,
        mudarris,
        phone,
        updatedAt: new Date().toISOString(),
      });
    }
  }
}

console.log(`Parsed ${darsEntries.length} Dars entries from suffa_dars.md`);

// 3. Initialize Firebase Client
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDm6MoYqynJKskgnyBf_JVXivI4MajILZ0',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'ufuq26-adsa.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'ufuq26-adsa',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'ufuq26-adsa.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '788772576685',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:788772576685:web:72fbcfc102a59a352b1524',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. Batch sync to Firestore
async function syncToFirestore() {
  try {
    console.log('Syncing entries to Firestore collection: "dars"...');
    const batch = writeBatch(db);

    for (const dars of darsEntries) {
      const docRef = doc(db, 'dars', dars.id);
      batch.set(docRef, dars, { merge: true });
    }

    await batch.commit();
    console.log(`Successfully synced ${darsEntries.length} Dars records to Firestore!`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to sync to Firestore:', err);
    process.exit(1);
  }
}

syncToFirestore();
