import { GuideRole, GuideStep, DayHorizon, ChecklistItem, TransitHub, ShortcutItem, TourStep } from '@/types/guide';

export const GUIDE_ROLES: { id: GuideRole; icon: string; title: Record<'en' | 'ml' | 'ar', string>; desc: Record<'en' | 'ml' | 'ar', string> }[] = [
  {
    id: 'delegate',
    icon: 'GraduationCap',
    title: {
      en: 'Graduating Delegate',
      ml: 'പഠനം പൂർത്തിയാക്കുന്ന വിദ്യാർത്ഥി',
      ar: 'الطالب المتخرج (المندوب)',
    },
    desc: {
      en: 'SUFFA Dars student preparing for higher academics and leadership.',
      ml: 'ഉന്നതപഠനത്തിനും പുതിയ ദിശാബോധത്തിനും തയ്യാറെടുക്കുന്ന ദർസ് വിദ്യാർത്ഥികൾ.',
      ar: 'طالب دراسات صفة المتأهب للدراسات العليا والقيادة المجتمعية.',
    },
  },
  {
    id: 'mudarris',
    icon: 'Building2',
    title: {
      en: 'Dars Mudarris / In-Charge',
      ml: 'ദർസ് മുദരിസ്സ് / പ്രതിനിധി',
      ar: 'مدرس الدار / المسؤول المعتمد',
    },
    desc: {
      en: 'Institution mentors nominating and managing student delegates.',
      ml: 'വിദ്യാർത്ഥികളെ നാമനിർദ്ദേശം ചെയ്യാനും സ്ഥിരീകരിക്കാനുമുള്ള ദർസ് നേതൃത്വം.',
      ar: 'شيوخ ومسؤولو الحلقات لإدارة ترشيحات وتزكيات الطلاب.',
    },
  },
  {
    id: 'organizer',
    icon: 'ShieldCheck',
    title: {
      en: 'Camp Organizer & Admin',
      ml: 'ക്യാമ്പ് സംഘാടകർ & അഡ്മിൻ',
      ar: 'اللجنة المنظمة والإدارة',
    },
    desc: {
      en: 'ADSA committee managing schedules, speakers, badges, and records.',
      ml: 'സെഷനുകളും ഗസ്റ്റുകളും രജിസ്ട്രേഷനുകളും ഏകോപിപ്പിക്കുന്ന സംഘാടക സമിതി.',
      ar: 'أعضاء جمعية أدسا لإدارة الجلسات والضيوف والتسجيلات والتنظيم.',
    },
  },
  {
    id: 'guest',
    icon: 'Compass',
    title: {
      en: 'Scholar / Guest / Observer',
      ml: 'പണ്ഡിതർ / അതിഥികൾ / നിരീക്ഷകർ',
      ar: 'العلماء والضيوف والزوار',
    },
    desc: {
      en: 'Mentors, keynote speakers, and parents visiting Alathurpadi campus.',
      ml: 'ക്യാമ്പിലെത്തുന്ന അതിഥികൾ, പ്രഭാഷകർ, രക്ഷിതാക്കൾ എന്നിവർക്കായി.',
      ar: 'الأساتذة والضيوف وأولياء الأمور الزائرون لمجمع ألاطوربادي.',
    },
  },
];

