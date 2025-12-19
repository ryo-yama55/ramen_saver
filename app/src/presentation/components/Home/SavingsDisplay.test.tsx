import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SavingsDisplay } from './SavingsDisplay'

describe('SavingsDisplay', () => {
  describe('正常系', () => {
    it('総貯金額を表示する', () => {
      render(<SavingsDisplay totalSavings={5000} monthlySavings={2000} />)

      expect(screen.getByText('総貯金額')).toBeInTheDocument()
      expect(screen.getByText('5,000円')).toBeInTheDocument()
    })

    it('今月の貯金額を表示する', () => {
      render(<SavingsDisplay totalSavings={5000} monthlySavings={2000} />)

      expect(screen.getByText('今月の貯金')).toBeInTheDocument()
      expect(screen.getByText('2,000円')).toBeInTheDocument()
    })

    it('0円の場合も正しく表示する', () => {
      render(<SavingsDisplay totalSavings={0} monthlySavings={0} />)

      const amounts = screen.getAllByText('0円')
      expect(amounts).toHaveLength(2)
      amounts.forEach(amount => {
        expect(amount).toBeInTheDocument()
      })
    })

    it('カンマ区切りで大きな数値を表示する', () => {
      render(<SavingsDisplay totalSavings={1234567} monthlySavings={123456} />)

      expect(screen.getByText('1,234,567円')).toBeInTheDocument()
      expect(screen.getByText('123,456円')).toBeInTheDocument()
    })
  })

  describe('異常系', () => {
    it('負の値の場合は0として表示する', () => {
      render(<SavingsDisplay totalSavings={-1000} monthlySavings={-500} />)

      const amounts = screen.getAllByText('0円')
      expect(amounts).toHaveLength(2)
    })
  })
})
