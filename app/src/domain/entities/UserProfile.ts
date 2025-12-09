/**
 * ユーザープロフィールエンティティ
 *
 * ユーザーの設定情報を表すドメインエンティティ
 */

/**
 * ユーザープロフィール
 */
export type UserProfile = {
  /** ユーザーID（UUID） */
  id: string

  /** ラーメン価格（円） */
  ramenPrice: number

  /** 作成日時 */
  createdAt: Date

  /** 更新日時 */
  updatedAt: Date
}

/**
 * プロフィール更新時の入力
 */
export type UpdateUserProfileInput = {
  /** 新しいラーメン価格 */
  ramenPrice: number
}

/**
 * デフォルトのラーメン価格（円）
 */
export const DEFAULT_RAMEN_PRICE = 800 as const
