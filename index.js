// US federal holidays (5 U.S.C. 6103) and business-day maths. No dependencies.
// Weekend rule: a Saturday holiday is observed the Friday before, a Sunday holiday the Monday after
// (OPM federal holiday schedule). Dates are plain "YYYY-MM-DD" strings, read as calendar days with no time zone.
// More date tools: https://datesahead.com/

const DAY = 86400000;
const toUTC = (iso) => { const [y, m, d] = iso.split("-").map(Number); return Date.UTC(y, m - 1, d); };
const toIso = (t) => new Date(t).toISOString().slice(0, 10);
const wd = (t) => new Date(t).getUTCDay();

function nthWeekday(y, m, weekday, n) {
  const first = Date.UTC(y, m - 1, 1);
  return first + (((weekday - wd(first) + 7) % 7) + (n - 1) * 7) * DAY;
}
function lastWeekday(y, m, weekday) {
  const last = Date.UTC(y, m, 0);
  return last - ((wd(last) - weekday + 7) % 7) * DAY;
}
function observed(t) {
  const w = wd(t);
  return w === 6 ? t - DAY : w === 0 ? t + DAY : t;
}

/** The eleven federal holidays whose legal date falls in `year`, with the weekday actually taken off. */
export function federalHolidays(year) {
  const list = [
    ["New Year's Day", Date.UTC(year, 0, 1)],
    ["Birthday of Martin Luther King, Jr.", nthWeekday(year, 1, 1, 3)],
    ["Washington's Birthday (Presidents Day)", nthWeekday(year, 2, 1, 3)],
    ["Memorial Day", lastWeekday(year, 5, 1)],
    ["Juneteenth National Independence Day", Date.UTC(year, 5, 19)],
    ["Independence Day", Date.UTC(year, 6, 4)],
    ["Labor Day", nthWeekday(year, 9, 1, 1)],
    ["Columbus Day", nthWeekday(year, 10, 1, 2)],
    ["Veterans Day", Date.UTC(year, 10, 11)],
    ["Thanksgiving Day", nthWeekday(year, 11, 4, 4)],
    ["Christmas Day", Date.UTC(year, 11, 25)],
  ];
  return list.map(([name, t]) => ({ name, date: toIso(t), observed: toIso(observed(t)) }));
}

const cache = new Map();
function observedSet(year) {
  if (!cache.has(year)) {
    const all = [...federalHolidays(year - 1), ...federalHolidays(year), ...federalHolidays(year + 1)];
    cache.set(year, new Map(all.filter((h) => h.observed.startsWith(String(year))).map((h) => [h.observed, h.name])));
  }
  return cache.get(year);
}

/** Name of the federal holiday observed on this date, or null. */
export function holidayOn(iso) {
  return observedSet(Number(iso.slice(0, 4))).get(iso) ?? null;
}

/** Monday to Friday and not an observed federal holiday. */
export function isBusinessDay(iso, skipHolidays = true) {
  const w = wd(toUTC(iso));
  return w !== 0 && w !== 6 && !(skipHolidays && holidayOn(iso));
}

/** Date n business days after `iso` (not counting `iso` itself). Negative n goes back. */
export function addBusinessDays(iso, n, skipHolidays = true) {
  const step = n < 0 ? -DAY : DAY;
  let left = Math.abs(n), t = toUTC(iso);
  while (left > 0) { t += step; if (isBusinessDay(toIso(t), skipHolidays)) left--; }
  return toIso(t);
}

/** Business days after `from` up to and including `to`. */
export function businessDaysBetween(from, to, skipHolidays = true) {
  let a = toUTC(from), b = toUTC(to), sign = 1;
  if (b < a) { [a, b] = [b, a]; sign = -1; }
  let n = 0;
  for (let t = a + DAY; t <= b; t += DAY) if (isBusinessDay(toIso(t), skipHolidays)) n++;
  return sign * n;
}
