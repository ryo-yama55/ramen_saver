import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetUserProfileUseCase } from './GetUserProfileUseCase'
import type { IUserProfileRepository } from '@/domain/repositories/IUserProfileRepository'
import type { UserProfile } from '@/domain/entities/UserProfile'

describe('GetUserProfileUseCase', () => {
  let mockRepository: IUserProfileRepository
  let useCase: GetUserProfileUseCase

  beforeEach(() => {
    mockRepository = {
      getProfile: vi.fn(),
      update: vi.fn(),
      exists: vi.fn(),
    }
    useCase = new GetUserProfileUseCase(mockRepository)
  })

  it('プロフィールが存在する場合は取得できる', async () => {
    const mockProfile: UserProfile = {
      id: 'test-id',
      ramenPrice: 800,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    }

    mockRepository.getProfile = vi.fn().mockResolvedValue(mockProfile)

    const result = await useCase.execute()

    expect(result).toEqual(mockProfile)
    expect(mockRepository.getProfile).toHaveBeenCalledTimes(1)
  })

  it('プロフィールが存在しない場合はnullを返す', async () => {
    mockRepository.getProfile = vi.fn().mockResolvedValue(null)

    const result = await useCase.execute()

    expect(result).toBeNull()
    expect(mockRepository.getProfile).toHaveBeenCalledTimes(1)
  })

  it('リポジトリでエラーが発生した場合はエラーをスローする', async () => {
    const error = new Error('Repository error')
    mockRepository.getProfile = vi.fn().mockRejectedValue(error)

    await expect(useCase.execute()).rejects.toThrow('Repository error')
  })
})
