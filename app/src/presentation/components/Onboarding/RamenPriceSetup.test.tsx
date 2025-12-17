import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { RamenPriceSetup } from './RamenPriceSetup'

describe('RamenPriceSetup', () => {
  describe('正常系', () => {
    it('タイトルと説明が表示される', () => {
      render(<RamenPriceSetup onComplete={() => {}} />)

      expect(screen.getByText('ラーメン価格を設定')).toBeInTheDocument()
      expect(screen.getByText(/あなたがよく食べる/)).toBeInTheDocument()
      expect(screen.getByText(/ラーメンの価格を教えてください/)).toBeInTheDocument()
    })

    it('デフォルト価格が表示される', () => {
      render(<RamenPriceSetup onComplete={() => {}} />)

      const input = screen.getByLabelText('ラーメンの価格')
      expect(input).toHaveValue(800)
    })

    it('カスタムデフォルト価格が表示される', () => {
      render(<RamenPriceSetup defaultPrice={1000} onComplete={() => {}} />)

      const input = screen.getByLabelText('ラーメンの価格')
      expect(input).toHaveValue(1000)
    })

    it('数字を入力できる', async () => {
      const user = userEvent.setup()
      render(<RamenPriceSetup onComplete={() => {}} />)

      const input = screen.getByLabelText('ラーメンの価格')
      await user.clear(input)
      await user.type(input, '1200')

      expect(input).toHaveValue(1200)
    })

    it('正常な価格で完了ボタンを押すとonCompleteが呼ばれる', async () => {
      const user = userEvent.setup()
      const mockOnComplete = vi.fn()

      render(<RamenPriceSetup defaultPrice={1000} onComplete={mockOnComplete} />)

      const button = screen.getByRole('button', { name: '完了' })
      await user.click(button)

      expect(mockOnComplete).toHaveBeenCalledWith(1000)
    })

    it('ヒントメッセージが表示される', () => {
      render(<RamenPriceSetup onComplete={() => {}} />)

      expect(screen.getByText(/一般的なラーメンの価格: 800円〜1,000円/)).toBeInTheDocument()
      expect(screen.getByText(/後から設定画面で変更できます/)).toBeInTheDocument()
    })
  })

  describe('異常系 - バリデーション', () => {
    it('空の入力で完了ボタンを押すとエラーが表示される', async () => {
      const user = userEvent.setup()
      render(<RamenPriceSetup onComplete={() => {}} />)

      const input = screen.getByLabelText('ラーメンの価格')
      await user.clear(input)

      const button = screen.getByRole('button', { name: '完了' })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('価格を入力してください')
      })
    })

    it('100円未満の価格でエラーが表示される', async () => {
      const user = userEvent.setup()
      render(<RamenPriceSetup onComplete={() => {}} />)

      const input = screen.getByLabelText('ラーメンの価格')
      await user.clear(input)
      await user.type(input, '99')

      const button = screen.getByRole('button', { name: '完了' })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('価格は100円以上で入力してください')
      })
    })

    it('3000円超の価格でエラーが表示される', async () => {
      const user = userEvent.setup()
      render(<RamenPriceSetup onComplete={() => {}} />)

      const input = screen.getByLabelText('ラーメンの価格')
      await user.clear(input)
      await user.type(input, '3001')

      const button = screen.getByRole('button', { name: '完了' })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('価格は3000円以下で入力してください')
      })
    })

    it('数字以外の入力は無視される', async () => {
      const user = userEvent.setup()
      render(<RamenPriceSetup onComplete={() => {}} />)

      const input = screen.getByLabelText('ラーメンの価格')
      await user.clear(input)
      await user.type(input, 'abc')

      // 数字以外は入力されない
      expect(input).toHaveValue(null)
    })

    it('外部エラーが表示される', () => {
      render(
        <RamenPriceSetup
          onComplete={() => {}}
          externalError="設定の保存に失敗しました。もう一度お試しください。"
        />
      )

      expect(screen.getByRole('alert')).toHaveTextContent(
        '設定の保存に失敗しました。もう一度お試しください。'
      )
    })

    it('入力時に内部エラーがクリアされる', async () => {
      const user = userEvent.setup()
      render(<RamenPriceSetup onComplete={() => {}} />)

      const input = screen.getByLabelText('ラーメンの価格')
      await user.clear(input)

      const button = screen.getByRole('button', { name: '完了' })
      await user.click(button)

      // エラーが表示される
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      // 数字を入力するとエラーがクリアされる
      await user.type(input, '1000')

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('アクセシビリティ', () => {
    it('入力フィールドにaria-labelが設定されている', () => {
      render(<RamenPriceSetup onComplete={() => {}} />)

      const input = screen.getByLabelText('ラーメンの価格')
      expect(input).toHaveAttribute('aria-label', 'ラーメンの価格')
    })

    it('エラー時にaria-invalidがtrueになる', async () => {
      const user = userEvent.setup()
      render(<RamenPriceSetup onComplete={() => {}} />)

      const input = screen.getByLabelText('ラーメンの価格')
      await user.clear(input)

      const button = screen.getByRole('button', { name: '完了' })
      await user.click(button)

      await waitFor(() => {
        expect(input).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('エラーメッセージにrole="alert"が設定されている', async () => {
      const user = userEvent.setup()
      render(<RamenPriceSetup onComplete={() => {}} />)

      const input = screen.getByLabelText('ラーメンの価格')
      await user.clear(input)

      const button = screen.getByRole('button', { name: '完了' })
      await user.click(button)

      await waitFor(() => {
        const alert = screen.getByRole('alert')
        expect(alert).toBeInTheDocument()
      })
    })
  })
})
