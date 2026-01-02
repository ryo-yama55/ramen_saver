/**
 * 日付フォーマット関数
 */

/**
 * 日付を「YYYY年M月D日」形式にフォーマットする
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}

/**
 * 時刻を「HH:MM」形式にフォーマットする
 */
export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}
