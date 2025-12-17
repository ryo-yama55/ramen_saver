import { describe, it, expect, beforeEach } from 'vitest';
import { GetSavingsHistoryUseCase } from './GetSavingsHistoryUseCase';
import type { ISavingsRecordRepository } from '@/domain/repositories/ISavingsRecordRepository';
import type { SavingsRecord } from '@/domain/entities/SavingsRecord';

describe('GetSavingsHistoryUseCase', () => {
  let useCase: GetSavingsHistoryUseCase;
  let mockSavingsRepo: ISavingsRecordRepository;

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
    };

    useCase = new GetSavingsHistoryUseCase(mockSavingsRepo);
  });

  describe('execute - 正常系', () => {
    it('全ての貯金履歴を取得できる', async () => {
      // Arrange
      const mockRecords: SavingsRecord[] = [
        {
          id: '1',
          amount: 800,
          recordedAt: new Date('2025-12-15'),
          isDeleted: false,
        },
        {
          id: '2',
          amount: 800,
          recordedAt: new Date('2025-12-14'),
          isDeleted: false,
        },
      ];

      mockSavingsRepo.findAll = async () => mockRecords;

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('ページネーションを指定して取得できる', async () => {
      // Arrange
      let capturedLimit: number | undefined;
      let capturedOffset: number | undefined;

      mockSavingsRepo.findAll = async (filters) => {
        capturedLimit = filters?.limit;
        capturedOffset = filters?.offset;
        return [];
      };

      // Act
      await useCase.execute({ limit: 10, offset: 5 });

      // Assert
      expect(capturedLimit).toBe(10);
      expect(capturedOffset).toBe(5);
    });

    it('日付範囲を指定して取得できる', async () => {
      // Arrange
      const startDate = new Date('2025-12-01');
      const endDate = new Date('2025-12-31');
      let capturedStartDate: Date | undefined;
      let capturedEndDate: Date | undefined;

      mockSavingsRepo.findAll = async (filters) => {
        capturedStartDate = filters?.startDate;
        capturedEndDate = filters?.endDate;
        return [];
      };

      // Act
      await useCase.execute({ startDate, endDate });

      // Assert
      expect(capturedStartDate).toEqual(startDate);
      expect(capturedEndDate).toEqual(endDate);
    });

    it('記録がない場合は空配列を返す', async () => {
      // Arrange
      mockSavingsRepo.findAll = async () => [];

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('execute - 異常系', () => {
    it('取得に失敗した場合はエラーを投げる', async () => {
      // Arrange
      mockSavingsRepo.findAll = async () => {
        throw new Error('Failed to get history');
      };

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow('Failed to get history');
    });
  });
});
