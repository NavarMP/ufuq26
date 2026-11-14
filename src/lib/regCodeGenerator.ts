import { Registration, AttendeeCategory } from '@/types';

/**
 * Calculates a Modulo-10 Luhn-variant checksum digit for a string
 */
export function calculateCheckDigit(input: string): string {
  const clean = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let sum = 0;
  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i);
    const weight = i % 2 === 0 ? 1 : 2;
    sum += code * weight;
  }
  return String(sum % 10);
}

/**
 * Normalizes Dars Registration Number for the code
 */
export function normalizeDarsCode(darsRegNo?: string): string {
  if (!darsRegNo) return 'GEN00';
  const clean = darsRegNo.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return clean.slice(0, 8) || 'GEN00';
}

/**
 * Converts category into a 3-letter semantic code
 */
export function categoryToPrefix(category?: AttendeeCategory): string {
  switch (category) {
    case 'scholar':
      return 'SCH';
    case 'faculty':
      return 'FAC';
    case 'vip':
      return 'VIP';
    case 'organizer':
      return 'ORG';
    case 'volunteer':
      return 'VOL';
    case 'press':
      return 'PRS';
    case 'regular':
    case 'delegate':
    default:
      return 'DEL';
  }
}

/**
 * Generates a systematic, human-readable registration code:
 * Format: UF26-[CAT]-[DARS]-[SERIAL]-[CHECKSUM]
 * Example: UF26-SCH-SDC01-0042-7
 */
export function generateRegistrationCode(params: {
  category?: AttendeeCategory;
  darsRegNo?: string;
  sequenceNumber?: number;
  seedString?: string;
}): { regCode: string; checkDigit: string } {
  const catPrefix = categoryToPrefix(params.category || 'scholar');
  const darsCode = normalizeDarsCode(params.darsRegNo);

  // Serial: If sequence number is provided, pad to 4 digits, otherwise hash seedString
  let serial = '0001';
  if (params.sequenceNumber !== undefined && params.sequenceNumber > 0) {
    serial = String(params.sequenceNumber).padStart(4, '0');
  } else if (params.seedString) {
    let hash = 0;
    for (let i = 0; i < params.seedString.length; i++) {
      hash = (hash << 5) - hash + params.seedString.charCodeAt(i);
      hash |= 0;
    }
    serial = String(Math.abs(hash) % 10000).padStart(4, '0');
  } else {
    serial = String(Math.floor(1000 + Math.random() * 9000));
  }

  const base = `UF26-${catPrefix}-${darsCode}-${serial}`;
  const checkDigit = calculateCheckDigit(base);
  return {
    regCode: `${base}-${checkDigit}`,
    checkDigit,
  };
}

/**
 * Ensures any existing or newly registered entity has a valid systematic regCode
 */
export function ensureRegistrationCode(reg: Registration, index?: number): Registration {
  if (reg.regCode && reg.regCode.startsWith('UF26-')) {
    return {
      ...reg,
      gateStatus: reg.gateStatus || 'outside',
      totalCampusEntries: reg.totalCampusEntries || 0,
      attendedSessions: reg.attendedSessions || [],
      claimedMeals: reg.claimedMeals || {},
    };
  }

  // Derive from existing data or index
  const seed = reg.id || reg.phone || reg.fullName;
  const { regCode, checkDigit } = generateRegistrationCode({
    category: reg.category || 'scholar',
    darsRegNo: reg.darsRegNo,
    sequenceNumber: index !== undefined ? index + 1 : undefined,
    seedString: seed,
  });

  return {
    ...reg,
    legacyId: reg.legacyId || (reg.id.startsWith('REG-') ? reg.id : undefined),
    regCode,
    checkDigit,
    gateStatus: reg.gateStatus || 'outside',
    totalCampusEntries: reg.totalCampusEntries || 0,
    attendedSessions: reg.attendedSessions || [],
    claimedMeals: reg.claimedMeals || {},
  };
}

/**
 * Compact payload for QR Code generation
 */
export function encodeQRPayload(reg: Registration): string {
  const code = reg.regCode || reg.id;
  // Compact JSON payload
  const payload = {
    c: code,
    n: reg.fullName,
    d: reg.darsRegNo || 'GEN',
    k: reg.category || 'scholar',
    p: reg.phone.slice(-4),
    v: 'UF26',
  };
  return JSON.stringify(payload);
}

/**
 * Decodes scanned QR code or barcode string
 */
export function parseScannedCode(raw: string): {
  code: string;
  isStructuredJson: boolean;
  meta?: any;
} {
  const trimmed = raw.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.c) {
        return {
          code: String(parsed.c).toUpperCase(),
          isStructuredJson: true,
          meta: parsed,
        };
      }
    } catch {
      // Fall through to plain text
    }
  }

  // If plain text (e.g. 'UF26-SCH-SDC01-0042-7' or 'REG-XXX' or phone number)
  return {
    code: trimmed.toUpperCase(),
    isStructuredJson: false,
  };
}
