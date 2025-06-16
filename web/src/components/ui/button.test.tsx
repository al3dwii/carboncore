import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Button } from './button';

test('renders and is accessible', async () => {
  const { container } = render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  expect(await axe(container)).toHaveNoViolations();
});
