export function dayKey(date, tz = 'Asia/Kolkata') {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

export function lastNDays(n, tz = 'Asia/Kolkata') {
  const days = [];
  const now = Date.now();
  for (let i = n - 1; i >= 0; i--) days.push(dayKey(new Date(now - i * 86400000), tz));
  return days;
}
