import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
};
export default meta;

export const Default: StoryObj<typeof Skeleton> = {
  args: { className: 'w-24 h-4' },
};
