/**
 * ユーザープロフィールリポジトリ（LocalStorage実装）
 *
 * LocalStorageを使用してデータを永続化する実装
 */

import type {
  UserProfile,
  UpdateUserProfileInput,
} from '@/domain/entities/UserProfile'
import type { IUserProfileRepository } from '@/domain/repositories/IUserProfileRepository'

const STORAGE_KEY = 'ramen-saver:user-profile'
const DEFAULT_RAMEN_PRICE = 800

/**
 * LocalStorageを使用したユーザープロフィールリポジトリ
 */
export class LocalStorageUserProfileRepository implements IUserProfileRepository {
  /**
   * LocalStorageからプロフィールを取得
   */
  private getProfile(): UserProfile | null {
    const json = localStorage.getItem(STORAGE_KEY)
    if (!json) return null

    const data = JSON.parse(json)
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    }
  }

  /**
   * LocalStorageにプロフィールを保存
   */
  private saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
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
