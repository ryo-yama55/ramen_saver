import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { WelcomeScreen } from './WelcomeScreen'

describe('WelcomeScreen', () => {
  describe('正常系', () => {
    it('タイトルが表示される', () => {
      render(<WelcomeScreen onStart={() => {}} />)

      expect(screen.getByText('ラーメン貯金')).toBeInTheDocument()
    })

    it('アプリの説明が表示される', () => {
      render(<WelcomeScreen onStart={() => {}} />)

      expect(screen.getByText(/ラーメンを我慢して/)).toBeInTheDocument()
      expect(screen.getByText(/貯金するWebアプリ/)).toBeInTheDocument()
    })

    it('使い方の3ステップが表示される', () => {
      render(<WelcomeScreen onStart={() => {}} />)

      expect(screen.getByText('使い方はかんたん')).toBeInTheDocument()
      expect(screen.getByText('ラーメンを我慢する')).toBeInTheDocument()
      expect(screen.getByText('ボタンをタップ')).toBeInTheDocument()
      expect(screen.getByText('貯金額を確認')).toBeInTheDocument()
    })

    it('「始める」ボタンが表示される', () => {
      render(<WelcomeScreen onStart={() => {}} />)

      expect(screen.getByRole('button', { name: '始める' })).toBeInTheDocument()
    })

    it('「始める」ボタンをクリックするとonStartが呼ばれる', async () => {
      const user = userEvent.setup()
      const mockOnStart = vi.fn()

      render(<WelcomeScreen onStart={mockOnStart} />)

      const button = screen.getByRole('button', { name: '始める' })
      await user.click(button)

      expect(mockOnStart).toHaveBeenCalledTimes(1)
    })
  })
})
