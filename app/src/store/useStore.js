import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      // オンボーディング状態
      isOnboarded: false,
      setIsOnboarded: (value) => set({ isOnboarded: value }),

      // ラーメン価格
      ramenPrice: 800,
      setRamenPrice: (price) => set({ ramenPrice: price }),

      // 我慢記録
      records: [],
      addRecord: (record) => set((state) => ({
        records: [...state.records, record]
      })),
      deleteRecord: (id) => set((state) => ({
        records: state.records.filter((record) => record.id !== id)
      })),

      // 計算されたデータ
      getTotalSavings: () => {
        const { records } = get()
        return records.reduce((total, record) => total + record.amount, 0)
      },
      getMonthSavings: () => {
        const { records } = get()
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        return records
          .filter((record) => {
            const recordDate = new Date(record.date)
            return (
              recordDate.getMonth() === currentMonth &&
              recordDate.getFullYear() === currentYear
            )
          })
          .reduce((total, record) => total + record.amount, 0)
      },
      getTotalCount: () => get().records.length,
      getMonthCount: () => {
        const { records } = get()
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()

        return records.filter((record) => {
          const recordDate = new Date(record.date)
          return (
            recordDate.getMonth() === currentMonth &&
            recordDate.getFullYear() === currentYear
          )
        }).length
      }
    }),
    {
      name: 'ramen-saver-storage', // localStorageのキー名
    }
  )
)

export default useStore
