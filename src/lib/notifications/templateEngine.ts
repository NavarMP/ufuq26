// UFUQ '26 Template & Formatting Engine for Omnichannel Communications
// Supports English, Malayalam, and Arabic with localized variables and aesthetic formatting

import { NotificationEventType, NotificationTemplate } from '@/types/notification';

export interface TemplateVariables {
  fullName: string;
  phone?: string;
  email?: string;
  regCode?: string;
  id?: string;
  darsName?: string;
  darsRegNo?: string;
  darsMudarris?: string;
  status?: string;
  checkpoint?: string;
  passUrl?: string;
  qrCodeUrl?: string;
  customMessage?: string;
  scheduledTime?: string;
  venue?: string;
  dates?: string;
}

const DEFAULT_VENUE = 'Alathurpadi Dars Campus, Malappuram, Kerala';
const DEFAULT_DATES = 'Dec 24 – Dec 30, 2026';
const DEFAULT_HELPDESK_PHONE = '+91 90745 25205';
const DEFAULT_HELPDESK_EMAIL = 'alathurpadidars@gmail.com';
const BASE_WEBSITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://alathurpadidars.in';

export const SYSTEM_NOTIFICATION_TEMPLATES: Record<NotificationEventType, NotificationTemplate> = {
  registration_submitted: {
    id: 'tpl_registration_submitted',
    name: 'Registration Application Received',
    category: 'transactional',
    eventType: 'registration_submitted',
    subject: {
      en: "UFUQ ’26 — Application Received [{{regCode}}]",
      ml: "UFUQ ’26 — രജിസ്ട്രേഷൻ അപേക്ഷ സ്വീകരിച്ചു [{{regCode}}]",
      ar: "أفق ٢٦ — تم استلام طلب التسجيل بنجاح [{{regCode}}]",
    },
    contentMarkdown: {
      en: `Assalamu Alaikum {{fullName}},\n\nYour application for **UFUQ ’26** (7-Day Residential Workshop & Academic Summit) has been received successfully.\n\n• **Registration Code:** {{regCode}}\n• **Institution:** {{darsName}}\n• **Current Status:** Under Verification\n\nOur admission board is reviewing your application. You will receive an official confirmation notice once your seat is approved.\n\nKeep your registration reference handy for tracking your status.\n\nVenue: ${DEFAULT_VENUE}\nDates: ${DEFAULT_DATES}`,
      ml: `അസ്സലാമു അലൈക്കും {{fullName}},\n\n**UFUQ ’26** (7 ദിവസത്തെ റസിഡൻഷ്യൽ ശില്പശാല) രജിസ്ട്രേഷൻ അപേക്ഷ വിജയകരമായി ലഭിച്ചിരിക്കുന്നു.\n\n• **രജിസ്ട്രേഷൻ കോഡ്:** {{regCode}}\n• **സ്ഥാപനം:** {{darsName}}\n• **സ്റ്റാറ്റസ്:** പരിശോധനയിൽ\n\nഅഡ്മിഷൻ ബോർഡിന്റെ അനുമതി ലഭിച്ചാലുടൻ നിങ്ങളുടെ കാർഡ് കൺഫർമേഷൻ അറിയിപ്പ് ലഭിക്കുന്നതാണ്.\n\nവേദി: ${DEFAULT_VENUE}\nതീയതി: ${DEFAULT_DATES}`,
      ar: `السلام عليكم ورحمة الله وبركاته {{fullName}}،\n\nتم استلام طلب تسجيلكم في **ملتقى أفق ٢٦** بنجاح.\n\n• **رمز التسجيل:** {{regCode}}\n• **المؤسسة:** {{darsName}}\n• **الحالة:** قيد التدقيق والمراجعة\n\nسيتم إشعاركم فور اعتماد قبولكم النهائي.\n\nالمكان: ${DEFAULT_VENUE}\nالتاريخ: ${DEFAULT_DATES}`,
    },
    variables: ['fullName', 'regCode', 'darsName', 'passUrl'],
    isActive: true,
    updatedAt: new Date().toISOString(),
  },

  status_confirmed: {
    id: 'tpl_status_confirmed',
    name: 'Admission Confirmed & Pass Issued',
    category: 'transactional',
    eventType: 'status_confirmed',
    subject: {
      en: "🎉 UFUQ ’26 Admission Confirmed! Your Digital Pass is Ready [{{regCode}}]",
      ml: "🎉 UFUQ ’26 അഡ്മിഷൻ സ്ഥിരീകരിച്ചു! നിങ്ങളുടെ ഡിജിറ്റൽ പാസ്സ് തയ്യാറാണ് [{{regCode}}]",
      ar: "🎉 تم تأكيد قبولكم في أفق ٢٦! بطاقتكم الرقمية جاهزة [{{regCode}}]",
    },
    contentMarkdown: {
      en: `Assalamu Alaikum {{fullName}},\n\nCongratulations! Your registration for **UFUQ ’26** has been **OFFICIALLY CONFIRMED**.\n\n• **Registration ID:** {{regCode}}\n• **Dars:** {{darsName}}\n• **Reporting Date:** Wednesday, Dec 24, 2026 (08:30 AM IST)\n• **Venue:** ${DEFAULT_VENUE}\n\nPlease click the button below to view your **Digital Camp Pass** with your personalized QR check-in voucher. Have your QR code ready at the main gate checkpoint for swift campus entry.\n\nMay Allah bless this academic gathering with Barakah and beneficial knowledge.`,
      ml: `അസ്സലാമു അലൈക്കും {{fullName}},\n\nഅഭಿನന്ദനങ്ങൾ! **UFUQ ’26** റസിഡൻഷ്യൽ ക്യാമ്പിലേക്കുള്ള താങ്കളുടെ അഡ്മിഷൻ **സ്ഥിരീകരിച്ചു (CONFIRMED)**.\n\n• **രജിസ്ട്രേഷൻ കോഡ്:** {{regCode}}\n• **സ്ഥാപനം:** {{darsName}}\n• **റിപ്പോർട്ടിംഗ് സമയം:** ബുധൻ, ഡിസംബർ 24 (രാവിലെ 08:30)\n\nക്യാമ്പസ് പ്രവേശനത്തിനുള്ള ഡിജിറ്റൽ പാസ്സും ക്യുആർ കോഡും കാണാൻ താഴെയുള്ള ലിങ്ക് സന്ദർശിക്കുക. ഗേറ്റിൽ ഹാജരാക്കേണ്ടതാണ്.`,
      ar: `السلام عليكم ورحمة الله وبركاته {{fullName}}،\n\nنهنئكم بقبولكم الرسمي في **ملتقى أفق ٢٦** السكني المبارك.\n\n• **رمز القبول:** {{regCode}}\n• **المؤسسة:** {{darsName}}\n• **موعد الحضور:** الأربعاء، ٢٤ ديسمبر ٢٠٢٦ (الساعة ٨:٣٠ صباحاً)\n\nيرجى فتح الرابط أدناه للحصول على بطاقتكم الرقمية المزودة برمز QR للدخول السريع من بوابات الحرم.\n\nنسأل الله لكم التوفيق والسداد.`,
    },
    variables: ['fullName', 'regCode', 'darsName', 'passUrl'],
    isActive: true,
    updatedAt: new Date().toISOString(),
  },

  status_pending: {
    id: 'tpl_status_pending',
    name: 'Status Under Review',
    category: 'transactional',
    eventType: 'status_pending',
    subject: {
      en: "UFUQ ’26 Application Status Update — Under Review",
      ml: "UFUQ ’26 സ്റ്റാറ്റസ് വിവരം — പരിശോധനയിൽ",
      ar: "أفق ٢٦ — تحديث حالة الطلب: قيد المراجعة",
    },
    contentMarkdown: {
      en: `Assalamu Alaikum {{fullName}},\n\nYour application [{{regCode}}] status is currently set to **Under Review**.\n\nOur coordinators are coordinating with your Dars institution. If additional verification is needed, we will reach out directly.`,
      ml: `അസ്സലാമു അലൈക്കും {{fullName}},\n\nനിങ്ങളുടെ അപേക്ഷ [{{regCode}}] നിലവിൽ പരിശോധനയിലാണ്. ആവശ്യമെങ്കിൽ നിങ്ങളുമായി ബന്ധപ്പെടുന്നതാണ്.`,
      ar: `السلام عليكم {{fullName}}،\n\nطلبكم [{{regCode}}] قيد المراجعة والتدقيق حالياً.`,
    },
    variables: ['fullName', 'regCode'],
    isActive: true,
    updatedAt: new Date().toISOString(),
  },

  status_cancelled: {
    id: 'tpl_status_cancelled',
    name: 'Application Cancelled / Waitlisted',
    category: 'transactional',
    eventType: 'status_cancelled',
    subject: {
      en: "UFUQ ’26 Registration Status Notice",
      ml: "UFUQ ’26 രജിസ്ട്രേഷൻ അറിയിപ്പ്",
      ar: "أفق ٢٦ — إشعار بشأن التسجيل",
    },
    contentMarkdown: {
      en: `Assalamu Alaikum {{fullName}},\n\nThis is to notify you that your registration [{{regCode}}] has been updated to **Cancelled / Waitlisted** due to campus quota limitations or withdrawal request.\n\nIf you believe this is an error or would like to appeal, please contact the ADSA Helpdesk at ${DEFAULT_HELPDESK_PHONE} or email ${DEFAULT_HELPDESK_EMAIL}.`,
      ml: `അസ്സലാമു അലൈക്കും {{fullName}},\n\nസീറ്റ് പരിമിതി മൂലമോ അഭ്യർത്ഥന പ്രകാരമോ താങ്കളുടെ രജിസ്ട്രേഷൻ [{{regCode}}] ക്യാൻസൽ/വെയ്റ്റ്‌ലിസ്റ്റ് ചെയ്യപ്പെട്ടിരിക്കുന്നു.\n\nസംശയങ്ങൾക്ക് ഹെൽപ്‌ഡെസ്കുമായി ബന്ധപ്പെടുക: ${DEFAULT_HELPDESK_PHONE}.`,
      ar: `السلام عليكم {{fullName}}،\n\nنحيطكم علماً بأن حالة تسجيلكم [{{regCode}}] تم تعديلها إلى ملغى / في قائمة الانتظار نظراً لمحدودية المقاعد.\n\nللتواصل: ${DEFAULT_HELPDESK_PHONE}.`,
    },
    variables: ['fullName', 'regCode'],
    isActive: true,
    updatedAt: new Date().toISOString(),
  },

  gate_entry: {
    id: 'tpl_gate_entry',
    name: 'Campus Gate Entry Logged',
    category: 'transactional',
    eventType: 'gate_entry',
    subject: {
      en: "Campus Entry Verified — Welcome to UFUQ ’26!",
      ml: "ക്യാമ്പസ് പ്രവേശനം സ്ഥിരീകരിച്ചു — സ്വാഗതം UFUQ ’26 ലേക്ക്!",
      ar: "تم تسجيل الدخول — أهلاً بكم في رحاب أفق ٢٦!",
    },
    contentMarkdown: {
      en: `Assalamu Alaikum {{fullName}},\n\nYour entry into Alathurpadi Dars Campus has been verified successfully at Checkpoint: **{{checkpoint}}**.\n\n• Time: {{scheduledTime}}\n• Participant Code: {{regCode}}\n\nPlease keep your plastic ID pass visible throughout the sessions. Welcome!`,
      ml: `അസ്സലാമു അലൈക്കും {{fullName}},\n\nഅലാത്തൂർപടി ദർസ് ക്യാമ്പസിലേക്കുള്ള താങ്കളുടെ പ്രവേശനം **{{checkpoint}}** ഗേറ്റിൽ രേഖപ്പെടുത്തിയിരിക്കുന്നു. സ്വാഗതം!`,
      ar: `السلام عليكم {{fullName}}،\n\nتم تسجيل دخولكم بنجاح عبر نقطة: **{{checkpoint}}**.\n\nأهلاً وسهلاً بكم في رحاب الملتقى!`,
    },
    variables: ['fullName', 'regCode', 'checkpoint', 'scheduledTime'],
    isActive: true,
    updatedAt: new Date().toISOString(),
  },

  meal_claimed: {
    id: 'tpl_meal_claimed',
    name: 'Dining Slot Claimed',
    category: 'transactional',
    eventType: 'meal_claimed',
    subject: {
      en: "Dining Voucher Verified — UFUQ ’26",
      ml: "ഭക്ഷണ കൂപ്പൺ സ്ഥിരീകരിച്ചു — UFUQ ’26",
      ar: "تم توثيق وجبة الطعام — أفق ٢٦",
    },
    contentMarkdown: {
      en: `Assalamu Alaikum {{fullName}},\n\nYour dining voucher for **{{customMessage}}** was successfully scanned and verified. Enjoy your meal!`,
      ml: `അസ്സലാമു അലൈക്കും {{fullName}},\n\nതാങ്കളുടെ ഭക്ഷണ കൂപ്പൺ (**{{customMessage}}**) വിജയകരമായി സ്കാൻ ചെയ്തു.`,
      ar: `السلام عليكم {{fullName}}،\n\nتم التحقق من قسيمة الوجبة بنجاح ({{customMessage}}). هنيئاً مريئاً.`,
    },
    variables: ['fullName', 'customMessage'],
    isActive: true,
    updatedAt: new Date().toISOString(),
  },

  session_reminder: {
    id: 'tpl_session_reminder',
    name: 'Keynote Session Reminder',
    category: 'reminder',
    eventType: 'session_reminder',
    subject: {
      en: "Upcoming Session: {{customMessage}} — UFUQ ’26",
      ml: "സെഷൻ ഓർമ്മപ്പെടുത്തൽ: {{customMessage}} — UFUQ ’26",
      ar: "تذكير بالجلسة القادمة: {{customMessage}} — أفق ٢٦",
    },
    contentMarkdown: {
      en: `🔔 **Session Alert**\n\nThe session **{{customMessage}}** is starting shortly at {{scheduledTime}}.\n\nVenue: Main Auditorium, Alathurpadi.\nPlease be seated 5 minutes prior to commencement.`,
      ml: `🔔 **സെഷൻ ഓർമ്മപ്പെടുത്തൽ**\n\n**{{customMessage}}** സെഷൻ ഉടൻ ആരംഭിക്കുന്നു (സമയം: {{scheduledTime}}). എല്ലാവരും മെയിൻ ഓഡിറ്റോറിയത്തിൽ എത്തിച്ചേരുക.`,
      ar: `🔔 **تذكير بالجلسة**\n\nستبدأ الجلسة: **{{customMessage}}** في تمام الساعة {{scheduledTime}} في القاعة الرئيسية.`,
    },
    variables: ['customMessage', 'scheduledTime'],
    isActive: true,
    updatedAt: new Date().toISOString(),
  },

  camp_countdown: {
    id: 'tpl_camp_countdown',
    name: 'Camp Countdown Milestone Alert',
    category: 'announcement',
    eventType: 'camp_countdown',
    subject: {
      en: "⏳ UFUQ ’26 Countdown Alert: {{customMessage}}",
      ml: "⏳ UFUQ ’26 കൗണ്ട്‌ഡൗൺ: {{customMessage}}",
      ar: "⏳ العد التنازلي لملتقى أفق ٢٦: {{customMessage}}",
    },
    contentMarkdown: {
      en: `Assalamu Alaikum {{fullName}},\n\n{{customMessage}}\n\nDates: ${DEFAULT_DATES}\nVenue: ${DEFAULT_VENUE}\n\nPrepare your travel plans and academic materials. We eagerly look forward to hosting you!`,
      ml: `അസ്സലാമു അലൈക്കും {{fullName}},\n\n{{customMessage}}\n\nതീയതി: ${DEFAULT_DATES}\nവേദി: ${DEFAULT_VENUE}\n\nയാത്രാ ഒരുക്കങ്ങൾ മുൻകൂട്ടി പൂർത്തിയാക്കുക.`,
      ar: `السلام عليكم {{fullName}}،\n\n{{customMessage}}\n\nالمكان: ${DEFAULT_VENUE}\nالتاريخ: ${DEFAULT_DATES}`,
    },
    variables: ['fullName', 'customMessage'],
    isActive: true,
    updatedAt: new Date().toISOString(),
  },

  custom_broadcast: {
    id: 'tpl_custom_broadcast',
    name: 'Admin Custom Announcement',
    category: 'announcement',
    eventType: 'custom_broadcast',
    subject: {
      en: "Notice from UFUQ ’26 Organizers: {{customMessage}}",
      ml: "UFUQ ’26 അറിയിപ്പ്: {{customMessage}}",
      ar: "إشعار من اللجنة المنظمة لأفق ٢٦: {{customMessage}}",
    },
    contentMarkdown: {
      en: `Assalamu Alaikum {{fullName}},\n\n{{customMessage}}\n\n— Organizers, Alathurpadi Dars Students Association (ADSA)`,
      ml: `അസ്സലാമു അലൈക്കും {{fullName}},\n\n{{customMessage}}\n\n— സംഘാടക സമിതി, അലാത്തൂർപടി ദർസ് സ്റ്റുഡന്റസ് അസോസിയേഷൻ`,
      ar: `السلام عليكم {{fullName}}،\n\n{{customMessage}}\n\n— اللجنة المنظمة، جمعية طلاب درس ألاثوربادي`,
    },
    variables: ['fullName', 'customMessage'],
    isActive: true,
    updatedAt: new Date().toISOString(),
  },
};

