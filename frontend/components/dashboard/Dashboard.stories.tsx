import type { Meta, StoryObj } from '@storybook/react'
import Dashboard from '../../app/(dashboard)/page'

const meta: Meta<typeof Dashboard> = {
  title: 'Dashboard/Dashboard',
  component: Dashboard,
}
export default meta

export const Default: StoryObj<typeof Dashboard> = {}
