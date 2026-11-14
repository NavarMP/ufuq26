import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Strict system prompt enforcing zero hallucination
    const systemPrompt = `You are the official UFUQ '26 Event Assistant for a week-long transition and leadership camp organized by Alathurpadi Dars Students Association (ADSA) for students from SUFFA Dars moving on to higher studies this year.
Camp Tagline: "Rooted in Ilm. Ready for the World."
Dates: December 24–30, 2026.
Venue: Alathurpadi Dars Campus, Malappuram, Kerala, India.
Website: https://alathurpadidars.in/

CRITICAL RULES:
1. Answer ONLY using the confirmed event details provided in the context below.
2. DO NOT invent or fabricate guest names, session topics, phone numbers, registration rules, or organizational claims.
3. If the user asks about something not confirmed in the event data, state politely: "I do not have confirmed information on that yet. Please check the official announcement channels or contact the ADSA organizing committee directly."
4. Keep answers concise, respectful, and helpful.

CURRENT EVENT CONTEXT:
${JSON.stringify(context, null, 2)}`;

    // If Gemini API Key is available on server, call Gemini API securely
    if (apiKey) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: systemPrompt },
                  { text: `User question: ${message}` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 300,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return NextResponse.json({ reply });
        }
      }
    }

    // Graceful fallback: intelligent local rule-based answer grounded strictly in verified event facts
    const q = message.toLowerCase();

    if (q.includes('date') || q.includes('when') || q.includes('time') || q.includes('start')) {
      return NextResponse.json({
        reply: "UFUQ ’26 will take place from December 24 to December 30, 2026 (7 days). Sessions begin each morning at the Alathurpadi Dars Campus.",
      });
    }

    if (q.includes('where') || q.includes('venue') || q.includes('location') || q.includes('place') || q.includes('map')) {
      return NextResponse.json({
        reply: "The camp venue is Alathurpadi Dars Campus & Conference Hall, located in Alathurpadi, Malappuram District, Kerala 676503, India. Google Maps link: https://maps.app.goo.gl/c8PnXU7Jufx1KgoH6",
      });
    }

    if (q.includes('who') || q.includes('eligible') || q.includes('eligibility') || q.includes('attend') || q.includes('suffa')) {
      return NextResponse.json({
        reply: "UFUQ ’26 is specifically organized for students from SUFFA (Scholars Union For Fundamental Activities) Dars at Alathurpadi who are moving on to higher studies this year.",
      });
    }

    if (q.includes('register') || q.includes('apply') || q.includes('cost') || q.includes('fee') || q.includes('deadline')) {
      return NextResponse.json({
        reply: "You can register directly on this website under the 'Register' section. Registration is handled by ADSA. Upon submission, you will receive an immediate reference ID.",
      });
    }

    if (q.includes('organizer') || q.includes('adsa') || q.includes('conducted by')) {
      return NextResponse.json({
        reply: "The camp is organized by Alathurpadi Dars Students Association (ADSA), the student and alumni organization of Alathurpadi Dars.",
      });
    }

    if (q.includes('tagline') || q.includes('theme') || q.includes('motto')) {
      return NextResponse.json({
        reply: "The official tagline of UFUQ ’26 is: 'Rooted in Ilm. Ready for the World.' (متجذرون في العلم. مستعدون للعالم.)",
      });
    }

    if (q.includes('speaker') || q.includes('guest') || q.includes('faculty')) {
      return NextResponse.json({
        reply: "Confirmed faculty, guest scholars, and visiting dignitaries are being progressively finalized by ADSA. The spiritual patron of the camp is the respected Usthad of Alathurpadi Dars.",
      });
    }

    return NextResponse.json({
      reply: "I answer questions strictly based on confirmed UFUQ ’26 event records. For queries beyond published details, please reach out directly to the ADSA organizing team via the Contact section or visit https://alathurpadidars.in/.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
