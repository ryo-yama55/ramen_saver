/**
 * ラーメン我慢記録保存ユースケース
 *
 * ユーザーがラーメンを我慢したときに記録を保存する
 */

import type { ISavingsRecordRepository } from '@/domain/repositories/ISavingsRecordRepository';
import type { IUserProfileRepository } from '@/domain/repositories/IUserProfileRepository';
import type { SavingsRecord } from '@/domain/entities/SavingsRecord';

/**
 * ラーメン我慢記録保存ユースケース
 */
export class SaveRamenResistanceUseCase {
  constructor(
    private readonly savingsRecordRepository: ISavingsRecordRepository,
    private readonly userProfileRepository: IUserProfileRepository
  ) {}

  /**
   * ユースケースを実行
   *
   * @returns 作成された貯金記録
   */
  async execute(): Promise<SavingsRecord> {
    // 1. ユーザープロフィールを取得してラーメン価格を取得
    const profile = await this.userProfileRepository.get();

    // 2. ラーメン価格で貯金記録を作成
    const record = await this.savingsRecordRepository.create({
      amount: profile.ramenPrice,
    });

    return record;
  }
}
