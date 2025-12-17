/**
 * 貯金額表示コンポーネント
 *
 * 総貯金額と今月の貯金額を表示する
 */

import { formatCurrency } from '@/presentation/utils/currency'

export type SavingsDisplayProps = {
  /** 総貯金額（円） */
  totalSavings: number
  /** 今月の貯金額（円） */
  monthlySavings: number
}

/**
 * 貯金額表示コンポーネント
 */
export const SavingsDisplay = ({ totalSavings, monthlySavings }: SavingsDisplayProps) => {
  return (
    <div className="space-y-6">
      {/* 総貯金額 */}
      <div className="text-center">
        <p className="text-sm text-gray-600">総貯金額</p>
        <p className="text-4xl font-bold text-amber-500">{formatCurrency(totalSavings)}</p>
      </div>

      {/* 今月の貯金額 */}
      <div className="text-center">
        <p className="text-sm text-gray-600">今月の貯金</p>
        <p className="text-2xl font-semibold text-teal-600">{formatCurrency(monthlySavings)}</p>
      </div>
    </div>
  )
}
