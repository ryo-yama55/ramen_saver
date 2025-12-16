import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetMonthlySavingsUseCase } from './GetMonthlySavingsUseCase'
import type { ISavingsRecordRepository } from '@/domain/repositories/ISavingsRecordRepository'

describe('GetMonthlySavingsUseCase', () => {
  let useCase: GetMonthlySavingsUseCase
  let mockSavingsRepo: ISavingsRecordRepository

  beforeEach(() => {
    // 現在時刻を2025年12月に固定
    vi.setSystemTime(new Date('2025-12-15T10:00:00Z'))

    mockSavingsRepo = {
      findAll: async () => [],
      findById: async () => null,
      create: async () => ({
        id: 'test-id',
        amount: 800,
        recordedAt: new Date(),
        isDeleted: false,
      }),
      delete: async () => {},
      getTotalSavings: async () => 0,
      getMonthlySavings: async () => 0,
      getTotalCount: async () => 0,
    }

    useCase = new GetMonthlySavingsUseCase(mockSavingsRepo)
  })

  describe('execute - 正常系', () => {
    it('今月の貯金額を取得できる', async () => {
      // Arrange
      mockSavingsRepo.getMonthlySavings = async (year, month) => {
        if (year === 2025 && month === 12) {
          return 1600
        }
        return 0
      }

      // Act
      const result = await useCase.execute()

      // Assert
      expect(result).toBe(1600)
    })

    it('指定した年月の貯金額を取得できる', async () => {
      // Arrange
      mockSavingsRepo.getMonthlySavings = async (year, month) => {
        if (year === 2025 && month === 11) {
          return 2400
        }
        return 0
      }

      // Act
      const result = await useCase.execute({ year: 2025, month: 11 })

      // Assert
      expect(result).toBe(2400)
    })

    it('記録がない月の場合は0を返す', async () => {
      // Arrange
      mockSavingsRepo.getMonthlySavings = async () => 0

      // Act
      const result = await useCase.execute()

      // Assert
      expect(result).toBe(0)
    })
  })

  describe('execute - 異常系', () => {
    it('取得に失敗した場合はエラーを投げる', async () => {
      // Arrange
      mockSavingsRepo.getMonthlySavings = async () => {
        throw new Error('Failed to get monthly savings')
      }

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow(
        'Failed to get monthly savings'
      )
    })
  })
})
