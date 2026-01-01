/**
 * オンボーディングフローコンポーネント
 *
 * ウェルカム画面とラーメン価格設定のフローを管理する
 */

import { useState } from 'react'
import type { InitializeUserProfileUseCase } from '@/application/usecases/InitializeUserProfileUseCase'
import { WelcomeScreen } from './WelcomeScreen'
import { RamenPriceSetup } from './RamenPriceSetup'

type OnboardingStep = 'welcome' | 'ramen-price-setup'

export type OnboardingFlowProps = {
  /** ユーザープロフィール初期化ユースケース */
  initializeUserProfileUseCase: InitializeUserProfileUseCase
  /** オンボーディング完了時のコールバック */
  onComplete: () => void
}

/**
 * オンボーディングフローコンポーネント
 */
export const OnboardingFlow = ({
  initializeUserProfileUseCase,
  onComplete,
}: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome')
  const [isProcessing, setIsProcessing] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleWelcomeStart = () => {
    setCurrentStep('ramen-price-setup')
    setSaveError(null)
  }

  const handlePriceSetupComplete = async (price: number) => {
    setIsProcessing(true)
    setSaveError(null)
    try {
      // ユーザープロフィールを初期化
      await initializeUserProfileUseCase.execute({ ramenPrice: price })
      // 完了
      onComplete()
    } catch (error) {
      console.error('Failed to initialize user profile:', error)
      setSaveError('設定の保存に失敗しました。もう一度お試しください。')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🍜</div>
          <p className="text-lg text-gray-600">設定を保存しています...</p>
        </div>
      </div>
    )
  }

  if (currentStep === 'welcome') {
    return <WelcomeScreen onStart={handleWelcomeStart} />
  }

  if (currentStep === 'ramen-price-setup') {
    return <RamenPriceSetup onComplete={handlePriceSetupComplete} externalError={saveError} />
  }

  return null
}
