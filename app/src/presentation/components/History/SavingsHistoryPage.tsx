import { useEffect, useState } from 'react'
import type { GetSavingsHistoryUseCase } from '@/application/usecases/GetSavingsHistoryUseCase'
import type { SavingsRecord } from '@/domain/entities/SavingsRecord'
import { formatCurrency } from '@/presentation/utils/currency'
import { formatDate, formatTime } from '@/presentation/utils/date'

type SavingsHistoryPageProps = {
  getSavingsHistoryUseCase: GetSavingsHistoryUseCase
}

export function SavingsHistoryPage({ getSavingsHistoryUseCase }: SavingsHistoryPageProps) {
  const [records, setRecords] = useState<SavingsRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getSavingsHistoryUseCase.execute()
        setRecords(history)
      } finally {
        setIsLoading(false)
      }
    }
    loadHistory()
  }, [getSavingsHistoryUseCase])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-6">
        <div className="text-center text-gray-600">読み込み中...</div>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">貯金履歴</h1>
          <div className="text-center py-12">
            <p className="text-gray-500">まだ記録がありません</p>
            <p className="text-sm text-gray-400 mt-2">ラーメンを我慢したら記録が表示されます</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">貯金履歴</h1>
        <div className="space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">{formatDate(record.recordedAt)}</p>
                  <p className="text-xs text-gray-400">{formatTime(record.recordedAt)}</p>
                </div>
                <div className="text-xl font-bold text-amber-600">
                  {formatCurrency(record.amount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
