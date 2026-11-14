import { EventInfo, ScheduleSession, FAQ, Guest } from '@/types';

export function getFallbackAssistantReply(
  message: string,
  language: string,
  eventInfo: EventInfo,
  schedule: ScheduleSession[] = [],
  faqs: FAQ[] = [],
  guests: Guest[] = []
): string {
  const q = message.toLowerCase().trim();
  const lang = language === 'ml' ? 'ml' : language === 'ar' ? 'ar' : 'en';

  // Check matching FAQ items
  for (const faq of faqs) {
    const questionText = (faq.question?.[lang] || faq.question?.en || '').toLowerCase();
    const answerText = faq.answer?.[lang] || faq.answer?.en || '';
    const words = q.split(/\s+/).filter((w) => w.length > 3);
    const matches = words.filter((w) => questionText.includes(w));
    if (matches.length >= 2 || (words.length === 1 && questionText.includes(words[0]))) {
      return answerText;
    }
  }

  // Dates / Timing
  if (
    q.includes('date') ||
    q.includes('when') ||
    q.includes('time') ||
    q.includes('start') ||
    q.includes('end') ||
    q.includes('day') ||
    q.includes('എപ്പോൾ') ||
    q.includes('തിയ്യതി') ||
    q.includes('തീയതി') ||
    q.includes('ദിവസം') ||
    q.includes('متى') ||
    q.includes('تاريخ') ||
    q.includes('موعد')
  ) {
    if (lang === 'ml') {
      return `യുവ നേതൃത്വ ക്യാമ്പ് UFUQ ’26 ${eventInfo.startDate} മുതൽ ${eventInfo.endDate} വരെ (7 ദിവസങ്ങൾ) ആലത്തുർപടി ദർസ് ക്യാമ്പസിൽ വെച്ച് നടക്കും.`;
    }
    if (lang === 'ar') {
      return `سيعقد مخيم UFUQ ’26 من ${eventInfo.startDate} إلى ${eventInfo.endDate} (لمدة 7 أيام) في حرم درس الآثوربادي.`;
    }
    return `UFUQ ’26 will take place from ${eventInfo.startDate} to ${eventInfo.endDate} (7 days). Daily sessions begin each morning at the Alathurpadi Dars Campus.`;
  }

  // Venue / Location
  if (
    q.includes('where') ||
    q.includes('venue') ||
    q.includes('location') ||
    q.includes('place') ||
    q.includes('address') ||
    q.includes('map') ||
    q.includes('reach') ||
    q.includes('എവിടെ') ||
    q.includes('സ്ഥലം') ||
    q.includes('വേദി') ||
    q.includes('റൂട്ട്') ||
    q.includes('أين') ||
    q.includes('مكان') ||
    q.includes('موقع')
  ) {
    if (lang === 'ml') {
      return `ക്യാമ്പ് വേദി: ${eventInfo.venue}. മലപ്പുറം ജില്ലയിലെ മേൽമുറി, ആലത്തുർപടിയിലാണ് കാമ്പസ് സ്ഥിതി ചെയ്യുന്നത്. ഗൂഗിൾ മാപ്‌സ് ലൊക്കേഷൻ സൈറ്റിലെ 'ലൊക്കേഷൻ' വിഭാഗത്തിൽ ലഭ്യമാണ്.`;
    }
    if (lang === 'ar') {
      return `مكان المخيم: ${eventInfo.venue}. يقع الحرم في منطقة ملابورم، كيرلا، الهند.`;
    }
    return `The camp venue is ${eventInfo.venue}. For directions and map, check the Location section on this page.`;
  }

  // Eligibility / Target Audience
  if (
    q.includes('who') ||
    q.includes('eligible') ||
    q.includes('eligibility') ||
    q.includes('attend') ||
    q.includes('join') ||
    q.includes('suffa') ||
    q.includes('student') ||
    q.includes('പങ്കെടുക്കാം') ||
    q.includes('ആർക്ക്') ||
    q.includes('യോഗ്യത') ||
    q.includes('സുഫ') ||
    q.includes('വിദ്യാർത്ഥി') ||
    q.includes('من يحق') ||
    q.includes('مؤهل') ||
    q.includes('من هم') ||
    q.includes('صفة')
  ) {
    if (lang === 'ml') {
      return `ആലത്തുർപടി സുഫ (SUFFA) ദർസിൽ നിന്ന് ഈ വർഷം ഉപരിപഠനത്തിലേക്ക് കടക്കുന്ന വിദ്യാർത്ഥികൾക്കാണ് UFUQ ’26 സംഘടിപ്പിക്കുന്നത്. അടിസ്ഥാന ഇസ്ലാമിക വിജ്ഞാനവും ആധുനിക അക്കാദമിക് കാഴ്ചപ്പാടും സമന്വയിപ്പിക്കാൻ ഈ ക്യാമ്പ് അവരെ സഹായിക്കുന്നു.`;
    }
    if (lang === 'ar') {
      return `مخيم UFUQ ’26 مخصص تحديداً لطلاب درس الصفة (SUFFA) في الآثوربادي المنتقلين إلى الدراسات العليا والجامعية في هذا العام.`;
    }
    return `UFUQ ’26 is specifically organized for students from SUFFA (Scholars Union For Fundamental Activities) Dars at Alathurpadi who are transitioning to university and higher studies this year.`;
  }

  // Registration & Deadline
  if (
    q.includes('register') ||
    q.includes('apply') ||
    q.includes('cost') ||
    q.includes('fee') ||
    q.includes('free') ||
    q.includes('deadline') ||
    q.includes('last date') ||
    q.includes('രജിസ്റ്റർ') ||
    q.includes('ഫീസ്') ||
    q.includes('അപേക്ഷ') ||
    q.includes('തീയ്യതി') ||
    q.includes('تسجيل') ||
    q.includes('رسوم') ||
    q.includes('مجاني') ||
    q.includes('آخر موعد')
  ) {
    if (lang === 'ml') {
      return `ഈ വെബ്‌സൈറ്റിലെ 'രജിസ്ട്രേഷൻ' ഫോം വഴി നേരിട്ട് രജിസ്റ്റർ ചെയ്യാം. രജിസ്ട്രേഷൻ അവസാന തീയതി: ${eventInfo.registrationDeadline || 'December 10, 2026'}. രജിസ്ട്രേഷൻ വിജയകരമായി സമർപ്പിച്ചാൽ ഉടനടി ഒരു റെഫറൻസ് ഐഡി ലഭിക്കുന്നതാണ്.`;
    }
    if (lang === 'ar') {
      return `يمكنك التسجيل مباشرة من قسم 'التسجيل' في الموقع. الموعد النهائي للتسجيل هو ${eventInfo.registrationDeadline || 'December 10, 2026'}. ستحصل على معرف مرجعي فوري عند إتمام التسجيل.`;
    }
    return `You can register directly in the 'Register' section on this website. The registration deadline is ${eventInfo.registrationDeadline || 'December 10, 2026'}. Upon submission, you will receive an immediate reference ID.`;
  }

  // Organizer / ADSA
  if (
    q.includes('organizer') ||
    q.includes('adsa') ||
    q.includes('conduct') ||
    q.includes('who runs') ||
    q.includes('സംഘാടകർ') ||
    q.includes('അഡ്സ') ||
    q.includes('ആരാണ്') ||
    q.includes('منظم') ||
    q.includes('جمعية')
  ) {
    if (lang === 'ml') {
      return `ആലത്തുർപടി ദർസിലെ വിദ്യാർത്ഥി സംഘടനയായ ADSA (Alathurpadi Dars Students Association) ആണ് ഈ ക്യാമ്പ് സംഘടിപ്പിക്കുന്നത്.`;
    }
    if (lang === 'ar') {
      return `ينظم المخيم جمعية طلاب درس الآثوربادي (ADSA)، الهيئة التمثيلية الرسمية لطلاب وخريجي درس الآثوربادي.`;
    }
    return `The camp is organized by Alathurpadi Dars Students Association (ADSA), the student and alumni organization of Alathurpadi Dars.`;
  }

  // Tagline / Theme
  if (
    q.includes('tagline') ||
    q.includes('theme') ||
    q.includes('motto') ||
    q.includes('മുദ്രാവാക്യം') ||
    q.includes('തീം') ||
    q.includes('شعار')
  ) {
    return `"Rooted in Ilm. Ready for the World." (ഇൽമിൽ വേരൂന്നിയത്. ലോകത്തിനായി തയ്യാർ. / متجذرون في العلم. مستعدون للعالم.)`;
  }

  // Guests / Speakers
  if (
    q.includes('speaker') ||
    q.includes('guest') ||
    q.includes('faculty') ||
    q.includes('teacher') ||
    q.includes('usthad') ||
    q.includes('അതിഥി') ||
    q.includes('സ്പീക്കർ') ||
    q.includes('ഉസ്താദ്') ||
    q.includes('ضيوف') ||
    q.includes('أساتذة') ||
    q.includes('علماء')
  ) {
    if (lang === 'ml') {
      return `ആലത്തുർപടി ദർസിലെ ആദരണീയനായ ഉസ്താദിന്റെ ആത്മീയ മേൽനോട്ടത്തിലാണ് ക്യാമ്പ് നടക്കുന്നത്. പ്രഗത്ഭരായ പണ്ഡിതന്മാരും കരിയർ വിദഗ്ദ്ധരും യൂണിവേഴ്സിറ്റി പ്രൊഫസർമാരും സെഷനുകൾക്ക് നേതൃത്വം നൽകും.`;
    }
    if (lang === 'ar') {
      return `يقام المخيم تحت الرعاية الروحية لأستاذ درس الآثوربادي الموقر، بمشاركة نخبة من الأساتذة والعلماء وخبراء التوجيه الأكاديمي.`;
    }
    return `The spiritual patron of the camp is the respected Usthad of Alathurpadi Dars. Academic and leadership sessions will be conducted by confirmed scholars, visiting university lecturers, and career mentors.`;
  }

  // Schedule / Sessions
  if (
    q.includes('schedule') ||
    q.includes('session') ||
    q.includes('program') ||
    q.includes('ഷെഡ്യൂൾ') ||
    q.includes('സെഷൻ') ||
    q.includes('പ്രോഗ്രാം') ||
    q.includes('جدول') ||
    q.includes('برنامج') ||
    q.includes('جلسات')
  ) {
    if (lang === 'ml') {
      return `ക്യാമ്പിൽ ആകെ 7 ദിവസങ്ങളിലായി അക്കാദമിക് ഓറിയന്റേഷൻ, വ്യക്തിത്വ വികസനം, ലീഡർഷിപ്പ് വർക്ക്ഷോപ്പുകൾ എന്നിവ ഉൾപ്പെടുത്തിയിട്ടുണ്ട്. വിശദമായ ടൈംടേബിൾ വെബ്‌സൈറ്റിലെ 'ഷെഡ്യൂൾ' വിഭാഗത്തിൽ കാണാം.`;
    }
    if (lang === 'ar') {
      return `يشتمل المخيم على 7 أيام من ورش العمل التوجيهية وتنمية الشخصية والقيادة. يمكنك الاطلاع على الجدول الزمني الكامل في قسم 'الجدول الزمني'.`;
    }
    return `The camp features a comprehensive 7-day curriculum covering higher education pathways, leadership development, and character building. Please check the 'Schedule' section for day-by-day details.`;
  }

  // General default response
  if (lang === 'ml') {
    return `ഔദ്യോഗിക UFUQ ’26 വിവരങ്ങളുടെ അടിസ്ഥാനത്തിലാണ് ഞാൻ മറുപടി നൽകുന്നത്. കൂടുതൽ വിശദാംശങ്ങൾക്കായി ദയവായി ADSA സംഘാടകരുമായി ബന്ധപ്പെടുക അല്ലെങ്കിൽ https://alathurpadidars.in സന്ദർശിക്കുക.`;
  }
  if (lang === 'ar') {
    return `أجيب على الاستفسارات بناءً على السجلات الرسمية المؤكدة لمخيم UFUQ ’26. للمزيد من التفاصيل، يرجى التواصل مع اللجنة المنظمة (ADSA) أو زيارة https://alathurpadidars.in/.`;
  }
  return `I answer questions strictly based on confirmed UFUQ ’26 event records. For queries beyond published details, please reach out directly to the ADSA organizing team via the Contact section or visit https://alathurpadidars.in/.`;
}
