import type { Meta, StoryObj } from '@storybook/react';
import { HomePage } from './HomePage';

// Mock use cases
const mockGetTotalSavingsUseCase = {
  execute: async () => 5000,
};

const mockGetMonthlySavingsUseCase = {
  execute: async () => 2000,
};

const mockSaveRamenResistanceUseCase = {
  execute: async () => ({
    id: 'test-id',
    amount: 800,
    recordedAt: new Date(),
    isDeleted: false,
  }),
};

const meta = {
  title: 'Home/HomePage',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    getTotalSavingsUseCase: mockGetTotalSavingsUseCase as any,
    getMonthlySavingsUseCase: mockGetMonthlySavingsUseCase as any,
    saveRamenResistanceUseCase: mockSaveRamenResistanceUseCase as any,
  },
};

export const NoSavings: Story = {
  args: {
    getTotalSavingsUseCase: {
      execute: async () => 0,
    } as any,
    getMonthlySavingsUseCase: {
      execute: async () => 0,
    } as any,
    saveRamenResistanceUseCase: mockSaveRamenResistanceUseCase as any,
  },
};

export const HighSavings: Story = {
  args: {
    getTotalSavingsUseCase: {
      execute: async () => 123456,
    } as any,
    getMonthlySavingsUseCase: {
      execute: async () => 45678,
    } as any,
    saveRamenResistanceUseCase: mockSaveRamenResistanceUseCase as any,
  },
};
