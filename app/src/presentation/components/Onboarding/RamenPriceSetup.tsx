/**
 * ラーメン価格設定画面コンポーネント
 *
 * 初回セットアップ時にラーメン価格を設定する画面
 */

import React, { useState } from 'react'
import { DEFAULT_RAMEN_PRICE } from '@/domain/entities/UserProfile'

/** 価格の最小値 */
const MIN_PRICE = 100

/** 価格の最大値 */
const MAX_PRICE = 3000

export type RamenPriceSetupProps = {
  /** デフォルトのラーメン価格 */
  defaultPrice?: number
  /** 「完了」ボタンがクリックされたときのコールバック */
  onComplete: (price: number) => void
  /** 外部から渡されるエラーメッセージ（保存失敗時など） */
  externalError?: string | null
}

/**
 * ラーメン価格設定画面コンポーネント
 */
export const RamenPriceSetup = ({
  defaultPrice = DEFAULT_RAMEN_PRICE,
  onComplete,
  externalError = null,
}: RamenPriceSetupProps) => {
  const [price, setPrice] = useState<string>(defaultPrice.toString())
  const [error, setError] = useState<string | null>(null)

  // 外部エラーまたは内部エラーを表示
  const displayError = externalError || error

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

  const handleComplete = () => {
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

    onComplete(priceNum)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        {/* タイトル */}
        <div className="text-center space-y-4">
          <div className="text-6xl">🍜</div>
          <h1 className="text-3xl font-bold text-gray-800">ラーメン価格を設定</h1>
          <p className="text-gray-600">
            あなたがよく食べる
            <br />
            ラーメンの価格を教えてください
          </p>
        </div>

        {/* 入力フォーム */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {/* 価格入力 */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              ラーメンの価格
            </label>
            <div className="relative">
              <input
                type="number"
                id="price"
                inputMode="numeric"
                value={price}
                onChange={e => handlePriceChange(e.target.value)}
                aria-label="ラーメンの価格"
                aria-invalid={!!displayError}
                aria-describedby={displayError ? 'price-error' : undefined}
                className="w-full px-4 py-3 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                placeholder="800"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-500">
                円
              </span>
            </div>
          </div>

          {/* エラーメッセージ */}
          {displayError && (
            <div
              id="price-error"
              role="alert"
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {displayError}
            </div>
          )}

          {/* ヒント */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>💡 一般的なラーメンの価格: 800円〜1,000円</p>
            <p>💡 後から設定画面で変更できます</p>
          </div>
        </div>

        {/* 完了ボタン */}
        <button
          onClick={handleComplete}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          完了
        </button>
      </div>
    </div>
  )
}
