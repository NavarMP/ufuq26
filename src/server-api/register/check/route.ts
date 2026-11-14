import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = (body.query || '').trim();

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required.' },
        { status: 400 }
      );
    }

    const cleanDigits = query.replace(/\D/g, '');
    const lowerQuery = query.toLowerCase();

    // Try checking Firestore via Admin SDK if configured
    try {
      const { adminDb } = await import('@/lib/firebase-admin');
      if (adminDb) {
        // 1. Check by Document ID
        const docSnap = await adminDb.collection('registrations').doc(query.toUpperCase()).get();
        if (docSnap.exists) {
          return NextResponse.json({
            found: true,
            registration: { id: docSnap.id, ...(docSnap.data() as any) },
          });
        }

        // 1b. Check by Systematic Reg Code (e.g. UF26-SCH-SDC01-0042)
        const codeSnap = await adminDb
          .collection('registrations')
          .where('regCode', '==', query.toUpperCase())
          .limit(1)
          .get();
        if (!codeSnap.empty) {
          const first = codeSnap.docs[0];
          return NextResponse.json({
            found: true,
            registration: { id: first.id, ...(first.data() as any) },
          });
        }

        // 2. Query by Phone
        if (cleanDigits.length >= 8) {
          const phoneSnap = await adminDb
            .collection('registrations')
            .where('phone', '>=', cleanDigits.slice(-10))
            .limit(5)
            .get();

          if (!phoneSnap.empty) {
            for (const doc of phoneSnap.docs) {
              const data = doc.data();
              const dDigits = (data.phone || '').replace(/\D/g, '');
              if (dDigits.slice(-10) === cleanDigits.slice(-10)) {
                return NextResponse.json({
                  found: true,
                  registration: { id: doc.id, ...(data as any) },
                });
              }
            }
          }
        }

        // 3. Query by Email
        if (lowerQuery.includes('@')) {
          const emailSnap = await adminDb
            .collection('registrations')
            .where('email', '==', lowerQuery)
            .limit(1)
            .get();

          if (!emailSnap.empty) {
            const first = emailSnap.docs[0];
            return NextResponse.json({
              found: true,
              registration: { id: first.id, ...(first.data() as any) },
            });
          }
        }
      }
    } catch (adminErr) {
      // Firebase admin not configured or offline - client will use local storage cache
    }

    return NextResponse.json({
      found: false,
      message: 'No registration found.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
