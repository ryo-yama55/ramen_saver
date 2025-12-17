/**
 * ユーザープロフィールリポジトリ（LocalStorage実装）
 *
 * LocalStorageを使用してデータを永続化する実装
 */

import type {
  UserProfile,
  UpdateUserProfileInput,
} from '@/domain/entities/UserProfile'
import { DEFAULT_RAMEN_PRICE } from '@/domain/entities/UserProfile'
import type { IUserProfileRepository } from '@/domain/repositories/IUserProfileRepository'

const STORAGE_KEY = 'ramen-saver:user-profile'

// エラーメッセージ定数
const ERROR_MESSAGES = {
  INVALID_RAMEN_PRICE: 'Ramen price must be a positive number',
} as const

/**
 * LocalStorageに保存されるユーザープロフィールの型
 */
type StoredUserProfile = Omit<UserProfile, 'createdAt' | 'updatedAt'> & {
  createdAt: string // ISO8601形式の文字列
  updatedAt: string // ISO8601形式の文字列
}

/**
 * LocalStorageを使用したユーザープロフィールリポジトリ
 */
export class LocalStorageUserProfileRepository implements IUserProfileRepository {
  /**
   * LocalStorageからプロフィールを取得
   */
  private getProfile(): UserProfile | null {
    try {
      const json = localStorage.getItem(STORAGE_KEY)
      if (!json) return null

      const data = JSON.parse(json) as StoredUserProfile
      const createdAt = new Date(data.createdAt)
      const updatedAt = new Date(data.updatedAt)

      if (isNaN(createdAt.getTime())) {
        console.warn(`Invalid createdAt date for profile ${data.id}: ${data.createdAt}`)
      }
      if (isNaN(updatedAt.getTime())) {
        console.warn(`Invalid updatedAt date for profile ${data.id}: ${data.updatedAt}`)
      }

      return {
        ...data,
        createdAt,
        updatedAt,
      }
    } catch (error) {
      console.error('Failed to parse user profile from localStorage:', error)
      return null
    }
  }

  /**
   * LocalStorageにプロフィールを保存
   */
  private saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    } catch (error) {
      console.error('Failed to save profile to localStorage:', error)
      throw new Error('Failed to persist user profile')
    }
  }

  /**
   * プロフィールが存在するか確認
   */
  async exists(): Promise<boolean> {
    const profile = this.getProfile()
    return profile !== null
  }

  /**
   * プロフィールを取得
   */
  async get(): Promise<UserProfile> {
    const profile = this.getProfile()
    if (profile) return profile

    // プロフィールが存在しない場合は初期化
    return this.initialize()
  }

  /**
   * プロフィールを更新
   */
  async update(input: UpdateUserProfileInput): Promise<UserProfile> {
    // 入力値検証
    if (!Number.isFinite(input.ramenPrice) || input.ramenPrice < 0) {
      throw new Error(ERROR_MESSAGES.INVALID_RAMEN_PRICE)
    }

    const profile = await this.get()

    const updated: UserProfile = {
      ...profile,
      ramenPrice: input.ramenPrice,
      updatedAt: new Date(),
    }

    this.saveProfile(updated)
    return updated
  }

  /**
   * プロフィールを初期化
   */
  async initialize(ramenPrice = DEFAULT_RAMEN_PRICE): Promise<UserProfile> {
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      ramenPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.saveProfile(profile)
    return profile
  }
}
