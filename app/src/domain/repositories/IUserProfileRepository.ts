/**
 * ユーザープロフィールリポジトリインターフェース
 *
 * データアクセスの抽象化層
 * 実装はインフラ層で行う（LocalStorage、Supabase等）
 */

import type { UserProfile, UpdateUserProfileInput } from '../entities/UserProfile'

/**
 * ユーザープロフィールリポジトリのインターフェース
 */
export interface IUserProfileRepository {
  /**
   * プロフィールが存在するか確認
   *
   * @returns プロフィールが存在する場合true
   */
  exists(): Promise<boolean>

  /**
   * プロフィールを取得
   *
   * プロフィールが存在しない場合は自動的に初期化する
   *
   * @returns ユーザープロフィール
   */
  get(): Promise<UserProfile>

  /**
   * プロフィールを更新
   *
   * @param input - 更新する情報
   * @returns 更新されたユーザープロフィール
   */
  update(input: UpdateUserProfileInput): Promise<UserProfile>

  /**
   * プロフィールを初期化
   *
   * @param ramenPrice - 初期ラーメン価格（デフォルト: 800円）
   * @returns 初期化されたユーザープロフィール
   */
  initialize(ramenPrice?: number): Promise<UserProfile>
}
