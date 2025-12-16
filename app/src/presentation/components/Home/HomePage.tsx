/**
 * ホームページコンポーネント
 *
 * ラーメン我慢アプリのメインページ
 */

import { useState, useEffect } from 'react'
import type { GetTotalSavingsUseCase } from '@/application/usecases/GetTotalSavingsUseCase'
import type { GetMonthlySavingsUseCase } from '@/application/usecases/GetMonthlySavingsUseCase'
import type { SaveRamenResistanceUseCase } from '@/application/usecases/SaveRamenResistanceUseCase'
import { SavingsDisplay } from './SavingsDisplay'
import { ResistButton } from './ResistButton'
import { SuccessMessage } from './SuccessMessage'

export type HomePageProps = {
  getTotalSavingsUseCase: GetTotalSavingsUseCase
  getMonthlySavingsUseCase: GetMonthlySavingsUseCase
  saveRamenResistanceUseCase: SaveRamenResistanceUseCase
}

/**
 * ホームページコンポーネント
 */
export const HomePage = ({
  getTotalSavingsUseCase,
  getMonthlySavingsUseCase,
  saveRamenResistanceUseCase,
}: HomePageProps) => {
  const [totalSavings, setTotalSavings] = useState(0)
  const [monthlySavings, setMonthlySavings] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [savedAmount, setSavedAmount] = useState(0)

  // 初期データ取得
  const fetchSavings = async () => {
    try {
      const [total, monthly] = await Promise.all([
        getTotalSavingsUseCase.execute(),
        getMonthlySavingsUseCase.execute(),
      ])
      setTotalSavings(total)
      setMonthlySavings(monthly)
    } catch (error) {
      console.error('Failed to fetch savings:', error)
      setTotalSavings(0)
      setMonthlySavings(0)
    }
  }

  useEffect(() => {
    fetchSavings()
  }, [])

  // 我慢ボタンクリックハンドラ
  const handleResist = async () => {
    setIsSaving(true)
    try {
      const record = await saveRamenResistanceUseCase.execute()
      setSavedAmount(record.amount)
      setShowSuccess(true)

      // 貯金額を再取得
      await fetchSavings()

      // 3秒後に成功メッセージを非表示
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Failed to save resistance:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-6">
      <div className="max-w-md mx-auto space-y-8">
        {/* ヘッダー */}
        <header className="text-center pt-8">
          <h1 className="text-3xl font-bold text-gray-800">ラーメン貯金</h1>
          <p className="text-gray-600 mt-2">我慢して貯金しよう!</p>
        </header>

        {/* 貯金額表示 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <SavingsDisplay
            totalSavings={totalSavings}
            monthlySavings={monthlySavings}
          />
        </div>

        {/* 成功メッセージ */}
        <SuccessMessage visible={showSuccess} amount={savedAmount} />

        {/* 我慢ボタン */}
        <ResistButton onClick={handleResist} loading={isSaving} />
      </div>
    </div>
  )
}
