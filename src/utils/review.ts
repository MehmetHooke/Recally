export function getNextIntervalAfterKnew(reviewCount: number) {
  if (reviewCount <= 1) return 1;
  if (reviewCount === 2) return 3;
  if (reviewCount === 3) return 7;
  if (reviewCount === 4) return 14;
  return 30;
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}
