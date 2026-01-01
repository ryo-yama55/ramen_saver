import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { OnboardingFlow } from './OnboardingFlow'
import type { InitializeUserProfileUseCase } from '@/application/usecases/InitializeUserProfileUseCase'

describe('OnboardingFlow', () => {
  describe('正常系', () => {
    it('初期状態でWelcomeScreenが表示される', () => {
      const mockInitializeUseCase: InitializeUserProfileUseCase = {
        execute: vi.fn().mockResolvedValue({
          id: 'test-id',
          ramenPrice: 800,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      }

      render(
        <OnboardingFlow
          initializeUserProfileUseCase={mockInitializeUseCase}
          onComplete={() => {}}
        />
      )

      expect(screen.getByText('ラーメン貯金')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '始める' })).toBeInTheDocument()
    })

    it('「始める」ボタンをクリックするとRamenPriceSetup画面に遷移する', async () => {
      const user = userEvent.setup()
      const mockInitializeUseCase: InitializeUserProfileUseCase = {
        execute: vi.fn().mockResolvedValue({
          id: 'test-id',
          ramenPrice: 800,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      }

      render(
        <OnboardingFlow
          initializeUserProfileUseCase={mockInitializeUseCase}
          onComplete={() => {}}
        />
      )

      const startButton = screen.getByRole('button', { name: '始める' })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByText('ラーメン価格を設定')).toBeInTheDocument()
      })
    })

    it('価格設定完了後にローディング表示が出る', async () => {
      const user = userEvent.setup()
      const mockInitializeUseCase: InitializeUserProfileUseCase = {
        execute: vi.fn().mockImplementation(() => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve({
                id: 'test-id',
                ramenPrice: 800,
                createdAt: new Date(),
                updatedAt: new Date(),
              })
            }, 100)
          })
        }),
      }

      render(
        <OnboardingFlow
          initializeUserProfileUseCase={mockInitializeUseCase}
          onComplete={() => {}}
        />
      )

      // WelcomeScreen → RamenPriceSetup
      const startButton = screen.getByRole('button', { name: '始める' })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByText('ラーメン価格を設定')).toBeInTheDocument()
      })

      // 完了ボタンをクリック
      const completeButton = screen.getByRole('button', { name: '完了' })
      await user.click(completeButton)

      // ローディング表示
      await waitFor(() => {
        expect(screen.getByText('設定を保存しています...')).toBeInTheDocument()
      })
    })

    it('初期化成功後にonCompleteが呼ばれる', async () => {
      const user = userEvent.setup()
      const mockOnComplete = vi.fn()
      const mockInitializeUseCase: InitializeUserProfileUseCase = {
        execute: vi.fn().mockResolvedValue({
          id: 'test-id',
          ramenPrice: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      }

      render(
        <OnboardingFlow
          initializeUserProfileUseCase={mockInitializeUseCase}
          onComplete={mockOnComplete}
        />
      )

      // WelcomeScreen → RamenPriceSetup
      const startButton = screen.getByRole('button', { name: '始める' })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByText('ラーメン価格を設定')).toBeInTheDocument()
      })

      // 価格入力して完了
      const input = screen.getByLabelText('ラーメンの価格')
      await user.clear(input)
      await user.type(input, '1000')

      const completeButton = screen.getByRole('button', { name: '完了' })
      await user.click(completeButton)

      // onCompleteが呼ばれる
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledTimes(1)
      })

      // executeが正しい価格で呼ばれる
      expect(mockInitializeUseCase.execute).toHaveBeenCalledWith({ ramenPrice: 1000 })
    })
  })

  describe('異常系', () => {
    it('初期化失敗時にエラーメッセージが表示される', async () => {
      const user = userEvent.setup()
      const mockInitializeUseCase: InitializeUserProfileUseCase = {
        execute: vi.fn().mockRejectedValue(new Error('保存失敗')),
      }

      render(
        <OnboardingFlow
          initializeUserProfileUseCase={mockInitializeUseCase}
          onComplete={() => {}}
        />
      )

      // WelcomeScreen → RamenPriceSetup
      const startButton = screen.getByRole('button', { name: '始める' })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByText('ラーメン価格を設定')).toBeInTheDocument()
      })

      // 完了ボタンをクリック
      const completeButton = screen.getByRole('button', { name: '完了' })
      await user.click(completeButton)

      // エラーメッセージが表示される
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          '設定の保存に失敗しました。もう一度お試しください。'
        )
      })

      // onCompleteは呼ばれない
      expect(mockInitializeUseCase.execute).toHaveBeenCalledTimes(1)
    })

    it('エラー後に再試行できる', async () => {
      const user = userEvent.setup()
      let callCount = 0
      const mockInitializeUseCase: InitializeUserProfileUseCase = {
        execute: vi.fn().mockImplementation(() => {
          callCount++
          if (callCount === 1) {
            return Promise.reject(new Error('保存失敗'))
          }
          return Promise.resolve({
            id: 'test-id',
            ramenPrice: 800,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        }),
      }
      const mockOnComplete = vi.fn()

      render(
        <OnboardingFlow
          initializeUserProfileUseCase={mockInitializeUseCase}
          onComplete={mockOnComplete}
        />
      )

      // WelcomeScreen → RamenPriceSetup
      const startButton = screen.getByRole('button', { name: '始める' })
      await user.click(startButton)

      await waitFor(() => {
        expect(screen.getByText('ラーメン価格を設定')).toBeInTheDocument()
      })

      // 1回目：失敗
      let completeButton = screen.getByRole('button', { name: '完了' })
      await user.click(completeButton)

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      // 2回目：成功
      completeButton = screen.getByRole('button', { name: '完了' })
      await user.click(completeButton)

      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalledTimes(1)
      })

      expect(mockInitializeUseCase.execute).toHaveBeenCalledTimes(2)
    })
  })
})
