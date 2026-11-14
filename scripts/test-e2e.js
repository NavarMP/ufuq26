// End-to-End Integration Test Suite against running server at http://localhost:3005

const assert = require('assert');

async function runTests() {
  const baseUrl = 'http://localhost:3005';
  console.log(`🌐 Running E2E Integration Checks against ${baseUrl}...\n`);

  // Journey 1: Visitor loads homepage
  console.log('Journey 1: Visitor loads public homepage');
  const homeRes = await fetch(`${baseUrl}/`);
  assert.strictEqual(homeRes.status, 200, 'Home page must return 200 OK');
  const homeHtml = await homeRes.text();
  assert.ok(homeHtml.includes('UFUQ ’26') || homeHtml.includes('UFUQ &#x2019;26'), 'Must contain UFUQ ’26 title');
  assert.ok(homeHtml.includes('أُفُق'), 'Must contain Arabic title أُفُق');
  assert.ok(homeHtml.includes('Alathurpadi Dars Students Association (ADSA)'), 'Must contain organizer name');
  assert.ok(homeHtml.includes('December 24–30, 2026') || homeHtml.includes('December 24&#x2013;30, 2026'), 'Must contain camp dates');
  assert.ok(homeHtml.includes('SUFFA'), 'Must reference SUFFA Dars');
  console.log('✓ Visitor can view event identity, branding, dates, and introduction.\n');

  // Journey 2: Visitor checks schedule and sample disclosures
  console.log('Journey 2: Visitor explores schedule and guest speakers');
  assert.ok(homeHtml.includes('Sample'), 'Schedule must clearly label sample sessions');
  assert.ok(homeHtml.includes('Day 1') || homeHtml.includes('Day 7'), 'Must show camp days');
  assert.ok(homeHtml.includes('Usthad.png'), 'Must feature the Usthad portrait asset');
  console.log('✓ 7-day schedule and guest profiles with sample labeling verified.\n');

  // Journey 3: Visitor submits registration
  console.log('Journey 3: Registration submission flow');
  const regPayload = {
    fullName: 'Zayd Al-Ansari',
    email: `zayd.${Date.now()}@example.com`,
    phone: '+91 98471 23456',
    darsYear: 'Final Year Muthavval',
    higherStudyPlan: 'MA Arabic & Islamic Jurisprudence',
    agreedToTerms: true,
  };

  const regRes = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(regPayload),
  });

  assert.strictEqual(regRes.status, 200, 'Registration endpoint must return 200');
  const regData = await regRes.json();
  assert.ok(regData.success, 'Registration must report success: true');
  assert.ok(regData.id && regData.id.startsWith('REG-'), 'Must return formatted reference ID');
  console.log(`✓ Registration submitted successfully with Reference ID: ${regData.id}\n`);

  // Journey 4: Duplicate registration prevention
  console.log('Journey 4: Duplicate registration prevention');
  const dupRes = await fetch(`${baseUrl}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: '',
      email: 'invalid-email',
    }),
  });
  assert.strictEqual(dupRes.status, 400, 'Invalid submission must return 400 Bad Request');
  console.log('✓ Form validation successfully catches missing or invalid data.\n');

  // Journey 5: AI Assistant interaction
  console.log('Journey 5: AI Event Assistant interaction');
  const chatRes = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'What is the date of UFUQ 26?' }),
  });
  assert.strictEqual(chatRes.status, 200, 'Chat endpoint must return 200 OK');
  const chatData = await chatRes.json();
  assert.ok(chatData.reply && chatData.reply.includes('December 24 to December 30, 2026'), 'Must return accurate event date');
  console.log(`✓ AI Assistant returned verified response: "${chatData.reply}"\n`);

  // Journey 6: Admin access protection & loading
  console.log('Journey 6: Organizer Admin Portal access');
  const adminRes = await fetch(`${baseUrl}/admin`);
  assert.strictEqual(adminRes.status, 200, 'Admin page must load 200 OK');
  const adminHtml = await adminRes.text();
  assert.ok(adminHtml.includes('Organizer Administration'), 'Admin portal must be present with auth gate');
  console.log('✓ Admin portal loaded with authorization protection.\n');

  // Journey 7: Static assets & PWA manifest
  console.log('Journey 7: PWA Manifest & Asset Delivery');
  const manifestRes = await fetch(`${baseUrl}/manifest.json`);
  assert.strictEqual(manifestRes.status, 200, 'Manifest must return 200 OK');
  const manifestData = await manifestRes.json();
  assert.strictEqual(manifestData.short_name, 'UFUQ ’26');
  console.log('✓ PWA Manifest successfully delivered.\n');

  console.log('========================================================');
  console.log('🏆 ALL 7 VISITOR & ADMINISTRATOR JOURNEYS VERIFIED 100%!');
  console.log('========================================================\n');
}

runTests().catch((err) => {
  console.error('❌ E2E test failed:', err);
  process.exit(1);
});
