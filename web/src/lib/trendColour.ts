export function trendColour(delta: number) {
  if (delta < -20) return "text-green-500";
  if (delta <= 20) return "text-amber-500";
  return "text-red-500";
}
