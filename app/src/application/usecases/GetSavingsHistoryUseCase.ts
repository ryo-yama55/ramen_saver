/**
 * 貯金履歴取得ユースケース
 *
 * 貯金記録の履歴を取得する
 */

import type { ISavingsRecordRepository } from '@/domain/repositories/ISavingsRecordRepository'
import type { SavingsRecord, SavingsRecordFilters } from '@/domain/entities/SavingsRecord'

/**
 * 貯金履歴取得ユースケース
 */
export class GetSavingsHistoryUseCase {
  constructor(private readonly savingsRecordRepository: ISavingsRecordRepository) {}

  /**
   * ユースケースを実行
   *
   * @param filters - フィルター条件（省略時は全件取得）
   * @returns 貯金記録の配列
   */
  async execute(filters?: SavingsRecordFilters): Promise<SavingsRecord[]> {
    return await this.savingsRecordRepository.findAll(filters)
  }
}
