import { useState, useEffect } from 'react'
import { HomePage } from './presentation/components/Home/HomePage'
import { SavingsHistoryPage } from './presentation/components/History/SavingsHistoryPage'
import { SettingsPage } from './presentation/components/Settings/SettingsPage'
import { OnboardingFlow } from './presentation/components/Onboarding/OnboardingFlow'
import {
  getTotalSavingsUseCase,
  getMonthlySavingsUseCase,
  saveRamenResistanceUseCase,
  getSavingsHistoryUseCase,
  getUserProfileUseCase,
  updateRamenPriceUseCase,
  userProfileRepository,
  initializeUserProfileUseCase,
} from './application/di/container'

type Page = 'home' | 'history' | 'settings'

function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null)
  const [currentPage, setCurrentPage] = useState<Page>('home')

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const exists = await userProfileRepository.exists()
        setIsOnboardingComplete(exists)
      } catch (error) {
        console.error('Failed to check profile:', error)
        // エラー時は初回ユーザーとして扱う
        setIsOnboardingComplete(false)
      }
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

  // ナビゲーションハンドラ
  const handleNavigateToHome = () => setCurrentPage('home')
  const handleNavigateToHistory = () => setCurrentPage('history')
  const handleNavigateToSettings = () => setCurrentPage('settings')

  // オンボーディング完了後はページ表示
  if (currentPage === 'home') {
    return (
      <HomePage
        getTotalSavingsUseCase={getTotalSavingsUseCase}
        getMonthlySavingsUseCase={getMonthlySavingsUseCase}
        saveRamenResistanceUseCase={saveRamenResistanceUseCase}
        onNavigateToHistory={handleNavigateToHistory}
        onNavigateToSettings={handleNavigateToSettings}
      />
    )
  }

  if (currentPage === 'history') {
    return (
      <SavingsHistoryPage
        getSavingsHistoryUseCase={getSavingsHistoryUseCase}
        onNavigateToHome={handleNavigateToHome}
      />
    )
  }

  if (currentPage === 'settings') {
    return (
      <SettingsPage
        getUserProfileUseCase={getUserProfileUseCase}
        updateRamenPriceUseCase={updateRamenPriceUseCase}
        onNavigateToHome={handleNavigateToHome}
      />
    )
  }

  return null
}

export default App
