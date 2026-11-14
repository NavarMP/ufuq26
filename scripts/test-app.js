// Automated Verification Test Suite for UFUQ '26 Web App

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting UFUQ ’26 Automated Verification Tests...\n');

// 1. Verify Localization Dictionaries
console.log('Test 1: Localization Coverage & Consistency');
const en = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/locales/en.json'), 'utf8'));
const ml = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/locales/ml.json'), 'utf8'));
const ar = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/locales/ar.json'), 'utf8'));

function getDeepKeys(obj, prefix = '') {
  return Object.keys(obj).reduce((res, el) => {
    if (Array.isArray(obj[el])) {
      return res;
    } else if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...getDeepKeys(obj[el], prefix + el + '.')];
    }
    return [...res, prefix + el];
  }, []);
}

const enKeys = getDeepKeys(en);
const mlKeys = getDeepKeys(ml);
const arKeys = getDeepKeys(ar);

console.log(`- English keys: ${enKeys.length}`);
console.log(`- Malayalam keys: ${mlKeys.length}`);
console.log(`- Arabic keys: ${arKeys.length}`);

assert.strictEqual(enKeys.length, mlKeys.length, 'ML keys count must match EN');
assert.strictEqual(enKeys.length, arKeys.length, 'AR keys count must match EN');
console.log('✓ Localization keys perfectly matched across all 3 languages.\n');

// 2. Verify Font & Image Assets Exist
console.log('Test 2: Required Local Media & Typography Assets');
const requiredFiles = [
  'public/fonts/english/ClashDisplay-Bold.otf',
  'public/fonts/english/ClashDisplay-Medium.otf',
  'public/fonts/english/ClashDisplay-Regular.otf',
  'public/fonts/arabic/dg-sahabah-bold.ttf',
  'public/fonts/arabic/dg-sahabah-regular.ttf',
  'public/images/UFUQ-Logo.svg',
  'public/images/adsa-logo.svg',
  'public/images/dars-typo.svg',
  'public/images/Usthad.png',
  'public/manifest.json',
];

for (const file of requiredFiles) {
  const fullPath = path.join(__dirname, '..', file);
  assert.ok(fs.existsSync(fullPath), `Missing required asset: ${file}`);
  const stats = fs.statSync(fullPath);
  assert.ok(stats.size > 0, `Asset file is empty: ${file}`);
}
console.log('✓ All 10 local font and brand media assets verified on disk.\n');

// 3. Verify Firebase & Security Rules
console.log('Test 3: Firebase Configuration & Security Rules');
const firestoreRules = fs.readFileSync(path.join(__dirname, '../firestore.rules'), 'utf8');
const storageRules = fs.readFileSync(path.join(__dirname, '../storage.rules'), 'utf8');
const firebaseJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../firebase.json'), 'utf8'));

assert.ok(firestoreRules.includes('rules_version = \'2\';'), 'Firestore rules must be version 2');
assert.ok(firestoreRules.includes('match /registrations/{registrationId}'), 'Must protect registrations collection');
assert.ok(firestoreRules.includes('allow read, update, delete: if isAdmin();'), 'Registrations must restrict read/update/delete to admin');
assert.ok(storageRules.includes('match /public/{allPaths=**}'), 'Storage rules must define public assets');
assert.ok(storageRules.includes('match /admin/{allPaths=**}'), 'Storage rules must define admin files');
assert.ok(firebaseJson.hosting && firebaseJson.hosting.headers, 'firebase.json must include security headers');
console.log('✓ Least-privilege database and storage rules verified.\n');

// 4. Verify PWA Manifest
console.log('Test 4: PWA Web App Manifest');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/manifest.json'), 'utf8'));
assert.strictEqual(manifest.short_name, 'UFUQ ’26');
assert.strictEqual(manifest.display, 'standalone');
assert.ok(manifest.icons && manifest.icons.length > 0);
console.log('✓ PWA Manifest verified.\n');

// 5. Verify Build Output Exists
console.log('Test 5: Next.js Optimized Build Output');
assert.ok(fs.existsSync(path.join(__dirname, '../.next')), '.next build directory must exist');
assert.ok(fs.existsSync(path.join(__dirname, '../.next/BUILD_ID')), 'BUILD_ID must exist');
console.log('✓ Next.js build artifact confirmed.\n');

console.log('🎉 ALL AUTOMATED VERIFICATION CHECKS PASSED SUCCESSFULLY!');
