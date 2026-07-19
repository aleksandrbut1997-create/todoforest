// Усі дати всередині додатку зберігаємо як "YYYY-MM-DD" у локальному часовому
// поясі користувача (без конвертації в UTC), щоб уникнути зсуву дня.

export function todayISO() {
  return toISODate(new Date());
}

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(isoDate, days) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return toISODate(dt);
}

const WEEKDAYS_UA = [
  "неділя",
  "понеділок",
  "вівторок",
  "середа",
  "четвер",
  "п'ятниця",
  "субота",
];

export function weekdayUA(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return WEEKDAYS_UA[dt.getDay()];
}

export function isOverdue(isoDate, todayIso) {
  if (!isoDate) return false;
  return isoDate < todayIso;
}

export function formatDueLabel(isoDate, todayIso) {
  if (!isoDate) return "без дати";
  if (isoDate === todayIso) return "сьогодні";
  if (isoDate === addDays(todayIso, 1)) return "завтра";
  if (isoDate === addDays(todayIso, -1)) return "вчора";
  return `${isoDate} (${weekdayUA(isoDate)})`;
}
