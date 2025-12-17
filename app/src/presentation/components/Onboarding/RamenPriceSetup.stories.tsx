import type { Meta, StoryObj } from '@storybook/react'
import { RamenPriceSetup } from './RamenPriceSetup'

const meta = {
  title: 'Onboarding/RamenPriceSetup',
  component: RamenPriceSetup,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    onComplete: () => {},
  },
} satisfies Meta<typeof RamenPriceSetup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const CustomDefaultPrice: Story = {
  args: {
    defaultPrice: 1000,
  },
}
