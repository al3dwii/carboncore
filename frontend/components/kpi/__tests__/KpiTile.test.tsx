import { render, screen } from '@testing-library/react'
import { KpiTile } from '../KpiTile'
import { describe, it, expect } from 'vitest'

describe('KpiTile', () => {
  it('renders label and value', () => {
    render(<KpiTile label="Users" value={100} />)
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })
})
