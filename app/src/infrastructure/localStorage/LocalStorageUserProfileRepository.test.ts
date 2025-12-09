import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageUserProfileRepository } from './LocalStorageUserProfileRepository'
import type { UpdateUserProfileInput } from '@/domain/entities/UserProfile'

describe('LocalStorageUserProfileRepository', () => {
  let repository: LocalStorageUserProfileRepository

  beforeEach(() => {
    repository = new LocalStorageUserProfileRepository()
  })

  describe('get', () => {
    it('should return initialized profile when no profile exists', async () => {
      const profile = await repository.get()

      expect(profile).toMatchObject({
        ramenPrice: 800,
      })
      expect(profile.id).toBeDefined()
      expect(profile.createdAt).toBeInstanceOf(Date)
      expect(profile.updatedAt).toBeInstanceOf(Date)
    })

    it('should return existing profile', async () => {
      const initialized = await repository.initialize(1000)

      const profile = await repository.get()

      expect(profile.id).toBe(initialized.id)
      expect(profile.ramenPrice).toBe(1000)
    })

    it('should persist profile to localStorage', async () => {
      await repository.get()

      const stored = localStorage.getItem('ramen-saver:user-profile')
      expect(stored).toBeDefined()
      const profile = JSON.parse(stored!)
      expect(profile.ramenPrice).toBe(800)
    })
  })

  describe('update', () => {
    it('should update ramen price', async () => {
      await repository.get()

      const input: UpdateUserProfileInput = { ramenPrice: 1200 }
      const updated = await repository.update(input)

      expect(updated.ramenPrice).toBe(1200)
    })

    it('should update updatedAt timestamp', async () => {
      const initial = await repository.get()
      await new Promise(resolve => setTimeout(resolve, 10))

      const updated = await repository.update({ ramenPrice: 1000 })

      expect(updated.updatedAt.getTime()).toBeGreaterThan(initial.updatedAt.getTime())
    })

    it('should preserve id and createdAt', async () => {
      const initial = await repository.get()

      const updated = await repository.update({ ramenPrice: 1000 })

      expect(updated.id).toBe(initial.id)
      expect(updated.createdAt.getTime()).toBe(initial.createdAt.getTime())
    })

    it('should persist updated profile to localStorage', async () => {
      await repository.get()

      await repository.update({ ramenPrice: 1500 })

      const stored = localStorage.getItem('ramen-saver:user-profile')
      const profile = JSON.parse(stored!)
      expect(profile.ramenPrice).toBe(1500)
    })

    it('should initialize profile if not exists before update', async () => {
      const updated = await repository.update({ ramenPrice: 1000 })

      expect(updated.ramenPrice).toBe(1000)
      expect(updated.id).toBeDefined()
    })
  })

  describe('initialize', () => {
    it('should create profile with default price', async () => {
      const profile = await repository.initialize()

      expect(profile.ramenPrice).toBe(800)
    })

    it('should create profile with custom price', async () => {
      const profile = await repository.initialize(1500)

      expect(profile.ramenPrice).toBe(1500)
    })

    it('should set createdAt and updatedAt', async () => {
      const profile = await repository.initialize()

      expect(profile.createdAt).toBeInstanceOf(Date)
      expect(profile.updatedAt).toBeInstanceOf(Date)
      expect(profile.createdAt.getTime()).toBe(profile.updatedAt.getTime())
    })

    it('should overwrite existing profile', async () => {
      const first = await repository.initialize(1000)
      await new Promise(resolve => setTimeout(resolve, 10))

      const second = await repository.initialize(2000)

      expect(second.id).not.toBe(first.id)
      expect(second.ramenPrice).toBe(2000)
    })
  })
})
