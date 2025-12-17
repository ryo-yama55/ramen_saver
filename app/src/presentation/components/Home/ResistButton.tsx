/**
 * ラーメン我慢ボタンコンポーネント
 *
 * ユーザーがラーメンを我慢したときにクリックするボタン
 */

export type ResistButtonProps = {
  /** クリックハンドラ */
  onClick: () => void
  /** ボタンの無効状態 */
  disabled?: boolean
  /** ローディング状態 */
  loading?: boolean
}

/**
 * ラーメン我慢ボタンコンポーネント
 */
export const ResistButton = ({ onClick, disabled = false, loading = false }: ResistButtonProps) => {
  const isDisabled = disabled || loading

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        w-full py-4 px-6 rounded-lg font-bold text-lg
        transition-all duration-200
        ${
          isDisabled
            ? 'bg-gray-400 text-gray-100 cursor-not-allowed opacity-50'
            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 active:scale-95 shadow-lg hover:shadow-xl'
        }
      `}
    >
      {loading ? '保存中...' : '我慢した!'}
    </button>
  )
}
