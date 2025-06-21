import { expect, test } from 'vitest';
import { getNextPage } from './useEvents';

test('getNextPage returns cursor', () => {
  expect(getNextPage({ nextCursor: 'abc' })).toBe('abc');
  expect(getNextPage({})).toBeUndefined();
});
