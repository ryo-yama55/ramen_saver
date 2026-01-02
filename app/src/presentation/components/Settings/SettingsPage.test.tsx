import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { SettingsPage } from './SettingsPage'
import type { GetUserProfileUseCase } from '@/application/usecases/GetUserProfileUseCase'
import type { UpdateRamenPriceUseCase } from '@/application/usecases/UpdateRamenPriceUseCase'

describe('SettingsPage', () => {
  let mockGetUserProfileUseCase: GetUserProfileUseCase
  let mockUpdateRamenPriceUseCase: UpdateRamenPriceUseCase
  let mockOnNavigateToHome: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockGetUserProfileUseCase = {
      execute: vi.fn().mockResolvedValue({
        id: 'test-id',
        ramenPrice: 800,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    } as unknown as GetUserProfileUseCase

    mockUpdateRamenPriceUseCase = {
      execute: vi.fn().mockResolvedValue({
        id: 'test-id',
        ramenPrice: 900,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    } as unknown as UpdateRamenPriceUseCase

    mockOnNavigateToHome = vi.fn()
  })

  describe('正常系', () => {
    it('初期表示で現在の価格が表示される', async () => {
      render(
        <SettingsPage
          getUserProfileUseCase={mockGetUserProfileUseCase}
          updateRamenPriceUseCase={mockUpdateRamenPriceUseCase}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('現在の設定: 800円')).toBeInTheDocument()
      })
    })

    it('価格入力フィールドに初期値が設定される', async () => {
      render(
        <SettingsPage
          getUserProfileUseCase={mockGetUserProfileUseCase}
          updateRamenPriceUseCase={mockUpdateRamenPriceUseCase}
        />
      )

      await waitFor(() => {
        const input = screen.getByLabelText('ラーメンの価格') as HTMLInputElement
        expect(input.value).toBe('800')
      })
    })

    it('保存ボタンが表示される', async () => {
      render(
        <SettingsPage
          getUserProfileUseCase={mockGetUserProfileUseCase}
          updateRamenPriceUseCase={mockUpdateRamenPriceUseCase}
        />
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()
      })
    })

    it('価格を変更して保存できる', async () => {
      const user = userEvent.setup()
      render(
        <SettingsPage
          getUserProfileUseCase={mockGetUserProfileUseCase}
          updateRamenPriceUseCase={mockUpdateRamenPriceUseCase}
        />
      )

      await waitFor(() => {
        expect(screen.getByLabelText('ラーメンの価格')).toBeInTheDocument()
      })

      const input = screen.getByLabelText('ラーメンの価格')
      await user.clear(input)
      await user.type(input, '900')

      const button = screen.getByRole('button', { name: '保存' })
      await user.click(button)

      await waitFor(() => {
        expect(mockUpdateRamenPriceUseCase.execute).toHaveBeenCalledWith({ ramenPrice: 900 })
      })
    })

    it('保存後に成功メッセージが表示される', async () => {
      const user = userEvent.setup()
      render(
        <SettingsPage
          getUserProfileUseCase={mockGetUserProfileUseCase}
          updateRamenPriceUseCase={mockUpdateRamenPriceUseCase}
        />
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: '保存' })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('設定を更新しました')).toBeInTheDocument()
      })
    })

    it('保存中はボタンが無効化される', async () => {
      const user = userEvent.setup()
      mockUpdateRamenPriceUseCase.execute = vi.fn().mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  id: 'test-id',
                  ramenPrice: 800,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }),
              100
            )
          )
      )

      render(
        <SettingsPage
          getUserProfileUseCase={mockGetUserProfileUseCase}
          updateRamenPriceUseCase={mockUpdateRamenPriceUseCase}
        />
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: '保存' })
      await user.click(button)

      expect(screen.getByRole('button', { name: '保存中...' })).toBeDisabled()
    })

    it('アプリバージョンが表示される', async () => {
      render(
        <SettingsPage
          getUserProfileUseCase={mockGetUserProfileUseCase}
          updateRamenPriceUseCase={mockUpdateRamenPriceUseCase}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('0.0.0')).toBeInTheDocument()
      })
    })
  })

  describe('バリデーション', () => {
    it('空の価格で保存しようとするとエラーが表示される', async () => {
      const user = userEvent.setup()
      render(
        <SettingsPage
          getUserProfileUseCase={mockGetUserProfileUseCase}
          updateRamenPriceUseCase={mockUpdateRamenPriceUseCase}
        />
      )

      await waitFor(() => {
        expect(screen.getByLabelText('ラーメンの価格')).toBeInTheDocument()
      })

      const input = screen.getByLabelText('ラーメンの価格')
      await user.clear(input)

      const button = screen.getByRole('button', { name: '保存' })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('価格を入力してください')).toBeInTheDocument()
      })
    })

    it('最小値未満の価格で保存しようとするとエラーが表示される', async () => {
      const user = userEvent.setup()
      render(
        <SettingsPage
          getUserProfileUseCase={mockGetUserProfileUseCase}
          updateRamenPriceUseCase={mockUpdateRamenPriceUseCase}
        />
      )

      await waitFor(() => {
        expect(screen.getByLabelText('ラーメンの価格')).toBeInTheDocument()
      })

      const input = screen.getByLabelText('ラーメンの価格')
      await user.clear(input)
      await user.type(input, '50')

      const button = screen.getByRole('button', { name: '保存' })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('価格は100円以上で入力してください')).toBeInTheDocument()
      })
    })

    it('最大値超過の価格で保存しようとするとエラーが表示される', async () => {
      const user = userEvent.setup()
      render(
        <SettingsPage
          getUserProfileUseCase={mockGetUserProfileUseCase}
          updateRamenPriceUseCase={mockUpdateRamenPriceUseCase}
        />
      )

      await waitFor(() => {
        expect(screen.getByLabelText('ラーメンの価格')).toBeInTheDocument()
      })

      const input = screen.getByLabelText('ラーメンの価格')
      await user.clear(input)
      await user.type(input, '5000')

      const button = screen.getByRole('button', { name: '保存' })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('価格は3000円以下で入力してください')).toBeInTheDocument()
      })
    })
  })

  describe('異常系', () => {
    it('初期データ取得に失敗してもエラーにならない', async () => {
      mockGetUserProfileUseCase.execute = vi.fn().mockRejectedValue(new Error('Failed to fetch'))

      render(
        <SettingsPage
          getUserProfileUseCase={mockGetUserProfileUseCase}
          updateRamenPriceUseCase={mockUpdateRamenPriceUseCase}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('設定の読み込みに失敗しました')).toBeInTheDocument()
      })
    })

    it('保存に失敗してもエラーにならない', async () => {
      const user = userEvent.setup()
      mockUpdateRamenPriceUseCase.execute = vi.fn().mockRejectedValue(new Error('Failed to save'))

      render(
        <SettingsPage
          getUserProfileUseCase={mockGetUserProfileUseCase}
          updateRamenPriceUseCase={mockUpdateRamenPriceUseCase}
        />
      )

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: '保存' })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('設定の保存に失敗しました')).toBeInTheDocument()
      })

      expect(screen.queryByText('設定を更新しました')).not.toBeInTheDocument()
    })
  })

  describe('ナビゲーション', () => {
    it('ホームに戻るボタンが表示される', async () => {
      render(
        <SettingsPage
          getUserProfileUseCase={mockGetUserProfileUseCase}
          updateRamenPriceUseCase={mockUpdateRamenPriceUseCase}
          onNavigateToHome={mockOnNavigateToHome}
        />
      )

      await waitFor(() => {
        expect(screen.getByLabelText('ホームに戻る')).toBeInTheDocument()
      })
    })

    it('ホームに戻るボタンをクリックするとonNavigateToHomeが呼ばれる', async () => {
      const user = userEvent.setup()
      render(
        <SettingsPage
          getUserProfileUseCase={mockGetUserProfileUseCase}
          updateRamenPriceUseCase={mockUpdateRamenPriceUseCase}
          onNavigateToHome={mockOnNavigateToHome}
        />
      )

      await waitFor(() => {
        expect(screen.getByLabelText('ホームに戻る')).toBeInTheDocument()
      })

      const button = screen.getByLabelText('ホームに戻る')
      await user.click(button)

      expect(mockOnNavigateToHome).toHaveBeenCalledTimes(1)
    })
  })
})
