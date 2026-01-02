import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsPage } from './SettingsPage'
import type { GetUserProfileUseCase } from '@/application/usecases/GetUserProfileUseCase'
import type { UpdateRamenPriceUseCase } from '@/application/usecases/UpdateRamenPriceUseCase'

const meta = {
  title: 'Pages/SettingsPage',
  component: SettingsPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SettingsPage>

export default meta
type Story = StoryObj<typeof meta>

// モックユースケース
const mockGetUserProfileUseCase: GetUserProfileUseCase = {
  execute: async () => ({
    id: 'test-id',
    ramenPrice: 800,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
}

const mockUpdateRamenPriceUseCase: UpdateRamenPriceUseCase = {
  execute: async ({ ramenPrice }) => ({
    id: 'test-id',
    ramenPrice,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
}

export const Default: Story = {
  args: {
    getUserProfileUseCase: mockGetUserProfileUseCase,
    updateRamenPriceUseCase: mockUpdateRamenPriceUseCase,
  },
}

export const WithNavigation: Story = {
  args: {
    getUserProfileUseCase: mockGetUserProfileUseCase,
    updateRamenPriceUseCase: mockUpdateRamenPriceUseCase,
    onNavigateToHome: () => alert('ホームに戻ります'),
  },
}

export const HighPrice: Story = {
  args: {
    getUserProfileUseCase: {
      execute: async () => ({
        id: 'test-id',
        ramenPrice: 2000,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    },
    updateRamenPriceUseCase: mockUpdateRamenPriceUseCase,
  },
}

export const LoadingError: Story = {
  args: {
    getUserProfileUseCase: {
      execute: async () => {
        throw new Error('Failed to load')
      },
    },
    updateRamenPriceUseCase: mockUpdateRamenPriceUseCase,
  },
}
