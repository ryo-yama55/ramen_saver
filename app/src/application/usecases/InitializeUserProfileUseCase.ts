/**
 * ユーザープロフィール初期化ユースケース
 *
 * 初回アクセス時にユーザープロフィールを初期化する
 */

import type { IUserProfileRepository } from '@/domain/repositories/IUserProfileRepository';
import type { UserProfile } from '@/domain/entities/UserProfile';

/**
 * プロフィール初期化の入力
 */
export type InitializeUserProfileInput = {
  /** ラーメン価格（省略時はデフォルト値） */
  ramenPrice?: number;
};

/**
 * ユーザープロフィール初期化ユースケース
 */
export class InitializeUserProfileUseCase {
  constructor(private readonly userProfileRepository: IUserProfileRepository) {}

  /**
   * ユースケースを実行
   *
   * @param input - 初期化パラメータ（省略時はデフォルト値）
   * @returns 初期化されたユーザープロフィール
   */
  async execute(input?: InitializeUserProfileInput): Promise<UserProfile> {
    return await this.userProfileRepository.initialize(input?.ramenPrice);
  }
}
