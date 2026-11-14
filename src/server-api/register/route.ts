import { NextRequest, NextResponse } from 'next/server';
import { generateRegistrationCode } from '@/lib/regCodeGenerator';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, phone, email, darsId, darsName, darsRegNo, darsMudarris, category } = body;

    if (!fullName || !phone || !(darsId || darsName)) {
      return NextResponse.json(
        { error: 'Full name, phone number, and SUFFA Dars institution are required.' },
        { status: 400 }
      );
    }

    // Email format validation if email is provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const regId = `REG-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const { regCode, checkDigit } = generateRegistrationCode({
      category: category || 'scholar',
      darsRegNo,
      seedString: `${fullName}-${phone}`,
    });

    return NextResponse.json({
      success: true,
      id: regId,
      regCode,
      checkDigit,
      message: 'Registration received successfully.',
      data: {
        id: regId,
        regCode,
        checkDigit,
        fullName,
        phone,
        email: email || null,
        darsId,
        darsName,
        darsRegNo,
        darsMudarris,
        gateStatus: 'outside',
        submittedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
