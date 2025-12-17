/**
 * 貯金記録リポジトリ（LocalStorage実装）
 *
 * LocalStorageを使用してデータを永続化する実装
 */

import type {
  SavingsRecord,
  CreateSavingsRecordInput,
  SavingsRecordFilters,
} from '@/domain/entities/SavingsRecord'
import type { ISavingsRecordRepository } from '@/domain/repositories/ISavingsRecordRepository'

const STORAGE_KEY = 'ramen-saver:savings-records'

// エラーメッセージ定数
const ERROR_MESSAGES = {
  INVALID_AMOUNT: 'Amount must be a positive number',
  INVALID_OFFSET: 'Offset must be a non-negative number',
  INVALID_LIMIT: 'Limit must be a non-negative number',
} as const

/**
 * LocalStorageに保存される貯金記録の型
 */
type StoredSavingsRecord = Omit<SavingsRecord, 'recordedAt'> & {
  recordedAt: string // ISO8601形式の文字列
}

/**
 * LocalStorageを使用した貯金記録リポジトリ
 */
export class LocalStorageSavingsRecordRepository implements ISavingsRecordRepository {
  /**
   * LocalStorageから記録を取得
   */
  private getRecords(): SavingsRecord[] {
    try {
      const json = localStorage.getItem(STORAGE_KEY)
      if (!json) return []

      const data = JSON.parse(json)

      // 配列でない場合は空配列を返す
      if (!Array.isArray(data)) {
        console.warn('Invalid data format in localStorage')
        return []
      }

      // Date型に変換
      return (data as StoredSavingsRecord[]).map(record => {
        const date = new Date(record.recordedAt)
        if (isNaN(date.getTime())) {
          console.warn(`Invalid date for record ${record.id}: ${record.recordedAt}`)
        }
        return {
          ...record,
          recordedAt: date,
        }
      })
    } catch (error) {
      console.error('Failed to parse savings records from localStorage:', error)
      return []
    }
  }

  /**
   * LocalStorageに記録を保存
   */
  private saveRecords(records: SavingsRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    } catch (error) {
      console.error('Failed to save records to localStorage:', error)
      throw new Error('Failed to persist savings records')
    }
  }

  /**
   * 記録を全件取得
   */
  async findAll(filters?: SavingsRecordFilters): Promise<SavingsRecord[]> {
    // ページネーションパラメータの検証
    if (filters?.offset !== undefined && filters.offset < 0) {
      throw new Error(ERROR_MESSAGES.INVALID_OFFSET)
    }
    if (filters?.limit !== undefined && filters.limit < 0) {
      throw new Error(ERROR_MESSAGES.INVALID_LIMIT)
    }

    let records = this.getRecords().filter(r => !r.isDeleted)

    // フィルタリング
    if (filters?.startDate) {
      records = records.filter(r => r.recordedAt >= filters.startDate!)
    }
    if (filters?.endDate) {
      records = records.filter(r => r.recordedAt <= filters.endDate!)
    }

    // ソート（新しい順）
    records.sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime())

    // ページング
    if (filters?.offset !== undefined || filters?.limit !== undefined) {
      const start = filters.offset ?? 0
      const end = filters.limit !== undefined ? start + filters.limit : undefined
      records = records.slice(start, end)
    }

    return records
  }

  /**
   * IDで記録を取得
   */
  async findById(id: string): Promise<SavingsRecord | null> {
    const records = this.getRecords()
    return records.find(r => r.id === id && !r.isDeleted) || null
  }

  /**
   * 新規記録を作成
   */
  async create(input: CreateSavingsRecordInput): Promise<SavingsRecord> {
    // 入力値検証
    if (!Number.isFinite(input.amount) || input.amount < 0) {
      throw new Error(ERROR_MESSAGES.INVALID_AMOUNT)
    }

    const records = this.getRecords()

    const newRecord: SavingsRecord = {
      id: crypto.randomUUID(),
      amount: input.amount,
      recordedAt: new Date(),
      isDeleted: false,
    }

    records.push(newRecord)
    this.saveRecords(records)

    return newRecord
  }

  /**
   * 記録を削除（論理削除）
   */
  async delete(id: string): Promise<void> {
    const records = this.getRecords()
    const record = records.find(r => r.id === id)

    if (record) {
      record.isDeleted = true
      this.saveRecords(records)
    }
  }

  /**
   * 総貯金額を計算
   */
  async getTotalSavings(): Promise<number> {
    const records = this.getRecords().filter(r => !r.isDeleted)
    return records.reduce((sum, record) => sum + record.amount, 0)
  }

  /**
   * 今月の貯金額を計算
   */
  async getMonthlySavings(year: number, month: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59, 999)

    const records = this.getRecords()
      .filter(r => !r.isDeleted)
      .filter(r => r.recordedAt >= startDate && r.recordedAt <= endDate)

    return records.reduce((sum, record) => sum + record.amount, 0)
  }

  /**
   * 累計貯金回数を取得
   */
  async getTotalCount(): Promise<number> {
    const records = this.getRecords().filter(r => !r.isDeleted)
    return records.length
  }
}
