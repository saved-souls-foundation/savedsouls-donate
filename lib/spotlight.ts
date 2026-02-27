/**
 * Wekelijkse spotlight: roteer dieren vanaf het einde van de lijst.
 * Week 0 = laatste hond, week 1 = voorlaatste, enz. Idem voor katten.
 */

export function getISOWeekNumber(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // ma = 1, zo = 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
}

/** Index in de lijst (0 = eerste). We roteren vanaf het einde: laatste = index numDogs-1. */
export function getSpotlightDogIndex(weekNumber: number, numDogs: number): number {
  if (numDogs <= 0) return 0;
  return numDogs - 1 - (weekNumber % numDogs);
}

export function getSpotlightCatIndex(weekNumber: number, numCats: number): number {
  if (numCats <= 0) return 0;
  return numCats - 1 - (weekNumber % numCats);
}
