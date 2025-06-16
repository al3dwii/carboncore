import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
};
export default meta;

export const Default: StoryObj<typeof Badge> = {
  args: { children: 'Badge' },
};
