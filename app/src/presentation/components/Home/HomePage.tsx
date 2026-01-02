/**
 * ホームページコンポーネント
 *
 * ラーメン我慢アプリのメインページ
 */

import { useState, useEffect, useCallback } from 'react'
import type { GetTotalSavingsUseCase } from '@/application/usecases/GetTotalSavingsUseCase'
import type { GetMonthlySavingsUseCase } from '@/application/usecases/GetMonthlySavingsUseCase'
import type { SaveRamenResistanceUseCase } from '@/application/usecases/SaveRamenResistanceUseCase'
import { SavingsDisplay } from './SavingsDisplay'
import { ResistButton } from './ResistButton'
import { SuccessMessage } from './SuccessMessage'

/** 成功メッセージの表示時間（ミリ秒） */
const SUCCESS_MESSAGE_DURATION = 3000

export type HomePageProps = {
  getTotalSavingsUseCase: GetTotalSavingsUseCase
  getMonthlySavingsUseCase: GetMonthlySavingsUseCase
  saveRamenResistanceUseCase: SaveRamenResistanceUseCase
  onNavigateToHistory?: () => void
}

/**
 * ホームページコンポーネント
 */
export const HomePage = ({
  getTotalSavingsUseCase,
  getMonthlySavingsUseCase,
  saveRamenResistanceUseCase,
  onNavigateToHistory,
}: HomePageProps) => {
  const [totalSavings, setTotalSavings] = useState(0)
  const [monthlySavings, setMonthlySavings] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [savedAmount, setSavedAmount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // 初期データ取得
  const fetchSavings = useCallback(async () => {
    try {
      const [total, monthly] = await Promise.all([
        getTotalSavingsUseCase.execute(),
        getMonthlySavingsUseCase.execute(),
      ])
      setTotalSavings(total)
      setMonthlySavings(monthly)
      setError(null)
    } catch (error) {
      console.error('Failed to fetch savings:', error)
      setError('データの取得に失敗しました')
      setTotalSavings(0)
      setMonthlySavings(0)
    }
  }, [getTotalSavingsUseCase, getMonthlySavingsUseCase])

  useEffect(() => {
    fetchSavings()
  }, [fetchSavings])

  // 我慢ボタンクリックハンドラ
  const handleResist = async () => {
    // 連続クリック防止
    if (isSaving) return

    setIsSaving(true)
    setError(null)
    try {
      const record = await saveRamenResistanceUseCase.execute()
      setSavedAmount(record.amount)
      setShowSuccess(true)

      // 貯金額を再取得
      await fetchSavings()
    } catch (error) {
      console.error('Failed to save resistance:', error)
      setError('保存に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  // 成功メッセージを一定時間後に非表示にする
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, SUCCESS_MESSAGE_DURATION)

      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-6">
      <div className="max-w-md mx-auto space-y-8">
        {/* ヘッダー */}
        <header className="text-center pt-8">
          <div className="flex justify-between items-center mb-4">
            <div className="w-10" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">ラーメン貯金</h1>
              <p className="text-gray-600 mt-2">我慢して貯金しよう!</p>
            </div>
            {onNavigateToHistory && (
              <button
                type="button"
                onClick={onNavigateToHistory}
                className="text-gray-600 hover:text-gray-800 transition-colors"
                aria-label="履歴を見る"
              >
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </button>
            )}
          </div>
        </header>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* 貯金額表示 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <SavingsDisplay totalSavings={totalSavings} monthlySavings={monthlySavings} />
        </div>

        {/* 成功メッセージ */}
        <SuccessMessage visible={showSuccess} amount={savedAmount} />

        {/* 我慢ボタン */}
        <ResistButton onClick={handleResist} loading={isSaving} />
      </div>
    </div>
  )
}
