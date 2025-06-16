import type { Meta, StoryObj } from '@storybook/react';
import { NavLink } from './nav-link';

const meta: Meta<typeof NavLink> = {
  title: 'UI/NavLink',
  component: NavLink,
};
export default meta;

export const Default: StoryObj<typeof NavLink> = {
  args: { href: '#', children: 'Home' },
};
