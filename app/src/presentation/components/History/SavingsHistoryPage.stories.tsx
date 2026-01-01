import type { Meta, StoryObj } from '@storybook/react-vite'
import { SavingsHistoryPage } from './SavingsHistoryPage'
import type { GetSavingsHistoryUseCase } from '@/application/usecases/GetSavingsHistoryUseCase'
import type { SavingsRecord } from '@/domain/entities/SavingsRecord'

const meta = {
  title: 'Pages/SavingsHistoryPage',
  component: SavingsHistoryPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SavingsHistoryPage>

export default meta
type Story = StoryObj<typeof meta>

// モックユースケース
const createMockUseCase = (records: SavingsRecord[]): GetSavingsHistoryUseCase => ({
  execute: async () => records,
})

export const Empty: Story = {
  args: {
    getSavingsHistoryUseCase: createMockUseCase([]),
  },
}

export const SingleRecord: Story = {
  args: {
    getSavingsHistoryUseCase: createMockUseCase([
      {
        id: '1',
        amount: 800,
        recordedAt: new Date('2025-01-15T19:30:00'),
        isDeleted: false,
      },
    ]),
  },
}

export const MultipleRecords: Story = {
  args: {
    getSavingsHistoryUseCase: createMockUseCase([
      {
        id: '1',
        amount: 800,
        recordedAt: new Date('2025-01-15T19:30:00'),
        isDeleted: false,
      },
      {
        id: '2',
        amount: 900,
        recordedAt: new Date('2025-01-14T12:15:00'),
        isDeleted: false,
      },
      {
        id: '3',
        amount: 1000,
        recordedAt: new Date('2025-01-13T08:45:00'),
        isDeleted: false,
      },
    ]),
  },
}

export const ManyRecords: Story = {
  args: {
    getSavingsHistoryUseCase: createMockUseCase(
      Array.from({ length: 20 }, (_, i) => ({
        id: `record-${i}`,
        amount: 800 + Math.floor(Math.random() * 500),
        recordedAt: new Date(2025, 0, 20 - i, 10 + i, 30),
        isDeleted: false,
      }))
    ),
  },
}
