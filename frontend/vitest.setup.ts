// 1) jest-dom matchers
import '@testing-library/jest-dom/vitest'

// 2) put React on the global object for old-style compiled output
import React from 'react'
globalThis.React = React

// -- mock HTMLCanvasElement ---------------------------------------------------
import { vi } from 'vitest'

Object.defineProperty(global.HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => ({
    // METHODS YOUR COMPONENT TOUCHES
    clearRect: vi.fn(),
    fillRect : vi.fn(),
    beginPath: vi.fn(),
    arc      : vi.fn(),
    stroke   : vi.fn(),
    // PROPS IT READS/SETS (optional, makes TS happy)
    lineWidth   : 0,
    strokeStyle : '',
  })),
})
