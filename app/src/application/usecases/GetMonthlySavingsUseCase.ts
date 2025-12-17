/**
 * 月間貯金額取得ユースケース
 *
 * 指定月または今月の貯金額を取得する
 */

import type { ISavingsRecordRepository } from '@/domain/repositories/ISavingsRecordRepository'

/**
 * 月間貯金額取得の入力
 */
export type GetMonthlySavingsInput = {
  /** 年（省略時は今年） */
  year?: number
  /** 月（1-12、省略時は今月） */
  month?: number
}

/**
 * 月間貯金額取得ユースケース
 */
export class GetMonthlySavingsUseCase {
  constructor(private readonly savingsRecordRepository: ISavingsRecordRepository) {}

  /**
   * ユースケースを実行
   *
   * @param input - 年月指定（省略時は今月）
   * @returns 月間貯金額（円）
   */
  async execute(input?: GetMonthlySavingsInput): Promise<number> {
    const now = new Date()
    const year = input?.year ?? now.getFullYear()
    const month = input?.month ?? now.getMonth() + 1

    return await this.savingsRecordRepository.getMonthlySavings(year, month)
  }
}
