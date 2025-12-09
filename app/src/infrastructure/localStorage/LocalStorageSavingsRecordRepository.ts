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

/**
 * LocalStorageを使用した貯金記録リポジトリ
 */
export class LocalStorageSavingsRecordRepository implements ISavingsRecordRepository {
  /**
   * LocalStorageから記録を取得
   */
  private getRecords(): SavingsRecord[] {
    const json = localStorage.getItem(STORAGE_KEY)
    if (!json) return []

    const data = JSON.parse(json)
    // Date型に変換
    return data.map((record: any) => ({
      ...record,
      recordedAt: new Date(record.recordedAt),
    }))
  }

  /**
   * LocalStorageに記録を保存
   */
  private saveRecords(records: SavingsRecord[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }

  /**
   * 記録を全件取得
   */
  async findAll(filters?: SavingsRecordFilters): Promise<SavingsRecord[]> {
    let records = this.getRecords().filter((r) => !r.isDeleted)

    // フィルタリング
    if (filters?.startDate) {
      records = records.filter((r) => r.recordedAt >= filters.startDate!)
    }
    if (filters?.endDate) {
      records = records.filter((r) => r.recordedAt <= filters.endDate!)
    }

    // ソート（新しい順）
    records.sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime())

    // ページング
    if (filters?.offset !== undefined) {
      records = records.slice(filters.offset)
    }
    if (filters?.limit !== undefined) {
      records = records.slice(0, filters.limit)
    }

    return records
  }

  /**
   * IDで記録を取得
   */
  async findById(id: string): Promise<SavingsRecord | null> {
    const records = this.getRecords()
    return records.find((r) => r.id === id && !r.isDeleted) || null
  }

  /**
   * 新規記録を作成
   */
  async create(input: CreateSavingsRecordInput): Promise<SavingsRecord> {
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
    const record = records.find((r) => r.id === id)

    if (record) {
      record.isDeleted = true
      this.saveRecords(records)
    }
  }

  /**
   * 総貯金額を計算
   */
  async getTotalSavings(): Promise<number> {
    const records = await this.findAll()
    return records.reduce((sum, record) => sum + record.amount, 0)
  }

  /**
   * 今月の貯金額を計算
   */
  async getMonthlySavings(year: number, month: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59, 999)

    const records = await this.findAll({ startDate, endDate })
    return records.reduce((sum, record) => sum + record.amount, 0)
  }

  /**
   * 累計貯金回数を取得
   */
  async getTotalCount(): Promise<number> {
    const records = await this.findAll()
    return records.length
  }
}
