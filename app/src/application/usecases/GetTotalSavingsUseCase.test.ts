import { describe, it, expect, beforeEach } from 'vitest'
import { GetTotalSavingsUseCase } from './GetTotalSavingsUseCase'
import type { ISavingsRecordRepository } from '@/domain/repositories/ISavingsRecordRepository'

describe('GetTotalSavingsUseCase', () => {
  let useCase: GetTotalSavingsUseCase
  let mockSavingsRepo: ISavingsRecordRepository

  beforeEach(() => {
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

    useCase = new GetTotalSavingsUseCase(mockSavingsRepo)
  })

  describe('execute - 正常系', () => {
    it('総貯金額を取得できる', async () => {
      // Arrange
      mockSavingsRepo.getTotalSavings = async () => 2400

      // Act
      const result = await useCase.execute()

      // Assert
      expect(result).toBe(2400)
    })

    it('記録がない場合は0を返す', async () => {
      // Arrange
      mockSavingsRepo.getTotalSavings = async () => 0

      // Act
      const result = await useCase.execute()

      // Assert
      expect(result).toBe(0)
    })
  })

  describe('execute - 異常系', () => {
    it('取得に失敗した場合はエラーを投げる', async () => {
      // Arrange
      mockSavingsRepo.getTotalSavings = async () => {
        throw new Error('Failed to get total savings')
      }

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow(
        'Failed to get total savings'
      )
    })
  })
})