export const ROLE_STEPS: Record<GuideRole, GuideStep[]> = {
  delegate: [
    {
      id: 'step-reg',
      stepNumber: 1,
      badge: { en: 'Phase 1: Verification', ml: 'ഘട്ടം 1: രജിസ്ട്രേഷൻ', ar: 'المرحلة 1: التسجيل المعتمد' },
      title: {
        en: 'Verify Your Dars & Register Online',
        ml: 'ദർസ് തിരഞ്ഞെടുത്തു രജിസ്റ്റർ ചെയ്യുക',
        ar: 'اختر حلقتك وسجل بياناتك الرسمية',
      },
      description: {
        en: 'Select your registered SUFFA Dars from the verified institutional directory, fill in your details, and receive your unique UFUQ ’26 delegate reference token.',
        ml: 'അംഗീകൃത സുഫാ ദർസ് ലിസ്റ്റിൽ നിന്ന് നിങ്ങളുടെ സ്ഥാപനം തിരഞ്ഞെടുത്ത് വ്യക്തിഗത വിവരങ്ങൾ നൽകി യൂണീക്ക് റഫറൻസ് കോഡ് സ്വന്തമാക്കുക.',
        ar: 'اختر حلقتك المعتمدة من القائمة الرسمية وأدخل معلوماتك لتحصل على رمز المندوب المعتمد الخاص بك.',
      },
      tips: {
        en: [
          'Have your Dars Sadar Mudarris recommendation or verification ready.',
          'Double-check your WhatsApp mobile number to receive schedule alerts.',
          'Save the generated Reference ID (e.g. UF26-4820) for campus badge generation.',
        ],
        ml: [
          'ദർസ് സദർ മുദരിസ്സിന്റെ അനുമതി ഉറപ്പുവരുത്തുക.',
          'വാട്സ്ആപ്പ് സന്ദേശങ്ങൾക്കായി നൽകുന്ന ഫോൺ നമ്പർ കൃത്യമാണെന്ന് പരിശോധിക്കുക.',
          'റഫറൻസ് ഐഡി (ഉദാ: UF26-4820) കുറിച്ചുവെക്കുക.',
        ],
        ar: [
          'تأكد من تزكية شيخ الحلقة وموافقته المسبقة.',
          'تحقق من صحة رقم الواتساب لتلقي تنبيهات ومستجدات المخيم.',
          'احتفظ برمز التسجيل (مثل UF26-4820) لإصدار بطاقة الدخول.',
        ],
      },
      actionUrl: '/#register',
      actionLabel: { en: 'Go to Registration Form', ml: 'രജിസ്ട്രേഷൻ ഫോമിലേക്ക്', ar: 'الانتقال إلى نموذج التسجيل' },
      simulatorType: 'registration',
    },
    {
      id: 'step-schedule',
      stepNumber: 2,
      badge: { en: 'Phase 2: Planning', ml: 'ഘട്ടം 2: സെഷനുകൾ', ar: 'المرحلة 2: الجداول والأجندة' },
      title: {
        en: 'Master the 7-Day Horizon Schedule',
        ml: '7 ദിന പരിപാടികൾ മുൻകൂട്ടി മനസ്സിലാക്കുക',
        ar: 'استكشف برنامج الآفاق السبعة بالتفصيل',
      },
      description: {
        en: 'Explore all 38+ curated sessions across keynotes, hands-on workshops, personal mentoring halqas, and transition panels. Filter by track and export directly to your calendar.',
        ml: '38-ലധികം പ്രത്യേക സെഷനുകൾ, വർക്ക്‌ഷോപ്പുകൾ, മെന്ററിംഗ് ഹൽഖകൾ എന്നിവ പരിശോധിച്ചു നിങ്ങളുടെ കലണ്ടറിലേക്ക് (.ics) സേവ് ചെയ്യുക.',
        ar: 'تعرف على أكثر من 38 جلسة متخصصة، وورش عمل تطبيقية، وحلقات إرشادية وقم بحفظها في تقويم هاتفك بنقرة واحدة.',
      },
      tips: {
        en: [
          'Use category filter chips to isolate Career Tracks from Spiritual Halqas.',
          'Click the calendar icon on any session to download an instant .ics event file.',
          'Keynote addresses commence punctually following Fajr and Maghrib assemblies.',
        ],
        ml: [
          'കരിയർ സെഷനുകളും ആത്മീയ ഹൽഖകളും വേർതിരിച്ചു കാണാൻ ഫിൽട്ടറുകൾ ഉപയോഗിക്കുക.',
          'ഓരോ സെഷനും നിങ്ങളുടെ ഫോൺ കലണ്ടറിലേക്ക് നേരിട്ട് എക്സ്പോർട്ട് ചെയ്യാം.',
          'സുബ്ഹി, മഗ്രിബ് സമയങ്ങൾക്ക് ശേഷം കൃത്യസമയത്ത് സെഷനുകൾ ആരംഭിക്കും.',
        ],
        ar: [
          'استخدم التصنيفات للتمييز بين المسارات المهنية والحلقات الروحية.',
          'انقر على أيقونة التقويم لتحميل موعد الجلسة بصيغة .ics لهاتفك.',
          'تبدأ الجلسات الرئيسية بدقة وانضباط عقب صلاتي الفجر والمغرب.',
        ],
      },
      actionUrl: '/#schedule',
      actionLabel: { en: 'Open Live Schedule', ml: 'ഷെഡ്യൂൾ പരിശോധിക്കുക', ar: 'عرض الجدول الكامل' },
      simulatorType: 'calendar',
    },
    {
      id: 'step-search',
      stepNumber: 3,
      badge: { en: 'Phase 3: Navigation', ml: 'ഘട്ടം 3: സ്മാർട്ട് സെർച്ച്', ar: 'المرحلة 3: البحث السريع' },
      title: {
        en: 'Lightning Search & The UFUQ AI Companion',
        ml: 'സ്മാർട്ട് സെർച്ചും എഐ അസിസ്റ്റന്റും പ്രയോജനപ്പെടുത്തുക',
        ar: 'البحث الفوري والمساعد الذكي المعتمد',
      },
      description: {
        en: 'Press ⌘K or Ctrl+K anywhere to instantly locate scholars, campus rooms, emergency helplines, and FAQs. Tap the golden spark icon to consult the offline-resilient UFUQ assistant.',
        ml: 'ഏത് പേജിലും ⌘K അമർത്തി അതിഥികൾ, ഷെഡ്യൂൾ, സംശയങ്ങൾ എന്നിവ സെർച്ച് ചെയ്യാം. എഐ അസിസ്റ്റന്റിലൂടെ ക്യാമ്പ് വിവരങ്ങൾ തത്സമയം ചോദിച്ചറിയാം.',
        ar: 'اضغط على ⌘K أو Ctrl+K في أي وقت للوصول الفوري للمتحدثين والجداول، أو استعن بالمساعد الذكي للحصول على إجابات فورية.',
      },
      tips: {
        en: [
          'Type keywords like "scholarship", "accommodation", or "bus route".',
          'The AI assistant works with local fallback knowledge even when internet connectivity dips.',
        ],
        ml: [
          '"സ്കോളർഷിപ്പ്", "താമസം", "യാത്ര" തുടങ്ങിയ വാക്കുകൾ നൽകി തിരയാം.',
          'ഇന്റർനെറ്റ് കുറവുള്ളപ്പോഴും ഓഫ്‌ലൈൻ ഫാൾബാക്കോടെ എഐ അസിസ്റ്റന്റ് പ്രവർത്തിക്കും.',
        ],
        ar: [
          'ابحث بكلمات مثل "المنح الدراسية"، "السكن"، أو "مواعيد الحافلات".',
          'المساعد الذكي مهيأ للعمل بذكاء حتى عند بطء الاتصال بالإنترنت.',
        ],
      },
      simulatorType: 'search',
    },
    {
      id: 'step-arrival',
      stepNumber: 4,
      badge: { en: 'Phase 4: Camp Life', ml: 'ഘട്ടം 4: ക്യാമ്പസ് ജീവിതം', ar: 'المرحلة 4: الحضور والسلوك' },
      title: {
        en: 'Packing, Etiquette & Campus Protocols',
        ml: 'യാത്രാ ഒരുക്കങ്ങളും ക്യാമ്പസ് ചിട്ടകളും',
        ar: 'الاستعداد للمغادرة، وآداب الحرم الجامعي',
      },
      description: {
        en: 'Prepare your formal white Dars attire, personal notebook, and travel tickets. Review check-in desk hours at Alathurpadi campus and respect the spiritual decorum of the sacred grounds.',
        ml: 'വെള്ള വസ്ത്രങ്ങൾ, വ്യക്തിഗത രേഖകൾ, പഠനോപകരണങ്ങൾ എന്നിവ തയ്യാറാക്കുക. അലാത്തുർപടി ക്യാമ്പസിലെ റിപ്പോർട്ടിംഗ് സമയവും അച്ചടക്ക നിർദ്ദേശങ്ങളും പാലിക്കുക.',
        ar: 'جهّز لباسك الأبيض المعتاد وأدواتك الشخصية ومذكراتك. التزم بمواعيد مكتب الاستقبال واحترام السمت العلمي والروحاني للمكان.',
      },
      tips: {
        en: [
          'Reporting window opens 02:00 PM on December 24, 2026.',
          'Keep your mobile in silent mode inside lecture halls and prayer spaces.',
          'Campus Wi-Fi and designated study cubicles are available for attendees.',
        ],
        ml: [
          '2026 ഡിസംബർ 24 ഉച്ചക്ക് 2:00 മണി മുതൽ റിപ്പോർട്ടിംഗ് ആരംഭിക്കും.',
          'പഠന ഹാളുകളിലും പള്ളിയിലും മൊബൈൽ ഫോണുകൾ സൈലന്റ് ആക്കുക.',
          'വിദ്യാർത്ഥികൾക്കായി ക്യാമ്പസ് വൈഫൈയും സ്റ്റഡി സോണുകളും ഒരുക്കിയിട്ടുണ്ട്.',
        ],
        ar: [
          'يفتح مكتب الاستقبال أبوابه الساعة 02:00 ظهراً يوم 24 ديسمبر 2026.',
          'يُرجى ضبط الهواتف على الوضع الصامت داخل القاعات ومصلى الحرم.',
          'تتوفر شبكة واي فاي ومساحات مخصصة للمطالعة والبحث طيلة أيام المخيم.',
        ],
      },
      actionUrl: '#location',
      actionLabel: { en: 'View Venue & Routes', ml: 'യാത്രാ വിവരങ്ങൾ കാണുക', ar: 'طرق الوصول والخريطة' },
    },
  ],

  mudarris: [
    {
      id: 'step-dars-login',
      stepNumber: 1,
      badge: { en: 'Auth', ml: 'പ്രവേശനം', ar: 'تسجيل الدخول' },
      title: {
        en: 'Sign into the Verified Dars Portal',
        ml: 'ദർസ് പോർട്ടലിലേക്ക് ലോഗിൻ ചെയ്യുക',
        ar: 'الدخول إلى بوابة الحلقات المعتمدة',
      },
      description: {
        en: 'Access /dars using your registered institutional mobile number and secure password provided by the ADSA central organizing council.',
        ml: 'അഡ്സ (ADSA) നൽകിയ രജിസ്റ്റർ ചെയ്ത ഫോൺ നമ്പറും പാസ്‌വേഡും ഉപയോഗിച്ച് /dars പോർട്ടലിൽ പ്രവേശിക്കുക.',
        ar: 'سجل دخولك عبر صفحة /dars برقم الهاتف المعتمد وكلمة المرور المسلمة لك من إدارة ADSA المركزية.',
      },
      tips: {
        en: [
          'Upon first login, immediately update your temporary password.',
          'Contact the central helpdesk if your institution number is not recognized.',
        ],
        ml: [
          'ആദ്യ ലോഗിനിൽ തന്നെ പാസ്‌വേഡ് മാറ്റി സുരക്ഷിതമാക്കുക.',
          'നമ്പർ തിരിച്ചറിയാൻ സാധിച്ചില്ലെങ്കിൽ ഹെൽപ്പ്‌ഡെസ്കുമായി ബന്ധപ്പെടുക.',
        ],
        ar: [
          'يُنصح بتغيير كلمة المرور المؤقتة فور تسجيل الدخول لأول مرة.',
          'في حال واجهت أي صعوبة تواصل فوراً مع الدعم الفني المركزي.',
        ],
      },
      actionUrl: '/dars',
      actionLabel: { en: 'Open Dars Portal', ml: 'ദർസ് പോർട്ടൽ തുറക്കുക', ar: 'فتح بوابة الحلقات' },
    },
    {
      id: 'step-dars-nominate',
      stepNumber: 2,
      badge: { en: 'Delegates', ml: 'നോമിനേഷൻ', ar: 'إدارة الطلاب' },
      title: {
        en: 'Register & Endorse Your Graduating Students',
        ml: 'വിദ്യാർത്ഥികളെ ചേർക്കുക & സ്ഥിരീകരിക്കുക',
        ar: 'تسجيل وتزكية الطلاب المرشحين',
      },
      description: {
        en: 'Add eligible candidates from your Dars batch. Input their phone, educational focus, and endorse their readiness for higher university transition.',
        ml: 'ഉന്നതപഠനത്തിന് തയ്യാറെടുക്കുന്ന നിങ്ങളുടെ ദർസിലെ വിദ്യാർത്ഥികളുടെ വിവരങ്ങൾ രേഖപ്പെടുത്തി അനുമതി നൽകുക.',
        ar: 'أضف بيانات الطلاب المتخرجين المؤهلين للمخيم، وحدد مجالات اهتمامهم وتزكيتهم الرسمية.',
      },
      tips: {
        en: [
          'You can add single candidates or review pre-registered submissions.',
          'Ensure the candidate has completed their Mutawassit / Alim course curriculum.',
        ],
        ml: [
          'വിദ്യാർത്ഥികളെ നേരിട്ട് ചേർക്കാനും ലിസ്റ്റ് പരിശോധിക്കാനും സാധിക്കും.',
          'വിദ്യാർത്ഥി മുത്വവ്വസിത് / ആലിം കോഴ്‌സ് ഘട്ടം പൂർത്തിയാക്കിയെന്ന് ഉറപ്പുവരുത്തുക.',
        ],
        ar: [
          'يمكنك إضافة الطلاب مباشرة أو مراجعة طلبات التسجيل الذاتي.',
          'تأكد من إتمام الطالب للمرحلة المتوسطة أو مرحلة التخرج المناسبة.',
        ],
      },
    },
    {
      id: 'step-dars-export',
      stepNumber: 3,
      badge: { en: 'Verification', ml: 'ബാഡ്ജുകൾ', ar: 'التصاريح والطباعة' },
      title: {
        en: 'Download Verification Passes & Student Badges',
        ml: 'സ്ഥിരീകരണ രേഖകളും ബാഡ്ജുകളും പ്രിന്റ് ചെയ്യുക',
        ar: 'طباعة بطاقات المندوبين وكشوفات الاعتماد',
      },
      description: {
        en: 'Generate printable approval sheets and official pass credentials for all endorsed students before departure to the Alathurpadi campus.',
        ml: 'ക്യാമ്പിലേക്ക് തിരിക്കുന്നതിന് മുമ്പായി വിദ്യാർത്ഥികളുടെ ഔദ്യോഗിക പാസുകൾ ഡൗൺലോഡ് ചെയ്തു നൽകുക.',
        ar: 'استخرج بطاقات التعريف الرسمية وكشف المندوبين المعتمدين لتسليمه للطلاب قبل الانطلاق للمخيم.',
      },
      tips: {
        en: [
          'Use the "Print Verified List" button for an organized official hardcopy.',
          'Delegates presenting Mudarris-endorsed passes enjoy express campus check-in.',
        ],
        ml: [
          '"Print Verified List" ഉപയോഗിച്ച് പ്രിന്റഡ് കോപ്പി തയ്യാറാക്കാം.',
          'മുദരിസ്സിന്റെ അനുമതിപത്രമുള്ള വിദ്യാർത്ഥികൾക്ക് ക്യാമ്പസിൽ അതിവേഗ പ്രവേശനം ലഭിക്കും.',
        ],
        ar: [
          'استخدم زر "طباعة الكشف" للحصول على وثيقة ورقية رسمية مختومة.',
          'يحصل الطلاب حاملو التزكية المطبوعة على تسجيل دخول سريع بالحرم.',
        ],
      },
    },
  ],

  organizer: [
    {
      id: 'step-admin-overview',
      stepNumber: 1,
      badge: { en: 'Dashboard', ml: 'ഡാഷ്‌ബോർഡ്', ar: 'لوحة التحكم' },
      title: {
        en: 'Central Command at /admin',
        ml: '/admin സെൻട്രൽ കൺട്രോൾ റൂം',
        ar: 'مركز القيادة الموحد عبر /admin',
      },
      description: {
        en: 'Access real-time registration metrics, Dars participation counts, verified student statistics, and event toggle controls in one responsive dashboard.',
        ml: 'തത്സമയ രജിസ്ട്രേഷൻ കണക്കുകൾ, ദർസ് പങ്കാളിത്തം, സ്ഥിരീകരണ വിവരങ്ങൾ എന്നിവ ഒരൊറ്റ സ്ക്രീനിൽ പരിശോധിക്കുക.',
        ar: 'متابعة مؤشرات التسجيل المباشرة، وحصيلة مشاركة الحلقات، وإحصاءات المندوبين المعتمدين.',
      },
      actionUrl: '/admin',
      actionLabel: { en: 'Open Admin Console', ml: 'അഡ്മിൻ കൺസോൾ', ar: 'فتح وحدة الإدارة' },
      tips: {
        en: [
          'Monitor the registration capacity gauge to prevent venue overcrowding.',
          'Export registration snapshots via CSV for security and physical logistics.',
        ],
        ml: [
          'ഹാളിലെ സൗകര്യത്തിനനുസരിച്ച് രജിസ്ട്രേഷൻ കപ്പാസിറ്റി നിരീക്ഷിക്കുക.',
          'സിഎസ്വി (CSV) ഫോർമാറ്റിൽ മുഴുവൻ വിവരങ്ങളും ബാക്കപ്പ് എടുക്കാം.',
        ],
        ar: [
          'تابع نسبة الإشغال لضمان استيعاب القاعات ومرافق الإقامة بكل راحة.',
          'قم بتصدير بيانات المسجلين بصيغة CSV للأرشفة والترتيبات الميدانية.',
        ],
      },
    },
    {
      id: 'step-admin-schedule',
      stepNumber: 2,
      badge: { en: 'Operations', ml: 'മാനേജ്‌മെന്റ്', ar: 'إدارة الفعاليات' },
      title: {
        en: 'Dynamic Session & Speaker Management',
        ml: 'സെഷനുകളും പ്രഭാഷകരും തത്സമയം അപ്‌ഡേറ്റ് ചെയ്യുക',
        ar: 'إدارة الجلسات والضيوف وتحديث البيانات فورياً',
      },
      description: {
        en: 'Create new workshops, modify speaker allocations, and publish schedule alterations with instantaneous live sync across all delegates’ screens.',
        ml: 'പ്രോഗ്രാം സമയങ്ങളിലും അതിഥികളുടെ വിവരങ്ങളിലും വരുന്ന മാറ്റങ്ങൾ തത്സമയം സൈറ്റിൽ പുതുക്കുക.',
        ar: 'إضافة وتعديل ورش العمل ومواعيد المحاضرات والمتحدثين مع مزامنة فورية تظهر لجميع الزوار.',
      },
      tips: {
        en: [
          'Changes made in the admin portal reflect immediately without page rebuilds.',
          'Tag sessions with accurate categories (Halqa, Keynote, Career, Mentorship).',
        ],
        ml: [
          'അഡ്മിൻ മാറ്റങ്ങൾ തത്സമയം തന്നെ വിദ്യാർത്ഥികളുടെ സ്ക്രീനിൽ പ്രതിഫലിക്കും.',
          'സെഷൻ കാറ്റഗറികൾ കൃത്യമായി നൽകാൻ ശ്രദ്ധിക്കുക.',
        ],
        ar: [
          'تحديثات الجلسات تنعكس فوراً على الموقع دون الحاجة لإعادة تحميل النظام.',
          'صنف كل فعالية بدقة (حلقة علمية، ندوة، توجيه مهني، جلسة فردية).',
        ],
      },
    },
    {
      id: 'step-admin-audio',
      stepNumber: 3,
      badge: { en: 'Atmosphere', ml: 'ശബ്ദം & പരിസ്ഥിതി', ar: 'الصوتيات والبيئة' },
      title: {
        en: 'Soundscapes & Multimedia Broadcasts',
        ml: 'ആംബിയന്റ് സൗണ്ട്‌സ്കേപ്പുകളും സംഗീതവും ക്രമീകരിക്കുക',
        ar: 'إدارة المقاطع الصوتية وأجواء المخيم',
      },
      description: {
        en: 'Upload, order, and toggle reflective ambient nasheeds and instrumentals that play calmly in the site’s responsive floating audio pill.',
        ml: 'സൈറ്റിൽ പശ്ചാത്തലമായി കേൾക്കുന്ന ശാന്തമായ നാശീദുകളും സൗണ്ട്‌ട്രാക്കുകളും നിയന്ത്രിക്കുക.',
        ar: 'تحميل وترتيب المقاطع الصوتية الهادئة والأناشيد الروحانية في مشغل الصوت الذكي.',
      },
      tips: {
        en: [
          'Audio remains user-controlled and respects autoplay browser restrictions.',
          'High-fidelity lossless streaming preserves battery on mobile devices.',
        ],
        ml: [
          'ഉപയോക്താവിന്റെ അനുമതിയോടെ മാത്രമേ ഓഡിയോ പ്ലേ ആവുകയുള്ളൂ.',
          'കുറഞ്ഞ ഡാറ്റയും ചാർജ്ജും മാത്രം ഉപയോഗിക്കുന്ന രീതിയിലാണ് നിർമ്മാണം.',
        ],
        ar: [
          'المشغل يحترم خيارات المستخدم ولا يعمل تلقائياً إلا بإذنه.',
          'نقاء صوتي عالي مع الحفاظ على استهلاك البيانات وطاقة الهاتف.',
        ],
      },
      simulatorType: 'sound',
    },
  ],

  guest: [
    {
      id: 'step-guest-venue',
      stepNumber: 1,
      badge: { en: 'Arrival', ml: 'വരവ്', ar: 'الوصول والاستقبال' },
      title: {
        en: 'Navigate to Alathurpadi Dars Campus',
        ml: 'അലാത്തുർപടി ക്യാമ്പസിലേക്ക് എത്തിച്ചേരാൻ',
        ar: 'الوصول إلى مجمع ألاطوربادي دارس',
      },
      description: {
        en: 'Conveniently situated in Malappuram, Kerala. Easily accessible from Calicut International Airport (CCJ, 28km) and nearby major rail stations.',
        ml: 'കോഴിക്കോട് എയർപോർട്ട് (28 കി.മീ), അങ്ങാടിപ്പുറം / തിരൂർ റെയിൽവേ സ്റ്റേഷനുകൾ എന്നിവ വഴി ക്യാമ്പസിലേക്ക് എത്തിച്ചേരാം.',
        ar: 'يقع المجمع في ملابورم بكيرلا، بالقرب من مطار كاليكوت الدولي (28 كم) ومحطات القطار الرئيسية.',
      },
      tips: {
        en: [
          'Direct prepaid taxis and ADSA volunteer pickup shuttles operate from CCJ airport.',
          'Reserved VIP and mentor parking is available adjacent to the main academy block.',
        ],
        ml: [
          'എയർപോർട്ടിൽ നിന്നും സ്റ്റേഷനുകളിൽ നിന്നും അഡ്സ വളണ്ടിയർമാരുടെ സഹായം ലഭ്യമാണ്.',
          'അതിഥികൾക്കായി പ്രത്യേക പാർക്കിംഗ് സൗകര്യം ഏർപ്പെടുത്തിയിട്ടുണ്ട്.',
        ],
        ar: [
          'تتوفر سيارات استقبال تابعة للجنة المنظمة من مطار كاليكوت ومحطات القطار.',
          'مواقف سيارات خاصة بالضيوف والعلماء بجوار المبنى الأكاديمي الرئيسي.',
        ],
      },
      actionUrl: '#location',
      actionLabel: { en: 'View Travel Routes', ml: 'റൂട്ടുകൾ കാണുക', ar: 'عرض تفاصيل المواصلات' },
    },
    {
      id: 'step-guest-halqa',
      stepNumber: 2,
      badge: { en: 'Sessions', ml: 'പങ്കാളിത്തം', ar: 'المشاركة والحلقات' },
      title: {
        en: 'Keynote Assemblies & Halqa Interactions',
        ml: 'പ്രഭാഷണങ്ങളും വിദ്യാർത്ഥി സംവാദങ്ങളും',
        ar: 'المحاضرات العامة والتواصل مع الطلاب',
      },
      description: {
        en: 'Engage with graduating youth during interactive Q&A roundtables, spiritual contemplation circles, and post-lecture mentoring salons.',
        ml: 'വിദ്യാർത്ഥികളുമായുള്ള ചോദ്യോത്തരങ്ങൾ, സംവാദങ്ങൾ, കരിയർ കൗൺസിലിംഗ് എന്നിവയിൽ പങ്കാളികളാവുക.',
        ar: 'لقاءات تفاعلية مع الطلاب المتخرجين، وحلقات نقاشية للإجابة عن تساؤلاتهم وتوجيه مساراتهم المستقبلية.',
      },
      tips: {
        en: [
          'Simultaneous trilingual support (Arabic, Malayalam, English) is provided on stage.',
          'Full session recordings and transcripts will be published for academic review.',
        ],
        ml: [
          'വേദിയിൽ മലയാളം, അറബിക്, ഇംഗ്ലീഷ് ഭാഷാ സൗകര്യം ലഭ്യമാണ്.',
          'പ്രഭാഷണങ്ങളുടെ റെക്കോർഡിംഗുകൾ തുടർപഠനത്തിനായി ലഭ്യമാക്കും.',
        ],
        ar: [
          'تتوفر ترجمة ومتابعة باللغات العربية والإنجليزية والمليبارية.',
          'تسجيلات الجلسات ومخرجاتها ستكون متاحة للتوثيق والاستفادة العامة.',
        ],
      },
    },
  ],
};

