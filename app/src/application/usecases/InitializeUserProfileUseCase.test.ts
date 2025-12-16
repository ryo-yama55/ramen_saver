import { describe, it, expect, beforeEach } from 'vitest'
import { InitializeUserProfileUseCase } from './InitializeUserProfileUseCase'
import type { IUserProfileRepository } from '@/domain/repositories/IUserProfileRepository'
import type { UserProfile } from '@/domain/entities/UserProfile'

describe('InitializeUserProfileUseCase', () => {
  let useCase: InitializeUserProfileUseCase
  let mockProfileRepo: IUserProfileRepository

  beforeEach(() => {
    mockProfileRepo = {
      get: async () => ({
        id: 'test-id',
        ramenPrice: 800,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      update: async () => ({
        id: 'test-id',
        ramenPrice: 800,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      initialize: async () => ({
        id: 'test-id',
        ramenPrice: 800,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    }

    useCase = new InitializeUserProfileUseCase(mockProfileRepo)
  })

  describe('execute - 正常系', () => {
    it('デフォルト価格でプロフィールを初期化できる', async () => {
      // Arrange
      mockProfileRepo.initialize = async (ramenPrice) => ({
        id: 'test-id',
        ramenPrice: ramenPrice ?? 800,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Act
      const result = await useCase.execute()

      // Assert
      expect(result).toBeDefined()
      expect(result.ramenPrice).toBe(800)
    })

    it('指定した価格でプロフィールを初期化できる', async () => {
      // Arrange
      let capturedPrice: number | undefined

      mockProfileRepo.initialize = async (ramenPrice) => {
        capturedPrice = ramenPrice
        return {
          id: 'test-id',
          ramenPrice: ramenPrice ?? 800,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }

      // Act
      const result = await useCase.execute({ ramenPrice: 900 })

      // Assert
      expect(result.ramenPrice).toBe(900)
      expect(capturedPrice).toBe(900)
    })

    it('0円で初期化できる', async () => {
      // Arrange
      mockProfileRepo.initialize = async (ramenPrice) => ({
        id: 'test-id',
        ramenPrice: ramenPrice ?? 800,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Act
      const result = await useCase.execute({ ramenPrice: 0 })

      // Assert
      expect(result.ramenPrice).toBe(0)
    })
  })

  describe('execute - 異常系', () => {
    it('初期化に失敗した場合はエラーを投げる', async () => {
      // Arrange
      mockProfileRepo.initialize = async () => {
        throw new Error('Failed to initialize profile')
      }

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow(
        'Failed to initialize profile'
      )
    })
  })
})
