import type { Meta, StoryObj } from '@storybook/react'
import { SavingsDisplay } from './SavingsDisplay'

const meta = {
  title: 'Home/SavingsDisplay',
  component: SavingsDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SavingsDisplay>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    totalSavings: 5000,
    monthlySavings: 2000,
  },
}

export const Zero: Story = {
  args: {
    totalSavings: 0,
    monthlySavings: 0,
  },
}

export const LargeAmounts: Story = {
  args: {
    totalSavings: 1234567,
    monthlySavings: 123456,
  },
}

export const SmallAmounts: Story = {
  args: {
    totalSavings: 100,
    monthlySavings: 50,
  },
}
