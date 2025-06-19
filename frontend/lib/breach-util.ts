export const BREACH_LIMIT = 0.5; // kg CO₂ / 1 000 req
export function isBreach(v: { kgCo2PerK: number }) {
  return v.kgCo2PerK > BREACH_LIMIT;
}
