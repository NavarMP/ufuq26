import { MealSlot } from '@/types';

/**
 * Standard Meal Schedule for UFUQ '26 (Dec 24–30, 2026)
 * Alathurpadi Dars Campus
 */
export const CAMP_DAYS = [
  { day: 1, date: '2026-12-24', label: 'Day 1 (Inauguration & Arrival)' },
  { day: 2, date: '2026-12-25', label: 'Day 2 (Foundational Lectures)' },
  { day: 3, date: '2026-12-26', label: 'Day 3 (Academic Workshops)' },
  { day: 4, date: '2026-12-27', label: 'Day 4 (Civil Services & Leadership)' },
  { day: 5, date: '2026-12-28', label: 'Day 5 (Research & Discourse)' },
  { day: 6, date: '2026-12-29', label: 'Day 6 (Alumni Colloquium)' },
  { day: 7, date: '2026-12-30', label: 'Day 7 (Graduation & Valedictory)' },
];

export const MEAL_TYPES = [
  { type: 'breakfast' as const, label: 'Breakfast', startTime: '07:30', endTime: '09:30' },
  { type: 'lunch' as const, label: 'Lunch & Feast', startTime: '12:30', endTime: '15:00' },
  { type: 'tea' as const, label: 'Evening Refreshment', startTime: '16:30', endTime: '17:45' },
  { type: 'dinner' as const, label: 'Dinner', startTime: '19:45', endTime: '22:00' },
];

export function getAllMealSlots(): MealSlot[] {
  const slots: MealSlot[] = [];
  CAMP_DAYS.forEach((d) => {
    MEAL_TYPES.forEach((m) => {
      slots.push({
        id: `day${d.day}_${m.type}`,
        label: `${d.label} - ${m.label}`,
        day: d.day,
        type: m.type,
        date: d.date,
        startTime: m.startTime,
        endTime: m.endTime,
      });
    });
  });
  return slots;
}

/**
 * Determines current active meal slot (or nearest upcoming slot)
 */
export function getActiveMealSlot(now: Date = new Date()): MealSlot {
  const allSlots = getAllMealSlots();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // 1. Check exact match by date & time
  const exact = allSlots.find((s) => s.date === dateStr && timeStr >= s.startTime && timeStr <= s.endTime);
  if (exact) return exact;

  // 2. Check match by date
  const todaySlots = allSlots.filter((s) => s.date === dateStr);
  if (todaySlots.length > 0) {
    const upcoming = todaySlots.find((s) => timeStr < s.startTime);
    if (upcoming) return upcoming;
    return todaySlots[todaySlots.length - 1];
  }

  // 3. Fallback: Day 1 Lunch
  return allSlots[1] || allSlots[0];
}
