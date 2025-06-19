import { describe, it, expect } from 'vitest';
import { trendColour } from './trendColour';

describe('trendColour', () => {
  it('returns green for big drop', () => {
    expect(trendColour(-30)).toBe('text-green-500');
  });
  it('returns amber for small change', () => {
    expect(trendColour(10)).toBe('text-amber-500');
  });
  it('returns red for increase', () => {
    expect(trendColour(50)).toBe('text-red-500');
  });
});
