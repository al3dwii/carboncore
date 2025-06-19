import { cn } from '@/lib/utils'
import { describe, test, expect } from 'vitest'

describe('cn utility', () => {
  test('returns class names', () => {
    expect(cn('a', false && 'b')).toBe('a')
  })
})
