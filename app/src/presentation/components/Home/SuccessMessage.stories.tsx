import type { Meta, StoryObj } from '@storybook/react'
import { SuccessMessage } from './SuccessMessage'

const meta = {
  title: 'Home/SuccessMessage',
  component: SuccessMessage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SuccessMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Visible: Story = {
  args: {
    visible: true,
    amount: 800,
  },
}

export const Hidden: Story = {
  args: {
    visible: false,
    amount: 800,
  },
}

export const LargeAmount: Story = {
  args: {
    visible: true,
    amount: 15000,
  },
}

export const SmallAmount: Story = {
  args: {
    visible: true,
    amount: 100,
  },
}
