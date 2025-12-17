import { useState, useEffect } from 'react'
import { HomePage } from './presentation/components/Home/HomePage'
import { OnboardingFlow } from './presentation/components/Onboarding/OnboardingFlow'
import {
  getTotalSavingsUseCase,
  getMonthlySavingsUseCase,
  saveRamenResistanceUseCase,
  userProfileRepository,
  initializeUserProfileUseCase,
} from './application/di/container'

function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null)

  useEffect(() => {
    const checkProfile = async () => {
      const exists = await userProfileRepository.exists()
      setIsOnboardingComplete(exists)
    }
    checkProfile()
  }, [])

  // プロフィール確認中
  if (isOnboardingComplete === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🍜</div>
          <p className="text-lg text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  // 初回アクセス時はオンボーディング表示
  if (!isOnboardingComplete) {
    return (
      <OnboardingFlow
        initializeUserProfileUseCase={initializeUserProfileUseCase}
        onComplete={() => setIsOnboardingComplete(true)}
      />
    )
  }

  // オンボーディング完了後はホーム画面を表示
  return (
    <HomePage
      getTotalSavingsUseCase={getTotalSavingsUseCase}
      getMonthlySavingsUseCase={getMonthlySavingsUseCase}
      saveRamenResistanceUseCase={saveRamenResistanceUseCase}
    />
  )
}

export default App
