import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { SavingsHistoryPage } from './SavingsHistoryPage'
import type { GetSavingsHistoryUseCase } from '@/application/usecases/GetSavingsHistoryUseCase'

describe('SavingsHistoryPage', () => {
  let mockGetSavingsHistoryUseCase: GetSavingsHistoryUseCase

  beforeEach(() => {
    mockGetSavingsHistoryUseCase = {
      execute: vi.fn().mockResolvedValue([]),
    } as unknown as GetSavingsHistoryUseCase
  })

  describe('正常系', () => {
    it('記録がない場合は「まだ記録がありません」と表示される', async () => {
      // Arrange
      render(<SavingsHistoryPage getSavingsHistoryUseCase={mockGetSavingsHistoryUseCase} />)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('まだ記録がありません')).toBeInTheDocument()
      })
    })

    it('記録が1件ある場合は、日付・時刻・節約額を表示する', async () => {
      // Arrange
      const mockRecord = {
        id: 'test-id-1',
        amount: 800,
        recordedAt: new Date('2025-01-15T19:30:00'),
        isDeleted: false,
      }
      mockGetSavingsHistoryUseCase.execute = vi.fn().mockResolvedValue([mockRecord])

      // Act
      render(<SavingsHistoryPage getSavingsHistoryUseCase={mockGetSavingsHistoryUseCase} />)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('2025年1月15日')).toBeInTheDocument()
        expect(screen.getByText('19:30')).toBeInTheDocument()
        expect(screen.getByText('800円')).toBeInTheDocument()
      })
    })

    it('複数の記録が新しい順に表示される', async () => {
      // Arrange
      const mockRecords = [
        {
          id: 'test-id-1',
          amount: 800,
          recordedAt: new Date('2025-01-15T19:30:00'),
          isDeleted: false,
        },
        {
          id: 'test-id-2',
          amount: 900,
          recordedAt: new Date('2025-01-14T12:00:00'),
          isDeleted: false,
        },
        {
          id: 'test-id-3',
          amount: 1000,
          recordedAt: new Date('2025-01-13T08:45:00'),
          isDeleted: false,
        },
      ]
      mockGetSavingsHistoryUseCase.execute = vi.fn().mockResolvedValue(mockRecords)

      // Act
      render(<SavingsHistoryPage getSavingsHistoryUseCase={mockGetSavingsHistoryUseCase} />)

      // Assert
      await waitFor(() => {
        const dates = screen.getAllByText(/\d{4}年\d{1,2}月\d{1,2}日/)
        expect(dates[0]).toHaveTextContent('2025年1月15日')
        expect(dates[1]).toHaveTextContent('2025年1月14日')
        expect(dates[2]).toHaveTextContent('2025年1月13日')
      })
    })
  })
})
