import { SharePayload } from '@/types/share';

/**
 * Appends standard UTM tracking parameters to a URL
 */
export function appendUtm(url: string, source: string, campaign: string = 'ufuq26_share'): string {
  try {
    const parsed = new URL(url, 'https://alathurpadidars.in');
    parsed.searchParams.set('utm_source', source);
    parsed.searchParams.set('utm_medium', 'share');
    parsed.searchParams.set('utm_campaign', campaign);
    return parsed.toString();
  } catch {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}utm_source=${source}&utm_medium=share&utm_campaign=${campaign}`;
  }
}

/**
 * Generates direct share URLs for popular social channels
 */
export function getSocialShareUrls(payload: SharePayload) {
  const { title, text, url } = payload;
  const description = text || 'Rooted in Ilm. Ready for the World. December 24–30, 2026 at Alathurpadi Dars Campus.';

  // Format WhatsApp message with nice Markdown bolding & links
  const whatsappUrl = appendUtm(url, 'whatsapp');
  const whatsappText = `🌟 *${title}*\n\n${description}\n\n🔗 Explore & Register: ${whatsappUrl}\n\n_أُفُق — UFUQ ’26 | Alathurpadi Dars Students Association (ADSA)_`;

  // Format Telegram message
  const telegramUrl = appendUtm(url, 'telegram');
  const telegramText = `🌟 ${title}\n\n${description}`;

  // Format X (Twitter) text
  const twitterUrl = appendUtm(url, 'twitter');
  const twitterText = `${title} — A week-long transition & leadership camp for SUFFA Dars students. December 24–30, 2026. #UFUQ26 #ADSA #SuffaDars`;

  // Format LinkedIn URL
  const linkedinUrl = appendUtm(url, 'linkedin');

  // Format Facebook Share URL
  const facebookUrl = appendUtm(url, 'facebook');

  // Format Email mailto link
  const emailSubject = encodeURIComponent(`${title} — UFUQ ’26`);
  const emailBody = encodeURIComponent(
    `Assalamu Alaikum,\n\nI wanted to share details about UFUQ ’26 — A Transition & Leadership Camp organized by Alathurpadi Dars Students Association (ADSA) for SUFFA Dars students:\n\n${title}\n${description}\n\nDates: December 24–30, 2026\nVenue: Alathurpadi Dars Campus, Malappuram, Kerala\n\nLearn more and register online at:\n${appendUtm(url, 'email')}\n\nRooted in Ilm. Ready for the World.`
  );

  // Format SMS link
  const smsBody = encodeURIComponent(`${title}: ${description} — Check it out at ${appendUtm(url, 'sms')}`);

  return {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(telegramUrl)}&text=${encodeURIComponent(telegramText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(twitterUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(linkedinUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(facebookUrl)}`,
    email: `mailto:?subject=${emailSubject}&body=${emailBody}`,
    sms: `sms:?body=${smsBody}`,
  };
}