export const SEVEN_HORIZONS: DayHorizon[] = [
  {
    dayNumber: 1,
    date: '2026-12-24',
    dateFormatted: { en: 'Thursday, Dec 24, 2026', ml: '2026 ഡിസംബർ 24, വ്യാഴം', ar: 'الخميس، 24 ديسمبر 2026' },
    title: { en: 'The Arrival & Orientation', ml: 'പ്രവേശനവും ആമുഖവും', ar: 'الوصول والتهيئة' },
    arabicName: 'الأفق الأول: الوصول والتهيئة',
    tagline: { en: 'Crossing the Threshold', ml: 'പുതിയ ചക്രവാളത്തിലേക്ക്', ar: 'عبور العتبة نحو الأفق' },
    theme: {
      en: 'Welcome assembly, campus orientation, spiritual intention (Niyyah), and cohort bonding.',
      ml: 'സ്വീകരണ സംഗമം, ക്യാമ്പസ് പരിചയപ്പെടൽ, ആത്മീയ ഒരുക്കം, പരസ്പര സൗഹൃദം.',
      ar: 'استقبال الوفود، والتعريف بمرافق الحرم، وتجديد النية، وبناء الروابط بين الزملاء.',
    },
    color: '#c9a45c',
    highlights: {
      en: ['Delegate Registration & Badge Issuance', 'Keynote Opening: The Horizon Ahead', 'Spiritual Halqa: The Sanctuary of Learning'],
      ml: ['പ്രവേശന പരിശോധന & ബാഡ്ജ് വിതരണം', 'ഉദ്ഘാടന പ്രഭാഷണം: മുന്നിലുള്ള ചക്രവാളം', 'ആത്മീയ സദസ്സ്: വിജ്ഞാനത്തിന്റെ പവിത്രത'],
      ar: ['استلام البطاقات وتسكين الوفود', 'الخطاب الافتتاحي: معالم الأفق القادم', 'جلسة روحانية: حرم العلم وأمانة المعرفة'],
    },
    sessions: [
      { time: '02:00 PM', title: { en: 'Campus Check-In & Cohort Allotment', ml: 'റിപ്പോർട്ടിംഗ് & റൂം വിതരണം', ar: 'الاستقبال وتوزيع الغرف' }, type: 'Workshop' },
      { time: '07:30 PM', title: { en: 'Inaugural Address: The Spirit of UFUQ', ml: 'ഉദ്ഘാടന സംഗമം', ar: 'حفل الافتتاح الرسمي' }, speaker: 'ADSA Leadership & Patrons', type: 'Keynote' },
      { time: '09:00 PM', title: { en: 'Contemplation Circle: The Scholar’s Vow', ml: 'ചിന്താ സദസ്സ്', ar: 'حلقة فكرية: عهد طالب العلم' }, type: 'Halqa' },
    ],
  },
  {
    dayNumber: 2,
    date: '2026-12-25',
    dateFormatted: { en: 'Friday, Dec 25, 2026', ml: '2026 ഡിസംബർ 25, വെള്ളി', ar: 'الجمعة، 25 ديسمبر 2026' },
    title: { en: 'Roots of Knowledge & Tradition', ml: 'വിജ്ഞാനത്തിന്റെ വേരുകൾ', ar: 'أصول العلم والتراث' },
    arabicName: 'الأفق الثاني: أصول العلم والتراث',
    tagline: { en: 'Rooted Before Rising', ml: 'ഉയരും മുമ്പേ ഉറയ്ക്കുക', ar: 'التجذر قبل التحليق' },
    theme: {
      en: 'Deepening classical Dars grounding, understanding the Islamic intellectual heritage, and anchoring core values.',
      ml: 'ദർസ് പഠനത്തിന്റെ ആഴം, ഇസ്ലാമിക വൈജ്ഞാനിക പാരമ്പര്യം, മൂല്യബോധം എന്നിവ ഉറപ്പിക്കൽ.',
      ar: 'تعميق أصالة المنهج العلمي للحلقات، واستيعاب التراث الفكري، وترسيخ الثوابت.',
    },
    color: '#527a70',
    highlights: {
      en: ['Jumu’ah Assembly & Reflection', 'Symposium: The Evolution of Suffa Tradition', 'Mentor Salons on Fiqh & Modern Contexts'],
      ml: ['ജുമുഅ സംഗമവും ഉൽബോധനവും', 'സെമിനാർ: സുഫാ പാരമ്പര്യത്തിന്റെ വികാസം', 'കർമ്മശാസ്ത്രവും ആധുനികതയും ചർച്ചകൾ'],
      ar: ['خطبة الجمعة الجامعة وموعظة الأفق', 'ندوة: تطور مجالس الصفة عبر التاريخ', 'لقاءات إرشادية حول الفقه والواقع المعاصر'],
    },
    sessions: [
      { time: '08:30 AM', title: { en: 'Preserving Sanad in an Age of Distraction', ml: 'സനദുകളുടെ പ്രാധാന്യം', ar: 'حفظ السند في عصر الشتات' }, speaker: 'Eminent Dars Scholar', type: 'Keynote' },
      { time: '02:30 PM', title: { en: 'Intellectual Traditions of Malabar', ml: 'മലബാറിന്റെ വൈജ്ഞാനിക പാരമ്പര്യം', ar: 'التراث العلمي في مليبار' }, type: 'Panel' },
      { time: '08:00 PM', title: { en: 'Interactive Dialectics: Questions of Faith', ml: 'വിശ്വാസപരമായ ചോദ്യങ്ങൾ', ar: 'حوار مفتوح: ثوابت الإيمان' }, type: 'Workshop' },
    ],
  },
  {
    dayNumber: 3,
    date: '2026-12-26',
    dateFormatted: { en: 'Saturday, Dec 26, 2026', ml: '2026 ഡിസംബർ 26, ശനി', ar: 'السبت، 26 ديسمبر 2026' },
    title: { en: 'Intellectual Discernment', ml: 'ബുദ്ധിപരമായ ഉൾക്കാഴ്ച', ar: 'الفهم والتمييز الفكري' },
    arabicName: 'الأفق الثالث: الفهم والتمييز الفكري',
    tagline: { en: 'Navigating Ideologies', ml: 'ആശയങ്ങളെ വിവേചിച്ചറിയൽ', ar: 'فقه التعامل مع الأفكار المعاصرة' },
    theme: {
      en: 'Critical thinking, media literacy, post-modern philosophical currents, and epistemological clarity.',
      ml: 'വിമർശനാത്മക ചിന്ത, മീഡിയ ലിറ്ററസി, സമകാലിക പ്രത്യയശാസ്ത്രങ്ങളുടെ അപഗ്രഥനം.',
      ar: 'التفكير النقدي، والوعي الإعلامي، وفهم التيارات الفكرية الحديثة بوضوح معرفي.',
    },
    color: '#d4b577',
    highlights: {
      en: ['Epistemology Workshop: What is Sound Knowledge?', 'Analyzing Modernist Trends with Classical Tools', 'Case Studies in Critical Discernment'],
      ml: ['വിജ്ഞാനശാസ്ത്ര വർക്ക്‌ഷോപ്പ്', 'ആധുനിക ചിന്താധാരകളുടെ വിലയിരുത്തൽ', 'വിമർശനാത്മക വായന'],
      ar: ['ورشة نظرية المعرفة: ما هو العلم الموثوق؟', 'قراءة المدارس الفكرية المعاصرة بميزان الأصول', 'دراسات حالة في النقد والتمييز'],
    },
    sessions: [
      { time: '09:00 AM', title: { en: 'The Architecture of Thought: Logic & Reason', ml: 'ചിന്തയുടെ ഘടന: തർക്കശാസ്ത്രവും യുക്തിയും', ar: 'بنية التفكير: المنطق والبرهان' }, type: 'Keynote' },
      { time: '02:00 PM', title: { en: 'Media Literacy & Digital Discourse', ml: 'ഡിജിറ്റൽ മാധ്യമ വിശകലനം', ar: 'التربية الإعلامية والحضور الرقمي' }, type: 'Workshop' },
      { time: '08:00 PM', title: { en: 'Night Circle: Deconstructing Ideologies', ml: 'രാത്രി സദസ്സ്', ar: 'مسامرة فكرية: تفكيك الأيديولوجيات' }, type: 'Halqa' },
    ],
  },
  {
    dayNumber: 4,
    date: '2026-12-27',
    dateFormatted: { en: 'Sunday, Dec 27, 2026', ml: '2026 ഡിസംബർ 27, ഞായർ', ar: 'الأحد، 27 ديسمبر 2026' },
    title: { en: 'Global Academic Horizons', ml: 'ആഗോള ഉന്നതപഠന പാതകൾ', ar: 'الآفاق الأكاديمية والمهنية' },
    arabicName: 'الأفق الرابع: الآفاق الأكاديمية والمهنية',
    tagline: { en: 'From Dars to University', ml: 'ദർസിൽ നിന്ന് സർവകലാശാലകളിലേക്ക്', ar: 'من رحاب الحلقات إلى آفاق الجامعات' },
    theme: {
      en: 'Higher education roadmaps: Central universities (JNU, DU, AMU, Jamia), international fellowships, research methodology, and career paths.',
      ml: 'കേന്ദ്ര സർവകലാശാലാ പഠനം, അന്താരാഷ്ട്ര ഫെലോഷിപ്പുകൾ, ഗവേഷണം, കരിയർ സാധ്യതകൾ.',
      ar: 'خارطة الدراسات العليا: الجامعات المركزية والعالمية، والمنح البحثية، ومسارات التفوق الأكاديمي.',
    },
    color: '#c9a45c',
    highlights: {
      en: ['University Admissions Fair & Alumni Meet', 'Cracking National Fellowship Exams (UGC-NET/JRF)', 'One-on-One Career Mentoring Clinics'],
      ml: ['സർവകലാശാലാ പ്രവേശന ഗൈഡൻസ്', 'നെറ്റ് / ജെ.ആർ.എഫ് പരീക്ഷാ മുന്നൊരുക്കം', 'വ്യക്തിഗത കരിയർ കൗൺസിലിംഗ്'],
      ar: ['معرض القبول الجامعي ولقاء الخريجين', 'اجتياز اختبارات الزمالة والبحث العلمي', 'عيادات الإرشاد المهني والأكاديمي الفردي'],
    },
    sessions: [
      { time: '09:00 AM', title: { en: 'Roadmaps to Premier Central Universities', ml: 'പ്രമുഖ സർവകലാശാലകളിലേക്കുള്ള വഴികൾ', ar: 'طريقك إلى الجامعات المرموقة' }, speaker: 'University Professors & Alumni', type: 'Panel' },
      { time: '02:30 PM', title: { en: 'Mastering Academic Research & Writing', ml: 'അക്കാദമിക് ഗവേഷണ രീതികൾ', ar: 'مهارات البحث العلمي والكتابة الأكاديمية' }, type: 'Workshop' },
      { time: '07:30 PM', title: { en: 'International Scholarships (Al-Azhar, UK, Gulf, EU)', ml: 'വിദേശ സ്കോളർഷിപ്പുകൾ', ar: 'المنح الدولية في الأزهر وأوروبا والخليج' }, type: 'Mentorship' },
    ],
  },
  {
    dayNumber: 5,
    date: '2026-12-28',
    dateFormatted: { en: 'Monday, Dec 28, 2026', ml: '2026 ഡിസംബർ 28, തിങ്കൾ', ar: 'الإثنين، 28 ديسمبر 2026' },
    title: { en: 'Ethical Leadership & Public Service', ml: 'ധാർമ്മിക നേതൃത്വവും സേവനവും', ar: 'القيادة الرشيدة والخدمة' },
    arabicName: 'الأفق الخامس: القيادة الرشيدة والخدمة',
    tagline: { en: 'Leading with Conscience', ml: 'മനസ്സാക്ഷിയോടെ നയിക്കുക', ar: 'قيادة بالضمير وأمانة الرسالة' },
    theme: {
      en: 'Civil services (UPSC/KPSC), public administration, grassroots social work, and institutional governance.',
      ml: 'സിവിൽ സർവീസ്, ഭരണരംഗം, സാമൂഹിക സേവനം, സംഘടനാ നേതൃത്വം.',
      ar: 'الخدمة المدنية، والإدارة العامة، والعمل المجتمعي، وبناء المؤسسات الرائدة.',
    },
    color: '#527a70',
    highlights: {
      en: ['Civil Servants’ Dialogue: Faith in Administration', 'Community Problem Solving Labs', 'The Art of Institutional Building'],
      ml: ['സിവിൽ സർവീസ് ഉദ്യോഗസ്ഥരുമായുള്ള സംവാദം', 'സാമൂഹിക പ്രശ്ന പരിഹാര ലാബ്', 'സ്ഥാപന നിർമ്മിതിയുടെ കല'],
      ar: ['حوار مع موظفي الخدمة المدنية والقضاء', 'مختبر حل مشكلات المجتمع', 'فن الإدارة وبناء المؤسسات المستدامة'],
    },
    sessions: [
      { time: '09:00 AM', title: { en: 'Serving the Nation: UPSC & Competitive Arenas', ml: 'സിവിൽ സർവീസ്: തയ്യാറെടുപ്പുകൾ', ar: 'خدمة المجتمع عبر الإدارة المدنية' }, speaker: 'IAS/IPS Mentors', type: 'Keynote' },
      { time: '02:00 PM', title: { en: 'NGO Management & Humanitarian Action', ml: 'സന്നദ്ധ പ്രവർത്തനവും മാനേജ്‌മെന്റും', ar: 'إدارة المنظمات والعمل الإنساني' }, type: 'Workshop' },
      { time: '08:00 PM', title: { en: 'Ethics in High Places: A Scholar’s Compass', ml: 'നേതൃത്വത്തിലെ ധാർമ്മികത', ar: 'البوصلة الأخلاقية في المناصب العامة' }, type: 'Halqa' },
    ],
  },
  {
    dayNumber: 6,
    date: '2026-12-29',
    dateFormatted: { en: 'Tuesday, Dec 29, 2026', ml: '2026 ഡിസംബർ 29, ചൊവ്വ', ar: 'الثلاثاء، 29 ديسمبر 2026' },
    title: { en: 'Creative Expression & Discourse', ml: 'രചനാത്മകതയും സംവേദനവും', ar: 'البيان والتعبير الإبداعي' },
    arabicName: 'الأفق السادس: البيان والتعبير الإبداعي',
    tagline: { en: 'The Power of the Word', ml: 'വാക്കിന്റെ കരുത്ത്', ar: 'سلطان البيان وبلاغة الرسالة' },
    theme: {
      en: 'Bilingual journalism, translation craftsmanship, public speaking, podcasting, and digital content creation.',
      ml: 'മാധ്യമപ്രവർത്തനം, വിവർത്തന കല, പ്രഭാഷണം, പോഡ്‌കാസ്റ്റ്, ഡിജിറ്റൽ എഴുത്ത്.',
      ar: 'الصحافة الواعية، وفن الترجمة، والخطابة، وصناعة المحتوى الهادف والمؤثر.',
    },
    color: '#d4b577',
    highlights: {
      en: ['Public Oratory & Debate Masterclass', 'The Craft of Literary & Scholarly Translation', 'Podcasting & Creative Digital Media Lab'],
      ml: ['പ്രഭാഷണ കല & സംവാദം മാസ്റ്റർക്ലാസ്സ്', 'വിവർത്തന കല', 'പോഡ്‌കാസ്റ്റ് & ഡിജിറ്റൽ മീഡിയ ലാബ്'],
      ar: ['دورة احترافية في الخطابة والمناظرة', 'صنعة الترجمة الأدبية والعلمية', 'مختبر البودكاست والإعلام الرقمي الإبداعي'],
    },
    sessions: [
      { time: '09:00 AM', title: { en: 'Eloquence in Arabic & English: Speaking to the World', ml: 'ആഗോള ഭാഷകളിലെ സംവേദനക്ഷമത', ar: 'البلاغة المعاصرة: مخاطبة العالم' }, type: 'Keynote' },
      { time: '02:30 PM', title: { en: 'Hands-on Media Studio: From Idea to Article', ml: 'മീഡിയ സ്റ്റുഡിയോ: എഴുത്ത് ശില്പശാല', ar: 'استوديو الكتابة: من الفكرة إلى النشر' }, type: 'Workshop' },
      { time: '08:00 PM', title: { en: 'Mushairah & Cultural Halqa: Tradition Alive', ml: 'സാഹിത്യ സദസ്സ്', ar: 'أمسية أدبية وشعرية: عبق التراث' }, type: 'Halqa' },
    ],
  },
  {
    dayNumber: 7,
    date: '2026-12-30',
    dateFormatted: { en: 'Wednesday, Dec 30, 2026', ml: '2026 ഡിസംബർ 30, ബുധൻ', ar: 'الأربعاء، 30 ديسمبر 2026' },
    title: { en: 'The Horizon Commission', ml: 'മുന്നേറ്റവും പ്രതിജ്ഞയും', ar: 'الانطلاق وأمانة المستقبل' },
    arabicName: 'الأفق السابع: الانطلاق وأمانة المستقبل',
    tagline: { en: 'Stepping into the Future', ml: 'ഭാവിയിലേക്കുള്ള യാത്ര', ar: 'الانطلاق نحو الغد بأمانة العلم' },
    theme: {
      en: 'Valedictory grand assembly, graduation commissioning, personal pledge, and enduring mentorship networks.',
      ml: 'സമാപന മഹാസമ്മേളനം, പ്രതിജ്ഞ, പൂർവവിദ്യാർത്ഥി ശൃംഖല രൂപീകരണം.',
      ar: 'الحفل الختامي الكبير، وميثاق التخرج، وعهد الأمانة، وتأسيس شبكة الخريجين.',
    },
    color: '#c9a45c',
    highlights: {
      en: ['Grand Valedictory Assembly with Senior Scholars', 'UFUQ ’26 Delegate Horizon Commissioning', 'Prayer of Departure (Dua) & Fellowship Launch'],
      ml: ['പണ്ഡിതന്മാരുടെ സാന്നിധ്യത്തിൽ സമാപന സംഗമം', 'പ്രതിജ്ഞാ ചടങ്ങ്', 'പ്രാർത്ഥന & യാത്രയയപ്പ്'],
      ar: ['المؤتمر الختامي الحاشد بحضور كبار العلماء', 'إعلان وثيقة المندوبين وتكريم المشاركين', 'دعاء الختام وتدشين شبكة أفق للتواصل'],
    },
    sessions: [
      { time: '09:00 AM', title: { en: 'Final Synthesis: Your Personal Transition Blueprint', ml: 'വ്യക്തിഗത കർമ്മപദ്ധതി രൂപീകരണം', ar: 'صياغة خطتك الشخصية للانتقال' }, type: 'Workshop' },
      { time: '02:00 PM', title: { en: 'Grand Valedictory & Horizon Awards', ml: 'സമാപന സമ്മേളനവും പുരസ്കാര സമർപ്പണവും', ar: 'الحفل الختامي الكبير وتكريم المتفوقين' }, speaker: 'State & National Dignitaries', type: 'Keynote' },
      { time: '05:00 PM', title: { en: 'Solemn Supplication (Dua) & Farewell', ml: 'പ്രാർത്ഥനാ സദസ്സ് & യാത്രയയപ്പ്', ar: 'دعاء الختام وتوديع المندوبين' }, type: 'Halqa' },
    ],
  },
];

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'admission-1',
    category: 'admission',
    text: { en: 'Confirm Online Registration & Reference ID', ml: 'ഓൺലൈൻ രജിസ്ട്രേഷൻ റഫറൻസ് ഐഡി സ്ഥിരീകരിക്കുക', ar: 'تأكيد التسجيل الإلكتروني ورمز المندوب' },
    detail: { en: 'Ensure your application status displays "Approved / Verified" in the portal.', ml: 'പോർട്ടലിൽ നിങ്ങളുടെ സ്റ്റാറ്റസ് "Approved" ആണെന്ന് ഉറപ്പുവരുത്തുക.', ar: 'تأكد من أن حالة طلبك تظهر بصفة "معتمد" في النظام.' },
    isRequired: true,
  },
  {
    id: 'admission-2',
    category: 'admission',
    text: { en: 'Secure Dars Mudarris Endorsement Letter', ml: 'ദർസ് മുദരിസ്സിന്റെ അനുമതിപത്രം കൈവശം വെക്കുക', ar: 'الحصول على تزكية شيخ الحلقة وموافقته' },
    detail: { en: 'A signed letter or digital confirmation from your Sadar Mudarris is mandatory.', ml: 'സദർ മുദരിസ്സ് ഒപ്പിട്ട സാക്ഷ്യപത്രം അത്യന്താപേക്ഷിതമാണ്.', ar: 'خطاب موقع أو تزكية رقمية من أستاذ الحلقة شرط أساسي.' },
    isRequired: true,
  },
  {
    id: 'packing-1',
    category: 'packing',
    text: { en: 'Pack 4–5 Sets of Formal White Dars Attire', ml: '4-5 ജോടി വെള്ള വസ്ത്രങ്ങൾ കരുതുക', ar: 'تجهيز 4 إلى 5 أطقم من اللباس الأبيض' },
    detail: { en: 'Traditional modest attire (white kurta/thobe and mundu/shawl) for halqas.', ml: 'സെഷനുകൾക്ക് അനുയോജ്യമായ മാന്യമായ വെള്ള വസ്ത്രങ്ങൾ.', ar: 'اللباس الأبيض الساتر المعتاد لمجالس العلم والصلاة.' },
    isRequired: true,
  },
  {
    id: 'packing-2',
    category: 'packing',
    text: { en: 'Personal Toiletries, Towels & Bedding Sheet', ml: 'വ്യക്തിഗത ആവശ്യത്തിനുള്ള വസ്തുക്കളും ഷീറ്റും', ar: 'المستلزمات الشخصية والمناشف والغطاء' },
    detail: { en: 'Mattresses are provided; delegates are requested to bring personal bedsheets.', ml: 'മെത്ത ക്യാമ്പസിൽ ലഭ്യമാണ്; ബെഡ്ഷീറ്റുകൾ സ്വയം കരുതുക.', ar: 'تتوفر المراتب بالسكن؛ ويُرجى إحضار غطاء شخصي.' },
    isRequired: false,
  },
  {
    id: 'academic-1',
    category: 'academic',
    text: { en: 'Hardbound Notebook & Dedicated Writing Instruments', ml: 'കുറിപ്പുകൾക്കായി നോട്ട്ബുക്കും പേനയും', ar: 'دفتر ملاحظات مقوى وأقلام تدوين ممتازة' },
    detail: { en: 'For meticulous session notes and your personalized transition journal.', ml: 'ക്ലാസ്സ് നോട്ടുകളും വ്യക്തിഗത പ്ലാനിംഗും എഴുതിവെക്കാൻ.', ar: 'لتدوين فوائد المحاضرات ووضع خطتك المستقبلية.' },
    isRequired: true,
  },
  {
    id: 'academic-2',
    category: 'academic',
    text: { en: 'Updated Academic Resume / Mark Lists', ml: 'മാർക്ക് ലിസ്റ്റുകളും അക്കാദമിക് വിവരങ്ങളും', ar: 'كشوف الدرجات والسيرة الذاتية الأكاديمية' },
    detail: { en: 'For personalized evaluation during Day 4 Higher Education Clinics.', ml: 'നാലാം ദിനത്തിലെ കരിയർ ക്ലിനിക്കുകളിൽ പരിശോധിക്കാൻ.', ar: 'للاستفادة منها في عيادات التوجيه الجامعي باليوم الرابع.' },
    isRequired: false,
  },
  {
    id: 'travel-1',
    category: 'travel',
    text: { en: 'Confirm Inbound Train / Bus to Malappuram', ml: 'യാത്രാ ടിക്കറ്റുകൾ ഉറപ്പുവരുത്തുക', ar: 'تأكيد حجز تذاكر السفر إلى ملابورم' },
    detail: { en: 'Plan arrival at Alathurpadi campus prior to 04:00 PM on Dec 24, 2026.', ml: 'ഡിസംബർ 24 വൈകുന്നേരം 4 മണിക്ക് മുമ്പായി എത്താൻ ശ്രദ്ധിക്കുക.', ar: 'احرص على الوصول للحرم قبل الرابعة عصراً يوم 24 ديسمبر.' },
    isRequired: true,
  },
];

