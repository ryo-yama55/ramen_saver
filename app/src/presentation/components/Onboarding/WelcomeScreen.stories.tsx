import type { Meta, StoryObj } from '@storybook/react'
import { WelcomeScreen } from './WelcomeScreen'

const meta = {
  title: 'Onboarding/WelcomeScreen',
  component: WelcomeScreen,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    onStart: () => {},
  },
} satisfies Meta<typeof WelcomeScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