/**
 * Replace placeholders like {{fullName}} with actual values
 */
export function interpolateVariables(templateText: string, vars: TemplateVariables): string {
  let result = templateText;
  const mappings: Record<string, string> = {
    fullName: vars.fullName || 'Scholar / Student',
    phone: vars.phone || '',
    email: vars.email || '',
    regCode: vars.regCode || vars.id || 'UF26-ATTENDEE',
    id: vars.id || vars.regCode || '',
    darsName: vars.darsName || 'SUFFA Dars Institution',
    darsRegNo: vars.darsRegNo || '',
    darsMudarris: vars.darsMudarris || '',
    status: (vars.status || 'confirmed').toUpperCase(),
    checkpoint: vars.checkpoint || 'Main Gate',
    passUrl: vars.passUrl || `${BASE_WEBSITE_URL}/#pass`,
    qrCodeUrl: vars.qrCodeUrl || '',
    customMessage: vars.customMessage || '',
    scheduledTime: vars.scheduledTime || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    venue: vars.venue || DEFAULT_VENUE,
    dates: vars.dates || DEFAULT_DATES,
  };

  for (const [key, val] of Object.entries(mappings)) {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    result = result.replace(regex, val);
  }

  return result;
}

/**
 * Formats a clean, high-conversion WhatsApp message with bolding and links
 */
