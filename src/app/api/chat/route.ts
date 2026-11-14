import { NextRequest, NextResponse } from 'next/server';
import { initialEventInfo, initialScheduleSessions, initialGuests, initialFAQs } from '@/lib/initialData';

export async function POST(req: NextRequest) {
  try {
    const { message, context, language } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Structured event context combining baseline data and client state
    const eventContext = {
      event: {
        title: initialEventInfo.titleEnglish,
        titleArabic: initialEventInfo.titleArabic,
        tagline: initialEventInfo.tagline,
        dates: `${initialEventInfo.startDate} to ${initialEventInfo.endDate} (7 Days)`,
        venue: initialEventInfo.venue,
        organizer: initialEventInfo.organizer,
        registrationDeadline: initialEventInfo.registrationDeadline,
        maxParticipants: initialEventInfo.maxParticipants,
        website: 'https://alathurpadidars.in/',
      },
      schedule: initialScheduleSessions.map((s) => ({
        day: s.day,
        date: s.date,
        time: `${s.startTime} - ${s.endTime}`,
        title: s.title,
        category: s.category,
        description: s.description,
      })),
      guests: initialGuests.map((g) => ({
        name: g.name,
        title: g.title,
        bio: g.bio,
      })),
      faqs: initialFAQs.map((f) => ({
        question: f.question,
        answer: f.answer,
      })),
      clientContext: context || null,
      preferredLanguage: language || 'en',
    };

    const systemPrompt = `You are the official UFUQ '26 AI Event Assistant for the week-long transition and leadership camp organized by Alathurpadi Dars Students Association (ADSA) for students from SUFFA (Scholars Union For Fundamental Activities) Dars at Alathurpadi moving on to higher studies.
Camp Tagline: "Rooted in Ilm. Ready for the World." (ഇൽമിൽ വേരൂന്നിയത്. ലോകത്തിനായി തയ്യാർ. / متجذرون في العلم. مستعدون للعالم.)
Dates: December 24–30, 2026.
Venue: Alathurpadi Dars Campus & Conference Hall, Alathurpadi, Malappuram District, Kerala 676503, India.
Website: https://alathurpadidars.in/

CRITICAL INSTRUCTIONS:
1. Ground your answers strictly in the confirmed event context provided below.
2. Multilingual: Reply in the same language as the user's question (Malayalam, English, or Arabic). If the user writes in Malayalam, reply in natural, respectful Malayalam. If in Arabic, reply in clear Arabic. If in English, reply in clear English.
3. Zero Hallucination: Do NOT invent or assume unconfirmed speakers, faculty, schedules, or policies.
4. If a query is outside the confirmed information, politely state that it hasn't been officially announced yet and invite them to check the official ADSA website or contact the organizers.
5. Keep answers concise, warm, helpful, and courteous.

EVENT DETAILS & SCHEDULE CONTEXT:
${JSON.stringify(eventContext, null, 2)}`;

    // Try Gemini API if key is available
    if (apiKey) {
      // Modern models in order of preference
      const models = ['gemini-3.5-flash-lite', 'gemini-3.5-flash'];

      for (const model of models) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: {
                  parts: [{ text: systemPrompt }],
                },
                contents: [
                  {
                    role: 'user',
                    parts: [{ text: message }],
                  },
                ],
                generationConfig: {
                  temperature: 0.2,
                  maxOutputTokens: 400,
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
          } else {
            const errData = await response.text();
            console.warn(`Gemini API error with model ${model}:`, response.status, errData);
          }
        } catch (fetchErr) {
          console.warn(`Gemini fetch error with model ${model}:`, fetchErr);
        }
      }
    }

    // Graceful fallback: intelligent local rule-based answer grounded strictly in verified event facts
    const q = message.toLowerCase();

    if (q.includes('date') || q.includes('when') || q.includes('time') || q.includes('start') || q.includes('എപ്പോൾ') || q.includes('തിയ്യതി') || q.includes('متى')) {
      return NextResponse.json({
        reply: "UFUQ ’26 will take place from December 24 to December 30, 2026 (7 days). Sessions begin each morning at the Alathurpadi Dars Campus.",
      });
    }

    if (q.includes('where') || q.includes('venue') || q.includes('location') || q.includes('place') || q.includes('map') || q.includes('എവിടെ') || q.includes('സ്ഥലം') || q.includes('أين')) {
      return NextResponse.json({
        reply: "The camp venue is Alathurpadi Dars Campus & Conference Hall, located in Alathurpadi, Malappuram District, Kerala 676503, India. Google Maps link: https://maps.app.goo.gl/c8PnXU7Jufx1KgoH6",
      });
    }

    if (q.includes('who') || q.includes('eligible') || q.includes('eligibility') || q.includes('attend') || q.includes('suffa') || q.includes('ആർക്ക്') || q.includes('യോഗ്യത') || q.includes('من يحق')) {
      return NextResponse.json({
        reply: "UFUQ ’26 is specifically organized for students from SUFFA (Scholars Union For Fundamental Activities) Dars at Alathurpadi who are moving on to higher studies this year.",
      });
    }

    if (q.includes('register') || q.includes('apply') || q.includes('cost') || q.includes('fee') || q.includes('deadline') || q.includes('രജിസ്റ്റർ') || q.includes('ഫീസ്') || q.includes('تسجيل')) {
      return NextResponse.json({
        reply: "You can register directly on this website under the 'Register' section. Registration is handled by ADSA. Registration deadline is December 10, 2026. Upon submission, you will receive an immediate reference ID.",
      });
    }

    if (q.includes('organizer') || q.includes('adsa') || q.includes('conducted by') || q.includes('സംഘാടകർ') || q.includes('المنظم')) {
      return NextResponse.json({
        reply: "The camp is organized by Alathurpadi Dars Students Association (ADSA), the student and alumni organization of Alathurpadi Dars.",
      });
    }

    if (q.includes('tagline') || q.includes('theme') || q.includes('motto') || q.includes('തീം')) {
      return NextResponse.json({
        reply: "The official tagline of UFUQ ’26 is: 'Rooted in Ilm. Ready for the World.' (متجذرون في العلم. مستعدون للعالم. / ഇൽമിൽ വേരൂന്നിയത്. ലോകത്തിനായി തയ്യാർ.)",
      });
    }

    if (q.includes('speaker') || q.includes('guest') || q.includes('faculty') || q.includes('അതിഥി') || q.includes('സ്പീക്കർ') || q.includes('ضيوف')) {
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
