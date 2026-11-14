/**
 * RFC 6350 vCard 4.0 Contact Generator
 * Allows attendees and organizers to save Keynote Scholars, Mentors, and Helplines with 1 click.
 */

export interface VCardContact {
  id?: string;
  fullName: string;
  prefix?: string; // e.g. "Usthad", "Dr.", "Prof."
  role?: string;   // e.g. "Keynote Scholar / Mentor"
  organization?: string; // e.g. "ADSA / UFUQ ’26"
  phone?: string;
  email?: string;
  url?: string;
  address?: string;
  note?: string;
}

export function formatContactToVCard(contact: VCardContact): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:4.0',
    `FN:${contact.prefix ? `${contact.prefix} ` : ''}${contact.fullName}`,
    `N:;${contact.fullName};;;${contact.prefix || ''}`,
    `ORG:${contact.organization || 'UFUQ ’26 Transition & Leadership Camp;ADSA Alathurpadi'}`,
  ];

  if (contact.role) {
    lines.push(`TITLE:${contact.role}`);
  }

  if (contact.phone) {
    const cleanPh = contact.phone.replace(/[^\d+]/g, '');
    lines.push(`TEL;TYPE=cell,voice:${cleanPh}`);
  }

  if (contact.email) {
    lines.push(`EMAIL;TYPE=work:${contact.email}`);
  }

  if (contact.url) {
    lines.push(`URL:${contact.url}`);
  }

  if (contact.address) {
    lines.push(`ADR;TYPE=work:;;${contact.address};Malappuram;Kerala;676503;India`);
  } else {
    lines.push('ADR;TYPE=work:;;Alathurpadi Dars Campus;Malappuram;Kerala;676503;India');
  }

  if (contact.note) {
    lines.push(`NOTE:${contact.note.replace(/\n/g, '\\n')}`);
  }

  lines.push('CATEGORIES:UFUQ 2026,Camp Faculty,ADSA');
  lines.push('END:VCARD');

  return lines.join('\r\n');
}
