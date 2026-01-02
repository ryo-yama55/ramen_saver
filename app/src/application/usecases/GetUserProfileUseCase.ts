/**
 * ユーザープロフィール取得ユースケース
 *
 * 現在のユーザープロフィール（ラーメン価格など）を取得する
 */

import type { IUserProfileRepository } from '@/domain/repositories/IUserProfileRepository'
import type { UserProfile } from '@/domain/entities/UserProfile'

export class GetUserProfileUseCase {
  constructor(private readonly userProfileRepository: IUserProfileRepository) {}

  /**
   * ユーザープロフィールを取得
   * @returns ユーザープロフィール、存在しない場合はnull
   */
  async execute(): Promise<UserProfile | null> {
    return await this.userProfileRepository.getProfile()
  }
}
