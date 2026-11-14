import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, darsYear, agreedToTerms } = body;

    if (!fullName || !email || !phone || !darsYear) {
      return NextResponse.json(
        { error: 'Full name, email, phone, and Dars year are required.' },
        { status: 400 }
      );
    }

    if (!agreedToTerms) {
      return NextResponse.json(
        { error: 'You must agree to the camp guidelines and terms.' },
        { status: 400 }
      );
    }

    const regId = `REG-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    return NextResponse.json({
      success: true,
      id: regId,
      message: 'Registration received successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
