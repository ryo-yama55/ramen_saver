import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateRamenPriceUseCase } from './UpdateRamenPriceUseCase';
import type { IUserProfileRepository } from '@/domain/repositories/IUserProfileRepository';
import type { UserProfile } from '@/domain/entities/UserProfile';

describe('UpdateRamenPriceUseCase', () => {
  let useCase: UpdateRamenPriceUseCase;
  let mockProfileRepo: IUserProfileRepository;

  beforeEach(() => {
    const mockProfile: UserProfile = {
      id: 'test-profile-id',
      ramenPrice: 800,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProfileRepo = {
      get: async () => mockProfile,
      update: async () => mockProfile,
      initialize: async () => mockProfile,
    };

    useCase = new UpdateRamenPriceUseCase(mockProfileRepo);
  });

  describe('execute - 正常系', () => {
    it('ラーメン価格を更新できる', async () => {
      // Arrange
      mockProfileRepo.update = async (input) => ({
        id: 'test-profile-id',
        ramenPrice: input.ramenPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      const result = await useCase.execute({ ramenPrice: 900 });

      // Assert
      expect(result.ramenPrice).toBe(900);
    });

    it('0円で更新できる', async () => {
      // Arrange
      mockProfileRepo.update = async (input) => ({
        id: 'test-profile-id',
        ramenPrice: input.ramenPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      const result = await useCase.execute({ ramenPrice: 0 });

      // Assert
      expect(result.ramenPrice).toBe(0);
    });
  });

  describe('execute - 異常系', () => {
    it('更新に失敗した場合はエラーを投げる', async () => {
      // Arrange
      mockProfileRepo.update = async () => {
        throw new Error('Failed to update profile');
      };

      // Act & Assert
      await expect(useCase.execute({ ramenPrice: 900 })).rejects.toThrow(
        'Failed to update profile'
      );
    });
  });
});
