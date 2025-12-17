import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageUserProfileRepository } from './LocalStorageUserProfileRepository';
import type { UpdateUserProfileInput } from '@/domain/entities/UserProfile';

describe('LocalStorageUserProfileRepository', () => {
  let repository: LocalStorageUserProfileRepository;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageUserProfileRepository();
  });

  describe('get - 正常系', () => {
    it('プロフィールがない場合はデフォルト値で初期化される', async () => {
      // Act
      const profile = await repository.get();

      // Assert
      expect(profile).toMatchObject({
        ramenPrice: 800,
      });
      expect(profile.id).toBeDefined();
      expect(profile.createdAt).toBeInstanceOf(Date);
      expect(profile.updatedAt).toBeInstanceOf(Date);
    });

    it('既存のプロフィールを取得できる', async () => {
      // Arrange
      const initialized = await repository.initialize(1000);

      // Act
      const profile = await repository.get();

      // Assert
      expect(profile.id).toBe(initialized.id);
      expect(profile.ramenPrice).toBe(1000);
    });

    it('取得したプロフィールがlocalStorageに永続化されている', async () => {
      // Act
      await repository.get();

      // Assert
      const stored = localStorage.getItem('ramen-saver:user-profile');
      expect(stored).toBeDefined();
      const profile = JSON.parse(stored!);
      expect(profile.ramenPrice).toBe(800);
    });
  });

  describe('update - 正常系', () => {
    it('ラーメン価格を更新できる', async () => {
      // Arrange
      await repository.get();
      const input: UpdateUserProfileInput = { ramenPrice: 1200 };

      // Act
      const updated = await repository.update(input);

      // Assert
      expect(updated.ramenPrice).toBe(1200);
    });

    it('更新時にupdatedAtが更新される', async () => {
      // Arrange
      const initial = await repository.get();
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Act
      const updated = await repository.update({ ramenPrice: 1000 });

      // Assert
      expect(updated.updatedAt.getTime()).toBeGreaterThan(
        initial.updatedAt.getTime()
      );
    });

    it('更新時にidとcreatedAtは保持される', async () => {
      // Arrange
      const initial = await repository.get();

      // Act
      const updated = await repository.update({ ramenPrice: 1000 });

      // Assert
      expect(updated.id).toBe(initial.id);
      expect(updated.createdAt.getTime()).toBe(initial.createdAt.getTime());
    });

    it('更新したプロフィールがlocalStorageに永続化される', async () => {
      // Arrange
      await repository.get();

      // Act
      await repository.update({ ramenPrice: 1500 });

      // Assert
      const stored = localStorage.getItem('ramen-saver:user-profile');
      const profile = JSON.parse(stored!);
      expect(profile.ramenPrice).toBe(1500);
    });

    it('プロフィールがない状態で更新すると初期化してから更新される', async () => {
      // Act
      const updated = await repository.update({ ramenPrice: 1000 });

      // Assert
      expect(updated.ramenPrice).toBe(1000);
      expect(updated.id).toBeDefined();
    });
  });

  describe('update - 異常系', () => {
    it('負の価格の場合はエラーを投げる', async () => {
      // Arrange
      const input: UpdateUserProfileInput = { ramenPrice: -100 };

      // Act & Assert
      await expect(repository.update(input)).rejects.toThrow(
        'Ramen price must be a positive number'
      );
    });

    it('NaNが渡された場合はエラーを投げる', async () => {
      // Arrange
      const input: UpdateUserProfileInput = { ramenPrice: NaN };

      // Act & Assert
      await expect(repository.update(input)).rejects.toThrow(
        'Ramen price must be a positive number'
      );
    });

    it('Infinityが渡された場合はエラーを投げる', async () => {
      // Arrange
      const input: UpdateUserProfileInput = { ramenPrice: Infinity };

      // Act & Assert
      await expect(repository.update(input)).rejects.toThrow(
        'Ramen price must be a positive number'
      );
    });
  });

  describe('update - 境界値', () => {
    it('価格が0の場合も更新できる', async () => {
      // Act
      const updated = await repository.update({ ramenPrice: 0 });

      // Assert
      expect(updated.ramenPrice).toBe(0);
    });
  });

  describe('initialize - 正常系', () => {
    it('デフォルト価格でプロフィールを作成できる', async () => {
      // Act
      const profile = await repository.initialize();

      // Assert
      expect(profile.ramenPrice).toBe(800);
    });

    it('カスタム価格でプロフィールを作成できる', async () => {
      // Act
      const profile = await repository.initialize(1500);

      // Assert
      expect(profile.ramenPrice).toBe(1500);
    });

    it('作成時にcreatedAtとupdatedAtが設定される', async () => {
      // Act
      const profile = await repository.initialize();

      // Assert
      expect(profile.createdAt).toBeInstanceOf(Date);
      expect(profile.updatedAt).toBeInstanceOf(Date);
      expect(profile.createdAt.getTime()).toBe(profile.updatedAt.getTime());
    });

    it('既存のプロフィールがある場合は上書きされる', async () => {
      // Arrange
      const first = await repository.initialize(1000);
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Act
      const second = await repository.initialize(2000);

      // Assert
      expect(second.id).not.toBe(first.id);
      expect(second.ramenPrice).toBe(2000);
    });
  });

  describe('getProfile - データ整合性', () => {
    it('壊れたJSONの場合はnullを返す', () => {
      // Arrange
      localStorage.setItem('ramen-saver:user-profile', 'invalid-json{');

      // Act
      const profile = repository['getProfile']();

      // Assert
      expect(profile).toBeNull();
    });

    it('不正な日付文字列でもDateオブジェクトに変換される', () => {
      // Arrange
      localStorage.setItem(
        'ramen-saver:user-profile',
        JSON.stringify({
          id: '1',
          ramenPrice: 800,
          createdAt: 'not-a-date',
          updatedAt: 'not-a-date',
        })
      );

      // Act
      const profile = repository['getProfile']();

      // Assert
      expect(profile!.createdAt).toBeInstanceOf(Date);
      expect(profile!.createdAt.toString()).toBe('Invalid Date');
      expect(profile!.updatedAt).toBeInstanceOf(Date);
      expect(profile!.updatedAt.toString()).toBe('Invalid Date');
    });
  });
});