export const TRANSIT_HUBS: TransitHub[] = [
  {
    id: 'ccj',
    name: { en: 'Calicut International Airport (Karipur)', ml: 'കോഴിക്കോട് അന്താരാഷ്ട്ര വിമാനത്താവളം (കരിപ്പൂർ)', ar: 'مطار كاليكوت الدولي (كريبور)' },
    code: 'CCJ',
    distanceKm: 28,
    travelTime: { en: '~45 mins', ml: '~45 മിനിറ്റ്', ar: 'حوالي 45 دقيقة' },
    type: 'airport',
    routeDescription: {
      en: 'Via NH 966 directly through Kondotty and Malappuram bypass to Alathurpadi.',
      ml: 'കൊണ്ടോട്ടി - മലപ്പുറം ബൈപാസ് വഴി ദേശീയപാത 966-ലൂടെ അലാത്തുർപടിയിലേക്ക്.',
      ar: 'عبر الطريق الوطني السريع 966 مروراً بكوندوتي ومحيط ملابورم وصولاً لألاطوربادي.',
    },
    recommendedTransport: { en: 'Prepaid Taxi or ADSA Welcome Shuttle', ml: 'പ്രീപെയ്ഡ് ടാക്സി അല്ലെങ്കിൽ അഡ്സ ഷട്ടിൽ', ar: 'سيارة أجرة المطار أو حافلة الاستقبال التابعة للمخيم' },
  },
  {
    id: 'angadipuram',
    name: { en: 'Angadipuram Railway Station', ml: 'അങ്ങാടിപ്പുറം റെയിൽവേ സ്റ്റേഷൻ', ar: 'محطة قطار أفراديبورام' },
    code: 'AAM',
    distanceKm: 14,
    travelTime: { en: '~25 mins', ml: '~25 മിനിറ്റ്', ar: 'حوالي 25 دقيقة' },
    type: 'railway',
    routeDescription: {
      en: 'Via State Highway 71 directly to Alathurpadi junction.',
      ml: 'സ്റ്റേറ്റ് ഹൈവേ 71 വഴി നേരിട്ട് അലാത്തുർപടി ജംഗ്ഷനിലേക്ക്.',
      ar: 'عبر الطريق الإقليمي 71 مباشرة إلى تقاطع مجمع ألاطوربادي.',
    },
    recommendedTransport: { en: 'KSRTC Bus or Auto-rickshaw', ml: 'കെ.എസ്.ആർ.ടി.സി ബസ് അല്ലെങ്കിൽ ഓട്ടോ', ar: 'حافلات النقل العامة أو مركبة التوك توك' },
  },
  {
    id: 'tirur',
    name: { en: 'Tirur Main Railway Station', ml: 'തിരൂർ പ്രധാന റെയിൽവേ സ്റ്റേഷൻ', ar: 'محطة قطار تيرور المركزية' },
    code: 'TIR',
    distanceKm: 32,
    travelTime: { en: '~50 mins', ml: '~50 മിനിറ്റ്', ar: 'حوالي 50 دقيقة' },
    type: 'railway',
    routeDescription: {
      en: 'Major rail stop on Chennai-Mangalore main line with frequent express connections.',
      ml: 'പ്രധാന എക്സ്പ്രസ് ട്രെയിനുകൾ നിർത്തുന്ന മലപ്പുറത്തെ പ്രധാന റെയിൽവേ സ്റ്റേഷൻ.',
      ar: 'المحطة المركزية الكبرى على خط تشيناي-منجلور مع قطارات سريعة متكررة.',
    },
    recommendedTransport: { en: 'Frequent direct buses to Malappuram depot', ml: 'മലപ്പുറത്തേക്കുള്ള നേരിട്ടുള്ള ബസുകൾ', ar: 'حافلات مباشرة متكررة إلى محطة حافلات ملابورم' },
  },
  {
    id: 'malappuram-ksrtc',
    name: { en: 'Malappuram KSRTC Central Depot', ml: 'മലപ്പുറം കെ.എസ്.ആർ.ടി.സി ബസ് സ്റ്റേഷൻ', ar: 'محطة حافلات ملابورم المركزية' },
    code: 'MLP',
    distanceKm: 4.5,
    travelTime: { en: '~10 mins', ml: '~10 മിനിറ്റ്', ar: 'حوالي 10 دقائق' },
    type: 'bus',
    routeDescription: {
      en: 'Frequent local buses and autorickshaws connect directly to the campus gate.',
      ml: 'ക്യാമ്പസ് ഗേറ്റിലേക്ക് സർവീസ് നടത്തുന്ന നിരവധിയായ ലോക്കൽ ബസുകളും ഓട്ടോകളും.',
      ar: 'حافلات محلية وسيارات أجرة متوفرة على مدار الساعة إلى بوابة الحرم مباشرة.',
    },
    recommendedTransport: { en: 'Local Town Bus or Shared Auto', ml: 'ടൗൺ ബസ് അല്ലെങ്കിൽ ഓട്ടോ', ar: 'حافلة المدينة أو سيارة أجرة' },
  },
];

