import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { HomePage } from './HomePage'
import type { GetTotalSavingsUseCase } from '@/application/usecases/GetTotalSavingsUseCase'
import type { GetMonthlySavingsUseCase } from '@/application/usecases/GetMonthlySavingsUseCase'
import type { SaveRamenResistanceUseCase } from '@/application/usecases/SaveRamenResistanceUseCase'

describe('HomePage', () => {
  let mockGetTotalSavingsUseCase: GetTotalSavingsUseCase
  let mockGetMonthlySavingsUseCase: GetMonthlySavingsUseCase
  let mockSaveRamenResistanceUseCase: SaveRamenResistanceUseCase

  beforeEach(() => {
    mockGetTotalSavingsUseCase = {
      execute: vi.fn().mockResolvedValue(5000),
    } as any

    mockGetMonthlySavingsUseCase = {
      execute: vi.fn().mockResolvedValue(2000),
    } as any

    mockSaveRamenResistanceUseCase = {
      execute: vi.fn().mockResolvedValue({
        id: 'test-id',
        amount: 800,
        recordedAt: new Date(),
        isDeleted: false,
      }),
    } as any
  })

  describe('正常系', () => {
    it('初期表示で貯金額が表示される', async () => {
      render(
        <HomePage
          getTotalSavingsUseCase={mockGetTotalSavingsUseCase}
          getMonthlySavingsUseCase={mockGetMonthlySavingsUseCase}
          saveRamenResistanceUseCase={mockSaveRamenResistanceUseCase}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('5,000円')).toBeInTheDocument()
        expect(screen.getByText('2,000円')).toBeInTheDocument()
      })
    })

    it('我慢ボタンが表示される', () => {
      render(
        <HomePage
          getTotalSavingsUseCase={mockGetTotalSavingsUseCase}
          getMonthlySavingsUseCase={mockGetMonthlySavingsUseCase}
          saveRamenResistanceUseCase={mockSaveRamenResistanceUseCase}
        />
      )

      expect(screen.getByRole('button', { name: '我慢した!' })).toBeInTheDocument()
    })

    it('我慢ボタンをクリックすると記録が保存される', async () => {
      const user = userEvent.setup()
      render(
        <HomePage
          getTotalSavingsUseCase={mockGetTotalSavingsUseCase}
          getMonthlySavingsUseCase={mockGetMonthlySavingsUseCase}
          saveRamenResistanceUseCase={mockSaveRamenResistanceUseCase}
        />
      )

      const button = screen.getByRole('button', { name: '我慢した!' })
      await user.click(button)

      expect(mockSaveRamenResistanceUseCase.execute).toHaveBeenCalledTimes(1)
    })

    it('記録保存中はボタンが無効化される', async () => {
      const user = userEvent.setup()
      mockSaveRamenResistanceUseCase.execute = vi.fn().mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  id: 'test-id',
                  amount: 800,
                  recordedAt: new Date(),
                  isDeleted: false,
                }),
              100
            )
          )
      )

      render(
        <HomePage
          getTotalSavingsUseCase={mockGetTotalSavingsUseCase}
          getMonthlySavingsUseCase={mockGetMonthlySavingsUseCase}
          saveRamenResistanceUseCase={mockSaveRamenResistanceUseCase}
        />
      )

      const button = screen.getByRole('button', { name: '我慢した!' })
      await user.click(button)

      expect(screen.getByRole('button', { name: '保存中...' })).toBeDisabled()
    })

    it('記録保存後に成功メッセージが表示される', async () => {
      const user = userEvent.setup()
      render(
        <HomePage
          getTotalSavingsUseCase={mockGetTotalSavingsUseCase}
          getMonthlySavingsUseCase={mockGetMonthlySavingsUseCase}
          saveRamenResistanceUseCase={mockSaveRamenResistanceUseCase}
        />
      )

      const button = screen.getByRole('button', { name: '我慢した!' })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('素晴らしい!')).toBeInTheDocument()
        expect(screen.getByText('800円貯金できました!')).toBeInTheDocument()
      })
    })

    it('記録保存後に貯金額が更新される', async () => {
      const user = userEvent.setup()
      mockGetTotalSavingsUseCase.execute = vi
        .fn()
        .mockResolvedValueOnce(5000)
        .mockResolvedValueOnce(5800)

      mockGetMonthlySavingsUseCase.execute = vi
        .fn()
        .mockResolvedValueOnce(2000)
        .mockResolvedValueOnce(2800)

      render(
        <HomePage
          getTotalSavingsUseCase={mockGetTotalSavingsUseCase}
          getMonthlySavingsUseCase={mockGetMonthlySavingsUseCase}
          saveRamenResistanceUseCase={mockSaveRamenResistanceUseCase}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('5,000円')).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: '我慢した!' })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('5,800円')).toBeInTheDocument()
        expect(screen.getByText('2,800円')).toBeInTheDocument()
      })
    })
  })

  describe('異常系', () => {
    it('初期データ取得に失敗してもエラーにならない', async () => {
      mockGetTotalSavingsUseCase.execute = vi.fn().mockRejectedValue(new Error('Failed to fetch'))

      mockGetMonthlySavingsUseCase.execute = vi.fn().mockRejectedValue(new Error('Failed to fetch'))

      render(
        <HomePage
          getTotalSavingsUseCase={mockGetTotalSavingsUseCase}
          getMonthlySavingsUseCase={mockGetMonthlySavingsUseCase}
          saveRamenResistanceUseCase={mockSaveRamenResistanceUseCase}
        />
      )

      await waitFor(() => {
        const amounts = screen.getAllByText('0円')
        expect(amounts.length).toBeGreaterThan(0)
      })
    })

    it('記録保存に失敗してもエラーにならない', async () => {
      const user = userEvent.setup()
      mockSaveRamenResistanceUseCase.execute = vi
        .fn()
        .mockRejectedValue(new Error('Failed to save'))

      render(
        <HomePage
          getTotalSavingsUseCase={mockGetTotalSavingsUseCase}
          getMonthlySavingsUseCase={mockGetMonthlySavingsUseCase}
          saveRamenResistanceUseCase={mockSaveRamenResistanceUseCase}
        />
      )

      const button = screen.getByRole('button', { name: '我慢した!' })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '我慢した!' })).toBeEnabled()
      })

      expect(screen.queryByText('素晴らしい!')).not.toBeInTheDocument()
    })
  })
})
