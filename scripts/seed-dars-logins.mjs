// scripts/seed-dars-logins.mjs
// Seeds the 39 SUFFA Dars login accounts with auto-generated passwords (format: sdc0101@ufuq)
// Writes to Cloud Firestore collection "dars_accounts" and generates offline fallback file

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';

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

// Phone normalization helper
function normalizePhone(p) {
  if (!p) return '';
  const digits = p.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits.length > 10 ? digits.slice(-10) : digits;
}

// Password generator helper: format sdc0101@ufuq
function generatePassword(regNo) {
  const cleanReg = (regNo || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${cleanReg}01@ufuq`;
}

// 2. Parse Markdown Table
const lines = mdContent.split('\n');
const darsAccounts = [];

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|')) continue;
  if (trimmed.includes('Sl. No.') || trimmed.includes('---')) continue;

  const cols = trimmed
    .split('|')
    .map((c) => c.trim())
    .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

  if (cols.length >= 6) {
    const slNo = parseInt(cols[0], 10) || darsAccounts.length + 1;
    const regNo = cols[1];
    const nameEn = cols[2];
    const nameMl = cols[3];
    const mudarris = cols[4];
    const rawPhone = cols[5];

    if (regNo && nameEn) {
      const cleanPhone = normalizePhone(rawPhone);
      const password = generatePassword(regNo);

      darsAccounts.push({
        id: regNo,
        darsId: regNo,
        regNo,
        slNo,
        darsNameEn: nameEn,
        darsNameMl: nameMl,
        mudarris,
        phone: cleanPhone,
        displayPhone: rawPhone,
        password,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }
}

console.log(`Parsed ${darsAccounts.length} SUFFA Dars entries.`);

// 3. Export offline fallback TypeScript file for instant client availability
const tsFilePath = path.join(rootDir, 'src', 'lib', 'initialDarsAccounts.ts');
const tsContent = `// Auto-generated initial Dars Accounts for UFUQ '26
// Format: sdc0101@ufuq
import { DarsAccount } from '@/types';

export const initialDarsAccounts: DarsAccount[] = ${JSON.stringify(darsAccounts, null, 2)};
`;

fs.writeFileSync(tsFilePath, tsContent, 'utf8');
console.log(`Wrote fallback data to ${tsFilePath}`);

// 4. Initialize Firebase Client & write to Firestore
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

async function syncToFirestore() {
  try {
    console.log('Attempting to sync accounts to Firestore collection: "dars_accounts"...');
    const batch = writeBatch(db);

    for (const acc of darsAccounts) {
      const docRef = doc(db, 'dars_accounts', acc.id);
      batch.set(docRef, acc, { merge: true });
    }

    // Set 5s timeout on commit so node script terminates cleanly if offline
    await Promise.race([
      batch.commit(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore write timeout or offline')), 5000))
    ]);
    console.log(`Successfully seeded ${darsAccounts.length} Dars login accounts to Firestore!`);
    process.exit(0);
  } catch (err) {
    console.warn('Note:', err.message);
    console.log(`Local fallback dataset with ${darsAccounts.length} accounts was generated and will be used by the app.`);
    process.exit(0);
  }
}

syncToFirestore();
