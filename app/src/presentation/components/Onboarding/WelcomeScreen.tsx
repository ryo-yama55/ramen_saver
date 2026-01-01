/**
 * ウェルカム画面コンポーネント
 *
 * 初回アクセス時に表示される画面
 * アプリの目的と使い方を説明する
 */

export type WelcomeScreenProps = {
  /** 「始める」ボタンがクリックされたときのコールバック */
  onStart: () => void
}

/**
 * ウェルカム画面コンポーネント
 */
export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* ロゴ・タイトル */}
        <div className="space-y-4">
          <div className="text-6xl">🍜</div>
          <h1 className="text-4xl font-bold text-gray-800">ラーメン貯金</h1>
          <p className="text-lg text-gray-600">
            ラーメンを我慢して
            <br />
            貯金するWebアプリ
          </p>
        </div>

        {/* 使い方の説明 */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">使い方はかんたん</h2>

          <div className="space-y-4 text-left">
            {/* ステップ1 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-800">ラーメンを我慢する</p>
                <p className="text-sm text-gray-600">食べたくなったら思いとどまる</p>
              </div>
            </div>

            {/* ステップ2 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-800">ボタンをタップ</p>
                <p className="text-sm text-gray-600">我慢したことを記録する</p>
              </div>
            </div>

            {/* ステップ3 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-800">貯金額を確認</p>
                <p className="text-sm text-gray-600">どんどん貯まっていく成果を実感</p>
              </div>
            </div>
          </div>
        </div>

        {/* 始めるボタン */}
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          始める
        </button>
      </div>
    </div>
  )
}
