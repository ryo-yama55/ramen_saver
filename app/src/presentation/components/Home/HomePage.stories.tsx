import type { Meta, StoryObj } from '@storybook/react-vite'
import type { GetTotalSavingsUseCase } from '@/application/usecases/GetTotalSavingsUseCase'
import type { GetMonthlySavingsUseCase } from '@/application/usecases/GetMonthlySavingsUseCase'
import type { SaveRamenResistanceUseCase } from '@/application/usecases/SaveRamenResistanceUseCase'
import { HomePage } from './HomePage'

// Mock use cases
const mockGetTotalSavingsUseCase: GetTotalSavingsUseCase = {
  execute: async () => 5000,
}

const mockGetMonthlySavingsUseCase: GetMonthlySavingsUseCase = {
  execute: async () => 2000,
}

const mockSaveRamenResistanceUseCase: SaveRamenResistanceUseCase = {
  execute: async () => ({
    id: 'test-id',
    amount: 800,
    recordedAt: new Date(),
    isDeleted: false,
  }),
}

const meta = {
  title: 'Home/HomePage',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HomePage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    getTotalSavingsUseCase: mockGetTotalSavingsUseCase,
    getMonthlySavingsUseCase: mockGetMonthlySavingsUseCase,
    saveRamenResistanceUseCase: mockSaveRamenResistanceUseCase,
  },
}

export const NoSavings: Story = {
  args: {
    getTotalSavingsUseCase: {
      execute: async () => 0,
    },
    getMonthlySavingsUseCase: {
      execute: async () => 0,
    },
    saveRamenResistanceUseCase: mockSaveRamenResistanceUseCase,
  },
}

export const HighSavings: Story = {
  args: {
    getTotalSavingsUseCase: {
      execute: async () => 123456,
    },
    getMonthlySavingsUseCase: {
      execute: async () => 45678,
    },
    saveRamenResistanceUseCase: mockSaveRamenResistanceUseCase,
  },
}
