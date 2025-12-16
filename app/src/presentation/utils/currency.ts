/**
 * 通貨フォーマットユーティリティ
 */

/**
 * 金額をカンマ区切りの日本円文字列にフォーマット
 *
 * @param amount - 金額（円）
 * @returns カンマ区切りの金額文字列（例: "1,000円"）
 *
 * @example
 * formatCurrency(1000) // "1,000円"
 * formatCurrency(0) // "0円"
 * formatCurrency(-100) // "0円" (負の値は0として扱う)
 */
export const formatCurrency = (amount: number): string => {
  const safeAmount = Math.max(0, amount)
  return `${safeAmount.toLocaleString('ja-JP')}円`
}
