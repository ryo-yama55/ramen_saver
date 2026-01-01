import type { Meta, StoryObj } from '@storybook/react-vite'
import type { InitializeUserProfileUseCase } from '@/application/usecases/InitializeUserProfileUseCase'
import { OnboardingFlow } from './OnboardingFlow'

// Mock InitializeUserProfileUseCase
const mockInitializeUserProfileUseCase: InitializeUserProfileUseCase = {
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
    initializeUserProfileUseCase: mockInitializeUserProfileUseCase,
    onComplete: () => {},
  },
} satisfies Meta<typeof OnboardingFlow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
