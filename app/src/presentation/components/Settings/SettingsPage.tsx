/**
 * 設定画面コンポーネント
 *
 * ラーメン価格の変更やアプリバージョンの表示を行う
 */

import React, { useState, useEffect, useCallback } from 'react'
import type { GetUserProfileUseCase } from '@/application/usecases/GetUserProfileUseCase'
import type { UpdateRamenPriceUseCase } from '@/application/usecases/UpdateRamenPriceUseCase'
import { DEFAULT_RAMEN_PRICE } from '@/domain/entities/UserProfile'

/** 価格の最小値 */
const MIN_PRICE = 100

/** 価格の最大値 */
const MAX_PRICE = 3000

/** 成功メッセージの表示時間（ミリ秒） */
const SUCCESS_MESSAGE_DURATION = 3000

/** アプリバージョン */
const APP_VERSION = '0.0.0'

export type SettingsPageProps = {
  /** ユーザープロフィール取得ユースケース */
  getUserProfileUseCase: GetUserProfileUseCase
  /** ラーメン価格更新ユースケース */
  updateRamenPriceUseCase: UpdateRamenPriceUseCase
  /** ホームへ戻るボタンがクリックされたときのコールバック */
  onNavigateToHome?: () => void
}

/**
 * 設定画面コンポーネント
 */
export const SettingsPage = ({
  getUserProfileUseCase,
  updateRamenPriceUseCase,
  onNavigateToHome,
}: SettingsPageProps) => {
  const [currentPrice, setCurrentPrice] = useState<number>(DEFAULT_RAMEN_PRICE)
  const [price, setPrice] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 現在の価格を取得
  const fetchCurrentPrice = useCallback(async () => {
    setIsLoading(true)
    try {
      const profile = await getUserProfileUseCase.execute()
      const ramenPrice = profile?.ramenPrice ?? DEFAULT_RAMEN_PRICE
      setCurrentPrice(ramenPrice)
      setPrice(ramenPrice.toString())
      setError(null)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      setError('設定の読み込みに失敗しました')
      setCurrentPrice(DEFAULT_RAMEN_PRICE)
      setPrice(DEFAULT_RAMEN_PRICE.toString())
    } finally {
      setIsLoading(false)
    }
  }, [getUserProfileUseCase])

  useEffect(() => {
    fetchCurrentPrice()
  }, [fetchCurrentPrice])

  const handlePriceChange = (value: string) => {
    // 数字のみ許可
    if (value === '' || /^\d+$/.test(value)) {
      setPrice(value)
      // 入力が空でない場合のみエラーをクリア
      if (value !== '') {
        setError(null)
      }
    }
  }

  const handleSave = async () => {
    const priceNum = Number(price)

    // バリデーション
    if (price === '' || isNaN(priceNum)) {
      setError('価格を入力してください')
      return
    }

    if (priceNum < MIN_PRICE) {
      setError(`価格は${MIN_PRICE}円以上で入力してください`)
      return
    }

    if (priceNum > MAX_PRICE) {
      setError(`価格は${MAX_PRICE}円以下で入力してください`)
      return
    }

    setIsSaving(true)
    setError(null)
    try {
      await updateRamenPriceUseCase.execute({ ramenPrice: priceNum })
      setCurrentPrice(priceNum)
      setShowSuccess(true)
    } catch (error) {
      console.error('Failed to update ramen price:', error)
      setError('設定の保存に失敗しました')
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">⚙️</div>
          <p className="text-lg text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-6">
      <div className="max-w-md mx-auto space-y-8">
        {/* ヘッダー */}
        <header className="text-center pt-8">
          <div className="flex justify-between items-center mb-4">
            {onNavigateToHome && (
              <button
                type="button"
                onClick={onNavigateToHome}
                className="text-gray-600 hover:text-gray-800 transition-colors"
                aria-label="ホームに戻る"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">設定</h1>
            </div>
            <div className="w-10" />
          </div>
        </header>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* 成功メッセージ */}
        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
            <p className="font-bold">設定を更新しました</p>
          </div>
        )}

        {/* 価格設定 */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-5xl">🍜</div>
              <h2 className="text-xl font-bold text-gray-800">ラーメン価格設定</h2>
              <p className="text-sm text-gray-600">現在の設定: {currentPrice}円</p>
            </div>

            {/* 価格入力 */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                新しい価格
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="price"
                  inputMode="numeric"
                  value={price}
                  onChange={e => handlePriceChange(e.target.value)}
                  aria-label="ラーメンの価格"
                  aria-invalid={!!error}
                  aria-describedby={error ? 'price-error' : undefined}
                  className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                  placeholder="800"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-500">
                  円
                </span>
              </div>
            </div>

            {/* ヒント */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>💡 一般的なラーメンの価格: 800円〜1,000円</p>
              <p>⚠️ 価格変更は次回の記録から適用されます</p>
            </div>
          </div>

          {/* 保存ボタン */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>

        {/* アプリ情報 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">アプリ情報</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>バージョン</span>
              <span className="font-mono">{APP_VERSION}</span>
            </div>
            <div className="flex justify-between">
              <span>アプリ名</span>
              <span>ラーメン貯金</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
