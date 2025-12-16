/**
 * 成功メッセージコンポーネント
 *
 * ラーメン我慢記録が保存された後に表示されるメッセージ
 */

export type SuccessMessageProps = {
  /** メッセージの表示状態 */
  visible: boolean
  /** 貯金額（円） */
  amount: number
}

/**
 * 金額をカンマ区切りの文字列にフォーマット
 */
const formatCurrency = (amount: number): string => {
  const safeAmount = Math.max(0, amount)
  return safeAmount.toLocaleString('ja-JP')
}

/**
 * 成功メッセージコンポーネント
 */
export const SuccessMessage = ({ visible, amount }: SuccessMessageProps) => {
  if (!visible) {
    return null
  }

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center animate-fade-in">
      <p className="font-bold text-lg">素晴らしい!</p>
      <p className="text-sm">{formatCurrency(amount)}円貯金できました!</p>
    </div>
  )
}