export const KEYBOARD_SHORTCUTS: ShortcutItem[] = [
  { keys: ['⌘', 'K'], description: { en: 'Open Global Search Palette', ml: 'സ്മാർട്ട് സെർച്ച് തുറക്കുക', ar: 'فتح شريط البحث الفوري' }, category: 'discovery' },
  { keys: ['?'], description: { en: 'Toggle Keyboard Shortcuts HUD', ml: 'ഷോർട്ട്കട്ട് സഹായി തുറക്കുക', ar: 'عرض اختصارات لوحة المفاتيح' }, category: 'navigation' },
  { keys: ['M'], description: { en: 'Toggle Ambient Soundscape', ml: 'പശ്ചാത്തല സംഗീതം ഓൺ/ഓഫ്', ar: 'تشغيل أو كتم المشغل الصوتي' }, category: 'audio' },
  { keys: ['Esc'], description: { en: 'Close active modal / dialog', ml: 'വിൻഡോ ക്ലോസ് ചെയ്യുക', ar: 'إغلاق النافذة النشطة' }, category: 'modal' },
  { keys: ['T'], description: { en: 'Launch In-App Feature Tour', ml: 'ഇന്ററാക്ടീവ് ടൂർ ആരംഭിക്കുക', ar: 'بدء الجولة التفاعلية' }, category: 'navigation' },
];

