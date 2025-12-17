/**
 * ラーメン価格更新ユースケース
 *
 * ユーザープロフィールのラーメン価格を更新する
 */

import type { IUserProfileRepository } from '@/domain/repositories/IUserProfileRepository';
import type { UserProfile } from '@/domain/entities/UserProfile';

/**
 * ラーメン価格更新の入力
 */
export type UpdateRamenPriceInput = {
  /** 新しいラーメン価格（円） */
  ramenPrice: number;
};

/**
 * ラーメン価格更新ユースケース
 */
export class UpdateRamenPriceUseCase {
  constructor(private readonly userProfileRepository: IUserProfileRepository) {}

  /**
   * ユースケースを実行
   *
   * @param input - 新しいラーメン価格
   * @returns 更新されたユーザープロフィール
   */
  async execute(input: UpdateRamenPriceInput): Promise<UserProfile> {
    return await this.userProfileRepository.update({
      ramenPrice: input.ramenPrice,
    });
  }
}
