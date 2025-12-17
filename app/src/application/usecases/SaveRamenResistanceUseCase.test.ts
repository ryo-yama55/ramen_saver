import { describe, it, expect, beforeEach } from 'vitest';
import { SaveRamenResistanceUseCase } from './SaveRamenResistanceUseCase';
import type { ISavingsRecordRepository } from '@/domain/repositories/ISavingsRecordRepository';
import type { IUserProfileRepository } from '@/domain/repositories/IUserProfileRepository';
import type { SavingsRecord } from '@/domain/entities/SavingsRecord';
import type { UserProfile } from '@/domain/entities/UserProfile';

describe('SaveRamenResistanceUseCase', () => {
  let useCase: SaveRamenResistanceUseCase;
  let mockSavingsRepo: ISavingsRecordRepository;
  let mockProfileRepo: IUserProfileRepository;

  beforeEach(() => {
    // モックリポジトリの作成
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

    const mockRecord: SavingsRecord = {
      id: 'test-record-id',
      amount: 800,
      recordedAt: new Date(),
      isDeleted: false,
    };

    mockSavingsRepo = {
      findAll: async () => [],
      findById: async () => null,
      create: async () => mockRecord,
      delete: async () => {},
      getTotalSavings: async () => 0,
      getMonthlySavings: async () => 0,
      getTotalCount: async () => 0,
    };

    useCase = new SaveRamenResistanceUseCase(mockSavingsRepo, mockProfileRepo);
  });

  describe('execute - 正常系', () => {
    it('ラーメンを我慢した記録を保存できる', async () => {
      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toBeDefined();
      expect(result.amount).toBe(800);
      expect(result.isDeleted).toBe(false);
      expect(result.recordedAt).toBeInstanceOf(Date);
    });

    it('プロフィールのラーメン価格を使用して記録を作成する', async () => {
      // Arrange
      let capturedAmount: number | undefined;

      mockSavingsRepo.create = async (input) => {
        capturedAmount = input.amount;
        return {
          id: 'test-id',
          amount: input.amount,
          recordedAt: new Date(),
          isDeleted: false,
        };
      };

      // Act
      await useCase.execute();

      // Assert
      expect(capturedAmount).toBe(800);
    });
  });

  describe('execute - 異常系', () => {
    it('プロフィール取得に失敗した場合はエラーを投げる', async () => {
      // Arrange
      mockProfileRepo.get = async () => {
        throw new Error('Profile not found');
      };

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Profile not found');
    });

    it('記録作成に失敗した場合はエラーを投げる', async () => {
      // Arrange
      mockSavingsRepo.create = async () => {
        throw new Error('Failed to create record');
      };

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow(
        'Failed to create record'
      );
    });
  });
});
