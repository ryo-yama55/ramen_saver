/**
 * 総貯金額取得ユースケース
 *
 * 全期間の総貯金額を取得する
 */

import type { ISavingsRecordRepository } from '@/domain/repositories/ISavingsRecordRepository'

/**
 * 総貯金額取得ユースケース
 */
export class GetTotalSavingsUseCase {
  constructor(private readonly savingsRecordRepository: ISavingsRecordRepository) {}

  /**
   * ユースケースを実行
   *
   * @returns 総貯金額（円）
   */
  async execute(): Promise<number> {
    return await this.savingsRecordRepository.getTotalSavings()
  }
}
