import type { Meta, StoryObj } from '@storybook/react'
import { OnboardingFlow } from './OnboardingFlow'

// Mock InitializeUserProfileUseCase
const mockInitializeUserProfileUseCase = {
  execute: async () => ({
    id: 'mock-id',
    ramenPrice: 800,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
}

const meta = {
  title: 'Onboarding/OnboardingFlow',
  component: OnboardingFlow,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    initializeUserProfileUseCase: mockInitializeUserProfileUseCase as any,
    onComplete: () => {},
  },
} satisfies Meta<typeof OnboardingFlow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
