import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { HomePage } from './HomePage'

// Mock use cases
const mockGetTotalSavingsUseCase = {
  execute: fn().mockResolvedValue(5000),
}

const mockGetMonthlySavingsUseCase = {
  execute: fn().mockResolvedValue(2000),
}

const mockSaveRamenResistanceUseCase = {
  execute: fn().mockResolvedValue({
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
    getTotalSavingsUseCase: mockGetTotalSavingsUseCase as any,
    getMonthlySavingsUseCase: mockGetMonthlySavingsUseCase as any,
    saveRamenResistanceUseCase: mockSaveRamenResistanceUseCase as any,
  },
}

export const NoSavings: Story = {
  args: {
    getTotalSavingsUseCase: {
      execute: fn().mockResolvedValue(0),
    } as any,
    getMonthlySavingsUseCase: {
      execute: fn().mockResolvedValue(0),
    } as any,
    saveRamenResistanceUseCase: mockSaveRamenResistanceUseCase as any,
  },
}

export const HighSavings: Story = {
  args: {
    getTotalSavingsUseCase: {
      execute: fn().mockResolvedValue(123456),
    } as any,
    getMonthlySavingsUseCase: {
      execute: fn().mockResolvedValue(45678),
    } as any,
    saveRamenResistanceUseCase: mockSaveRamenResistanceUseCase as any,
  },
}
