import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageSavingsRecordRepository } from './LocalStorageSavingsRecordRepository'
import type { CreateSavingsRecordInput } from '@/domain/entities/SavingsRecord'

describe('LocalStorageSavingsRecordRepository', () => {
  let repository: LocalStorageSavingsRecordRepository

  beforeEach(() => {
    localStorage.clear()
    repository = new LocalStorageSavingsRecordRepository()
  })

  describe('create - 正常系', () => {
    it('正の金額で貯金記録を作成できる', async () => {
      // Arrange
      const input: CreateSavingsRecordInput = { amount: 800 }

      // Act
      const record = await repository.create(input)

      // Assert
      expect(record).toMatchObject({
        amount: 800,
        isDeleted: false,
      })
      expect(record.id).toBeDefined()
      expect(record.recordedAt).toBeInstanceOf(Date)
    })

    it('作成した記録がlocalStorageに永続化される', async () => {
      // Arrange
      const input: CreateSavingsRecordInput = { amount: 800 }

      // Act
      await repository.create(input)

      // Assert
      const stored = localStorage.getItem('ramen-saver:savings-records')
      expect(stored).toBeDefined()
      const records = JSON.parse(stored!)
      expect(records).toHaveLength(1)
      expect(records[0].amount).toBe(800)
    })
  })

  describe('create - 異常系', () => {
    it('負の金額の場合はエラーを投げる', async () => {
      // Arrange
      const input: CreateSavingsRecordInput = { amount: -100 }

      // Act & Assert
      await expect(repository.create(input)).rejects.toThrow('Amount must be a positive number')
    })

    it('NaNが渡された場合はエラーを投げる', async () => {
      // Arrange
      const input: CreateSavingsRecordInput = { amount: NaN }

      // Act & Assert
      await expect(repository.create(input)).rejects.toThrow('Amount must be a positive number')
    })

    it('Infinityが渡された場合はエラーを投げる', async () => {
      // Arrange
      const input: CreateSavingsRecordInput = { amount: Infinity }

      // Act & Assert
      await expect(repository.create(input)).rejects.toThrow('Amount must be a positive number')
    })
  })

  describe('create - 境界値', () => {
    it('金額が0の場合も保存できる', async () => {
      // Arrange
      const input: CreateSavingsRecordInput = { amount: 0 }

      // Act
      const record = await repository.create(input)

      // Assert
      expect(record.amount).toBe(0)
    })
  })

  describe('findAll - 正常系', () => {
    it('データがない場合は空配列を返す', async () => {
      // Act
      const records = await repository.findAll()

      // Assert
      expect(records).toEqual([])
    })

    it('削除されていない全記録を返す', async () => {
      // Arrange
      await repository.create({ amount: 800 })
      await repository.create({ amount: 800 })

      // Act
      const records = await repository.findAll()

      // Assert
      expect(records).toHaveLength(2)
      expect(records.every(r => !r.isDeleted)).toBe(true)
    })

    it('日付範囲でフィルタリングできる', async () => {
      // Arrange
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      await repository.create({ amount: 800 })

      // Act
      const records = await repository.findAll({
        startDate: yesterday,
        endDate: new Date(),
      })

      // Assert
      expect(records).toHaveLength(1)
    })

    it('limitとoffsetでページネーションできる', async () => {
      // Arrange: 時刻の違いを保証するため、1msずつ遅延させる
      await repository.create({ amount: 100 })
      await new Promise(resolve => setTimeout(resolve, 1))
      await repository.create({ amount: 200 })
      await new Promise(resolve => setTimeout(resolve, 1))
      await repository.create({ amount: 300 })
      await new Promise(resolve => setTimeout(resolve, 1))
      await repository.create({ amount: 400 })
      await new Promise(resolve => setTimeout(resolve, 1))
      await repository.create({ amount: 500 })

      // Act
      const records = await repository.findAll({ limit: 2, offset: 1 })

      // Assert
      expect(records).toHaveLength(2)
      // offset=1で2番目から2件取得（新しい順: 400, 300）
      expect(records[0].amount).toBe(400)
      expect(records[1].amount).toBe(300)
    })

    it('limitだけ指定した場合は先頭からlimit件取得される', async () => {
      // Arrange: 時刻の違いを保証するため、1msずつ遅延させる
      await repository.create({ amount: 100 })
      await new Promise(resolve => setTimeout(resolve, 1))
      await repository.create({ amount: 200 })
      await new Promise(resolve => setTimeout(resolve, 1))
      await repository.create({ amount: 300 })

      // Act
      const records = await repository.findAll({ limit: 2 })

      // Assert
      expect(records).toHaveLength(2)
      // 先頭から2件（新しい順: 300, 200）
      expect(records[0].amount).toBe(300)
      expect(records[1].amount).toBe(200)
    })

    it('offsetだけ指定した場合はoffset以降の全件が取得される', async () => {
      // Arrange: 時刻の違いを保証するため、1msずつ遅延させる
      await repository.create({ amount: 100 })
      await new Promise(resolve => setTimeout(resolve, 1))
      await repository.create({ amount: 200 })
      await new Promise(resolve => setTimeout(resolve, 1))
      await repository.create({ amount: 300 })

      // Act
      const records = await repository.findAll({ offset: 1 })

      // Assert
      expect(records).toHaveLength(2)
      // offset=1で2番目以降（新しい順: 200, 100）
      expect(records[0].amount).toBe(200)
      expect(records[1].amount).toBe(100)
    })

    it('削除済み記録は結果に含まれない', async () => {
      // Arrange
      const record1 = await repository.create({ amount: 800 })
      await repository.create({ amount: 800 })
      await repository.delete(record1.id)

      // Act
      const records = await repository.findAll()

      // Assert
      expect(records).toHaveLength(1)
    })
  })

  describe('findAll - 異常系', () => {
    it('offsetが負の値の場合はエラーを投げる', async () => {
      // Act & Assert
      await expect(repository.findAll({ offset: -1 })).rejects.toThrow(
        'Offset must be a non-negative number'
      )
    })

    it('limitが負の値の場合はエラーを投げる', async () => {
      // Act & Assert
      await expect(repository.findAll({ limit: -1 })).rejects.toThrow(
        'Limit must be a non-negative number'
      )
    })
  })

  describe('findById - 正常系', () => {
    it('存在しないIDの場合はnullを返す', async () => {
      // Act
      const record = await repository.findById('non-existent-id')

      // Assert
      expect(record).toBeNull()
    })

    it('IDで記録を取得できる', async () => {
      // Arrange
      const created = await repository.create({ amount: 800 })

      // Act
      const found = await repository.findById(created.id)

      // Assert
      expect(found).toMatchObject({
        id: created.id,
        amount: 800,
      })
    })

    it('削除済み記録の場合はnullを返す', async () => {
      // Arrange
      const created = await repository.create({ amount: 800 })
      await repository.delete(created.id)

      // Act
      const found = await repository.findById(created.id)

      // Assert
      expect(found).toBeNull()
    })
  })

  describe('delete - 正常系', () => {
    it('記録を論理削除する', async () => {
      // Arrange
      const created = await repository.create({ amount: 800 })

      // Act
      await repository.delete(created.id)

      // Assert
      const found = await repository.findById(created.id)
      expect(found).toBeNull()
    })

    it('存在しないIDを削除してもエラーにならない', async () => {
      // Act & Assert
      await expect(repository.delete('non-existent-id')).resolves.not.toThrow()
    })
  })

  describe('getTotalSavings - 正常系', () => {
    it('データがない場合は0を返す', async () => {
      // Act
      const total = await repository.getTotalSavings()

      // Assert
      expect(total).toBe(0)
    })

    it('全記録の合計金額を計算する', async () => {
      // Arrange
      await repository.create({ amount: 800 })
      await repository.create({ amount: 800 })
      await repository.create({ amount: 800 })

      // Act
      const total = await repository.getTotalSavings()

      // Assert
      expect(total).toBe(2400)
    })

    it('削除済み記録は合計に含まれない', async () => {
      // Arrange
      await repository.create({ amount: 800 })
      const record2 = await repository.create({ amount: 800 })
      await repository.delete(record2.id)

      // Act
      const total = await repository.getTotalSavings()

      // Assert
      expect(total).toBe(800)
    })
  })

  describe('getMonthlySavings - 正常系', () => {
    it('指定月にデータがない場合は0を返す', async () => {
      // Act
      const total = await repository.getMonthlySavings(2025, 1)

      // Assert
      expect(total).toBe(0)
    })

    it('指定月の合計金額を計算する', async () => {
      // Arrange
      await repository.create({ amount: 800 })
      await repository.create({ amount: 800 })

      // Act
      const now = new Date()
      const total = await repository.getMonthlySavings(now.getFullYear(), now.getMonth() + 1)

      // Assert
      expect(total).toBe(1600)
    })

    it('指定月以外の記録は含まれない', async () => {
      // Arrange
      await repository.create({ amount: 800 })

      // Act
      const total = await repository.getMonthlySavings(2020, 1)

      // Assert
      expect(total).toBe(0)
    })
  })

  describe('getTotalCount - 正常系', () => {
    it('データがない場合は0を返す', async () => {
      // Act
      const count = await repository.getTotalCount()

      // Assert
      expect(count).toBe(0)
    })

    it('全記録の件数を数える', async () => {
      // Arrange
      await repository.create({ amount: 800 })
      await repository.create({ amount: 800 })
      await repository.create({ amount: 800 })

      // Act
      const count = await repository.getTotalCount()

      // Assert
      expect(count).toBe(3)
    })

    it('削除済み記録は件数に含まれない', async () => {
      // Arrange
      await repository.create({ amount: 800 })
      const record2 = await repository.create({ amount: 800 })
      await repository.delete(record2.id)

      // Act
      const count = await repository.getTotalCount()

      // Assert
      expect(count).toBe(1)
    })
  })

  describe('getRecords - データ整合性', () => {
    it('壊れたJSONの場合は空配列を返す', () => {
      // Arrange
      localStorage.setItem('ramen-saver:savings-records', 'invalid-json{')

      // Act
      const records = repository['getRecords']()

      // Assert
      expect(records).toEqual([])
    })

    it('不正な日付文字列でもDateオブジェクトに変換される', () => {
      // Arrange
      localStorage.setItem(
        'ramen-saver:savings-records',
        JSON.stringify([{ id: '1', amount: 800, recordedAt: 'not-a-date', isDeleted: false }])
      )

      // Act
      const records = repository['getRecords']()

      // Assert
      expect(records[0].recordedAt).toBeInstanceOf(Date)
      expect(records[0].recordedAt.toString()).toBe('Invalid Date')
    })
  })
})
