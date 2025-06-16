import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
};
export default meta;

export const Default: StoryObj<typeof Switch> = {
  args: {},
};
