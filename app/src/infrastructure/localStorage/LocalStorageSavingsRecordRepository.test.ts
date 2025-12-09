import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageSavingsRecordRepository } from './LocalStorageSavingsRecordRepository'
import type { CreateSavingsRecordInput } from '@/domain/entities/SavingsRecord'

describe('LocalStorageSavingsRecordRepository', () => {
  let repository: LocalStorageSavingsRecordRepository

  beforeEach(() => {
    repository = new LocalStorageSavingsRecordRepository()
  })

  describe('create', () => {
    it('should create a new savings record', async () => {
      const input: CreateSavingsRecordInput = { amount: 800 }

      const record = await repository.create(input)

      expect(record).toMatchObject({
        amount: 800,
        isDeleted: false,
      })
      expect(record.id).toBeDefined()
      expect(record.recordedAt).toBeInstanceOf(Date)
    })

    it('should persist record to localStorage', async () => {
      const input: CreateSavingsRecordInput = { amount: 800 }

      await repository.create(input)

      const stored = localStorage.getItem('ramen-saver:savings-records')
      expect(stored).toBeDefined()
      const records = JSON.parse(stored!)
      expect(records).toHaveLength(1)
      expect(records[0].amount).toBe(800)
    })
  })

  describe('findAll', () => {
    it('should return empty array when no records exist', async () => {
      const records = await repository.findAll()

      expect(records).toEqual([])
    })

    it('should return all non-deleted records', async () => {
      await repository.create({ amount: 800 })
      await repository.create({ amount: 800 })

      const records = await repository.findAll()

      expect(records).toHaveLength(2)
      expect(records.every(r => !r.isDeleted)).toBe(true)
    })

    it('should filter by date range', async () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      await repository.create({ amount: 800 })

      const records = await repository.findAll({
        startDate: yesterday,
        endDate: new Date(),
      })

      expect(records).toHaveLength(1)
    })

    it('should respect limit and offset', async () => {
      await repository.create({ amount: 800 })
      await repository.create({ amount: 800 })
      await repository.create({ amount: 800 })

      const records = await repository.findAll({ limit: 2, offset: 1 })

      expect(records).toHaveLength(2)
    })

    it('should exclude deleted records', async () => {
      const record1 = await repository.create({ amount: 800 })
      await repository.create({ amount: 800 })
      await repository.delete(record1.id)

      const records = await repository.findAll()

      expect(records).toHaveLength(1)
    })
  })

  describe('findById', () => {
    it('should return null when record does not exist', async () => {
      const record = await repository.findById('non-existent-id')

      expect(record).toBeNull()
    })

    it('should return record by id', async () => {
      const created = await repository.create({ amount: 800 })

      const found = await repository.findById(created.id)

      expect(found).toMatchObject({
        id: created.id,
        amount: 800,
      })
    })

    it('should return null for deleted record', async () => {
      const created = await repository.create({ amount: 800 })
      await repository.delete(created.id)

      const found = await repository.findById(created.id)

      expect(found).toBeNull()
    })
  })

  describe('delete', () => {
    it('should mark record as deleted', async () => {
      const created = await repository.create({ amount: 800 })

      await repository.delete(created.id)

      const found = await repository.findById(created.id)
      expect(found).toBeNull()
    })

    it('should not throw error when deleting non-existent record', async () => {
      await expect(repository.delete('non-existent-id')).resolves.not.toThrow()
    })
  })

  describe('getTotalSavings', () => {
    it('should return 0 when no records exist', async () => {
      const total = await repository.getTotalSavings()

      expect(total).toBe(0)
    })

    it('should calculate total savings', async () => {
      await repository.create({ amount: 800 })
      await repository.create({ amount: 800 })
      await repository.create({ amount: 800 })

      const total = await repository.getTotalSavings()

      expect(total).toBe(2400)
    })

    it('should exclude deleted records', async () => {
      await repository.create({ amount: 800 })
      const record2 = await repository.create({ amount: 800 })
      await repository.delete(record2.id)

      const total = await repository.getTotalSavings()

      expect(total).toBe(800)
    })
  })

  describe('getMonthlySavings', () => {
    it('should return 0 when no records exist for the month', async () => {
      const total = await repository.getMonthlySavings(2025, 1)

      expect(total).toBe(0)
    })

    it('should calculate monthly savings', async () => {
      await repository.create({ amount: 800 })
      await repository.create({ amount: 800 })

      const now = new Date()
      const total = await repository.getMonthlySavings(
        now.getFullYear(),
        now.getMonth() + 1
      )

      expect(total).toBe(1600)
    })

    it('should only include records from specified month', async () => {
      await repository.create({ amount: 800 })

      const total = await repository.getMonthlySavings(2020, 1)

      expect(total).toBe(0)
    })
  })

  describe('getTotalCount', () => {
    it('should return 0 when no records exist', async () => {
      const count = await repository.getTotalCount()

      expect(count).toBe(0)
    })

    it('should count all non-deleted records', async () => {
      await repository.create({ amount: 800 })
      await repository.create({ amount: 800 })
      await repository.create({ amount: 800 })

      const count = await repository.getTotalCount()

      expect(count).toBe(3)
    })

    it('should exclude deleted records', async () => {
      await repository.create({ amount: 800 })
      const record2 = await repository.create({ amount: 800 })
      await repository.delete(record2.id)

      const count = await repository.getTotalCount()

      expect(count).toBe(1)
    })
  })
})