export const IN_APP_TOUR_STEPS: TourStep[] = [
  {
    targetSelector: '[data-tour="brand"]',
    title: { en: 'Welcome to UFUQ ’26', ml: 'അുഫുഖ് ’26-ലേക്ക് സ്വാഗതം', ar: 'مرحباً بكم في أُفُق ’26' },
    content: {
      en: 'The digital flagship for the seven-day transition camp organized by ADSA at Alathurpadi Dars Campus.',
      ml: 'അലാത്തുർപടി ക്യാമ്പസിൽ നടക്കുന്ന 7 ദിന അഡ്സ ട്രാൻസിഷൻ ക്യാമ്പിന്റെ ഔദ്യോഗിക പ്ലാറ്റ്‌ഫോം.',
      ar: 'المنصة الرقمية الرسمية لمخيم الانتقال والريادة الطلابي المنظم من قبل جمعية أدسا.',
    },
    placement: 'bottom',
  },
  {
    targetSelector: '[data-tour="search"]',
    title: { en: 'Lightning Search (⌘K)', ml: 'സ്മാർട്ട് സെർച്ച് (⌘K)', ar: 'البحث الفوري الشامل' },
    content: {
      en: 'Instantly find sessions, speakers, campus facilities, and frequently asked questions.',
      ml: 'സെഷനുകൾ, അതിഥികൾ, ക്യാമ്പസ് വിവരങ്ങൾ എന്നിവ ഞൊടിയിടയിൽ കണ്ടെത്താം.',
      ar: 'ابحث في الجداول، وقائمة الضيوف، ومرافق الحرم، والأسئلة الشائعة بنقرة واحدة.',
    },
    placement: 'bottom',
  },
  {
    targetSelector: '[data-tour="audio"]',
    title: { en: 'Contemplative Soundscape', ml: 'ആംബിയന്റ് സൗണ്ട്‌സ്കേപ്പ്', ar: 'المشغل الصوتي الروحاني' },
    content: {
      en: 'Immerse in peaceful background tracks with live spectrum visualization while you read.',
      ml: 'വായനക്കൊപ്പം കേൾക്കാൻ ശാന്തമായ പശ്ചാത്തല സംഗീതവും ലൈവ് സൗണ്ട് ബാറുകളും.',
      ar: 'استمتع بمقاطع صوتية روحانية هادئة مع مؤثرات بصرية حية لموجات الصوت.',
    },
    placement: 'bottom',
  },
  {
    targetSelector: '[data-tour="language"]',
    title: { en: 'Trilingual Mastery', ml: 'ഭാഷാ തിരഞ്ഞെടുപ്പ്', ar: 'التصفح بثلاث لغات' },
    content: {
      en: 'Seamlessly switch between English, Malayalam, and authentic right-to-left Arabic.',
      ml: 'ഇംഗ്ലീഷ്, മലയാളം, അറബിക് ഭാഷകളിലേക്ക് എളുപ്പത്തിൽ മാറുക.',
      ar: 'تنقل بسلاسة بين العربية الأصيلة والإنجليزية والمليبارية مع دعم اتجاه القراءة.',
    },
    placement: 'bottom',
  },
  {
    targetSelector: '[data-tour="register-cta"]',
    title: { en: 'Delegate Registration', ml: 'വിദ്യാർത്ഥി രജിസ്ട്രേഷൻ', ar: 'تسجيل المندوبين' },
    content: {
      en: 'Graduating students can enroll through verified SUFFA Dars institutions and verify their pass.',
      ml: 'അംഗീകൃത സുഫാ ദർസുകളിലെ വിദ്യാർത്ഥികൾക്ക് ഇവിടെ രജിസ്റ്റർ ചെയ്യാം.',
      ar: 'يمكن لطلاب حلقات الصفة المتخرجين التسجيل والحصول على رمز الاعتماد الرسمي هنا.',
    },
    placement: 'top',
  },
  {
    targetSelector: '[data-tour="unified-login"]',
    title: { en: 'Portal Access Gateways', ml: 'പോർട്ടൽ ലോഗിൻ', ar: 'بوابات الدخول المعتمدة' },
    content: {
      en: 'Dedicated gateways for Dars Mudarris coordinators (/dars) and ADSA camp organizers (/admin).',
      ml: 'ദർസ് അധ്യാപകർക്കും അഡ്മിൻ സംഘാടകർക്കുമുള്ള പ്രത്യേക പോർട്ടൽ പ്രവേശന കവാടം.',
      ar: 'بوابة موحدة لدخول مسؤولي الحلقات المعتمدة (/dars) ولجنة التنظيم المركزية (/admin).',
    },
    placement: 'bottom',
  },
];