export function formatWhatsAppMessage(
  eventType: NotificationEventType,
  vars: TemplateVariables,
  locale: 'en' | 'ml' | 'ar' = 'en'
): string {
  const tpl = SYSTEM_NOTIFICATION_TEMPLATES[eventType] || SYSTEM_NOTIFICATION_TEMPLATES.custom_broadcast;
  const rawText = tpl.contentMarkdown[locale] || tpl.contentMarkdown.en;
  const interpolated = interpolateVariables(rawText, vars);

  // Convert markdown bold **text** to WhatsApp bold *text*
  let waFormatted = interpolated.replace(/\*\*(.*?)\*\*/g, '*$1*');

  // Add signature footer
  const passLink = vars.passUrl || `${BASE_WEBSITE_URL}/#pass`;
  waFormatted += `\n\n🌐 *Digital Pass & Event Info:* ${passLink}`;
  waFormatted += `\n📞 *ADSA Helpdesk:* ${DEFAULT_HELPDESK_PHONE}`;

  return waFormatted;
}

/**
 * Generates direct native WhatsApp link (wa.me)
 */
export function buildWhatsAppLink(
  phone: string | undefined,
  message: string
): string {
  if (!phone) return `https://wa.me/?text=${encodeURIComponent(message)}`;
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  return `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates direct native carrier SMS link (sms: URI - 100% free)
 */
export function buildDirectSmsUri(
  phone: string | undefined,
  message: string
): string {
  const cleanPhone = phone ? phone.replace(/\D/g, '').slice(-10) : '';
  const encoded = encodeURIComponent(message);
  // Both iOS and Android support sms:phone?body=...
  return cleanPhone ? `sms:+91${cleanPhone}?body=${encoded}` : `sms:?body=${encoded}`;
}

/**
 * Builds standard, mobile-responsive HTML Email with Golden Islamic Geometry styling
 */
export function buildHtmlEmail(options: {
  eventType: NotificationEventType;
  vars: TemplateVariables;
  locale?: 'en' | 'ml' | 'ar';
}): { subject: string; html: string; text: string } {
  const { eventType, vars, locale = 'en' } = options;
  const tpl = SYSTEM_NOTIFICATION_TEMPLATES[eventType] || SYSTEM_NOTIFICATION_TEMPLATES.custom_broadcast;

  const rawSubject = tpl.subject[locale] || tpl.subject.en;
  const rawBody = tpl.contentMarkdown[locale] || tpl.contentMarkdown.en;

  const subject = interpolateVariables(rawSubject, vars);
  const text = interpolateVariables(rawBody, vars);

  // Convert newlines to HTML paragraphs/breaks
  const htmlBody = text
    .split('\n\n')
    .map((p) => `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #d1d5db;">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  const passUrl = vars.passUrl || `${BASE_WEBSITE_URL}/#pass`;
  const regCode = vars.regCode || vars.id || 'UF26-ATTENDEE';
  const statusLabel = (vars.status || 'CONFIRMED').toUpperCase();

  const isRtl = locale === 'ar';
  const direction = isRtl ? 'rtl' : 'ltr';

  const html = `<!DOCTYPE html>
<html lang="${locale}" dir="${direction}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b1512; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b1512; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #12221d; border-radius: 24px; border: 1px solid rgba(212, 175, 55, 0.35); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #09120f 0%, #173328 100%); padding: 36px 32px; text-align: center; border-bottom: 2px solid #d4af37;">
              <span style="display: inline-block; padding: 4px 14px; background: rgba(212, 175, 55, 0.15); border: 1px solid #d4af37; border-radius: 999px; color: #d4af37; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                Alathurpadi Dars Students Association
              </span>
              <h1 style="margin: 16px 0 6px 0; font-size: 32px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
                UFUQ <span style="color: #d4af37;">’26</span>
              </h1>
              <p style="margin: 0; font-size: 14px; color: #a3c2b6;">
                7-Day Residential Workshop &amp; Academic Summit • Dec 24–30
              </p>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 36px 32px; text-align: ${isRtl ? 'right' : 'left'};">
              <div style="text-align: right; margin-bottom: 20px; font-family: 'Amiri', serif; font-size: 18px; color: #d4af37;">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>

              ${htmlBody}

              <!-- Pass Voucher Box -->
              <table role="presentation" width="100%" style="background-color: #0b1512; border-radius: 16px; border: 1px dashed rgba(212, 175, 55, 0.4); margin: 24px 0;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: #9ca3af; text-transform: uppercase;">
                      Official Registration Code
                    </div>
                    <div style="font-size: 26px; font-weight: 800; font-family: monospace; letter-spacing: 2px; color: #d4af37; margin: 8px 0;">
                      ${regCode}
                    </div>
                    <div style="font-size: 13px; color: #10b981; font-weight: 600;">
                      Status: ${statusLabel}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Call to Action -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 32px 0 16px 0;">
                <tr>
                  <td align="center">
                    <a href="${passUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #d4af37 0%, #aa8528 100%); color: #09120f; font-size: 14px; font-weight: 800; text-decoration: none; border-radius: 12px; box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);">
                      Open Digital Camp Pass &amp; QR
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #09120f; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280;">
                Venue: ${DEFAULT_VENUE}
              </p>
              <p style="margin: 0; font-size: 11px; color: #4b5563;">
                Need assistance? WhatsApp Helpdesk: ${DEFAULT_HELPDESK_PHONE} • ${DEFAULT_HELPDESK_EMAIL}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
