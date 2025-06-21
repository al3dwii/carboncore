import { render, screen } from '@testing-library/react'
import { GaugeCanvas } from '../GaugeCanvas'
import { describe, it, expect } from 'vitest'

describe('GaugeCanvas', () => {
  it('renders canvas and label', () => {
    const { container } = render(<GaugeCanvas value={50} dangerThreshold={40} unit="%" />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
    expect(screen.getByText(/%/)).toBeInTheDocument()
  })
})
