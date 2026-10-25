const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
const MON = MONTHS.join("|");

export const toLocalISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const build = (day, month, year) => {
  const now = new Date();
  let y = year ?? now.getFullYear();
  if (y < 100) y += 2000;
  let d = new Date(y, month, day);
  if (d.getMonth() !== month || d.getDate() !== day) return null; // invalid date
  // no year given and date is in the future -> assume last year
  if (year == null && d > now) d = new Date(y - 1, month, day);
  return d;
};

// Returns { date: "YYYY-MM-DD", rest: text with the date words removed }
export function parseDate(text) {
  let t = text.toLowerCase();
  let m;

  if ((m = t.match(/day before yesterday/))) {
    return { date: toLocalISO(daysAgo(2)), rest: t.replace(m[0], " ") };
  }
  if ((m = t.match(/\byesterday\b/))) {
    return { date: toLocalISO(daysAgo(1)), rest: t.replace(m[0], " ") };
  }
  if ((m = t.match(/\btoday\b/))) {
    return { date: toLocalISO(new Date()), rest: t.replace(m[0], " ") };
  }
  if ((m = t.match(/(\d+)\s+days?\s+ago/))) {
    return { date: toLocalISO(daysAgo(Number(m[1]))), rest: t.replace(m[0], " ") };
  }

  // "20 october", "20th of oct"
  m = t.match(new RegExp(`(?:\\bon\\s+)?\\b(\\d{1,2})(?:st|nd|rd|th)?\\s*(?:of\\s+)?(${MON})[a-z]*\\b(?:\\s+(\\d{4}))?`));
  if (m) {
    const d = build(Number(m[1]), MONTHS.indexOf(m[2]), m[3] ? Number(m[3]) : null);
    if (d) return { date: toLocalISO(d), rest: t.replace(m[0], " ") };
  }

  // "october 20", "oct 20th"
  m = t.match(new RegExp(`(?:\\bon\\s+)?\\b(${MON})[a-z]*\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b(?:\\s+(\\d{4}))?`));
  if (m) {
    const d = build(Number(m[2]), MONTHS.indexOf(m[1]), m[3] ? Number(m[3]) : null);
    if (d) return { date: toLocalISO(d), rest: t.replace(m[0], " ") };
  }

  // "20/10" or "20-10-2026" (day first, as in India)
  m = t.match(/(?:\bon\s+)?\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/);
  if (m) {
    const d = build(Number(m[1]), Number(m[2]) - 1, m[3] ? Number(m[3]) : null);
    if (d) return { date: toLocalISO(d), rest: t.replace(m[0], " ") };
  }

  return { date: toLocalISO(new Date()), rest: t };
}