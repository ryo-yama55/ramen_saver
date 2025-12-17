import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SuccessMessage } from './SuccessMessage'

describe('SuccessMessage', () => {
  describe('正常系', () => {
    it('visible=trueの時はメッセージが表示される', () => {
      render(<SuccessMessage visible amount={800} />)

      expect(screen.getByText('素晴らしい!')).toBeInTheDocument()
      expect(screen.getByText('800円貯金できました!')).toBeInTheDocument()
    })

    it('visible=falseの時はメッセージが表示されない', () => {
      render(<SuccessMessage visible={false} amount={800} />)

      expect(screen.queryByText('素晴らしい!')).not.toBeInTheDocument()
      expect(screen.queryByText('800円貯金できました!')).not.toBeInTheDocument()
    })

    it('金額をカンマ区切りで表示する', () => {
      render(<SuccessMessage visible amount={1500} />)

      expect(screen.getByText('1,500円貯金できました!')).toBeInTheDocument()
    })

    it('0円の場合も表示される', () => {
      render(<SuccessMessage visible amount={0} />)

      expect(screen.getByText('0円貯金できました!')).toBeInTheDocument()
    })

    it('大きな金額もカンマ区切りで表示される', () => {
      render(<SuccessMessage visible amount={123456} />)

      expect(screen.getByText('123,456円貯金できました!')).toBeInTheDocument()
    })
  })

  describe('異常系', () => {
    it('負の金額の場合は0として表示される', () => {
      render(<SuccessMessage visible amount={-100} />)

      expect(screen.getByText('0円貯金できました!')).toBeInTheDocument()
    })
  })
})
