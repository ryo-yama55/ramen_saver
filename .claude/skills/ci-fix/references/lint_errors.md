# Lintエラーパターンと修正方法

## Prettierフォーマットエラー（自動修正可能）

### 症状
```
Delete `␍`
Replace `'` with `"`
Insert `··`
```

### 修正方法
```bash
cd app && npm run lint -- --fix
```

ほとんどのPrettierフォーマットエラーは自動修正できます。

---

## TypeScript `any` 型エラー

### 症状
```
Unexpected any. Specify a different type
```

### パターン1: Storyファイルのモックオブジェクト

**❌ Before:**
```typescript
const mockUseCase = {
  execute: async () => 5000,
} as any
```

**✅ After:**
```typescript
import type { GetTotalSavingsUseCase } from '@/application/usecases/GetTotalSavingsUseCase'

const mockUseCase: GetTotalSavingsUseCase = {
  execute: async () => 5000,
}
```

**修正手順:**
1. 必要な型をインポート
2. `as any`を削除
3. 型注釈を追加

### パターン2: テストファイルのvi.fn()

**❌ Before:**
```typescript
mockGetTotalSavingsUseCase = {
  execute: vi.fn().mockResolvedValue(5000),
}
```

**✅ After:**
```typescript
mockGetTotalSavingsUseCase = {
  execute: vi.fn<[], Promise<number>>().mockResolvedValue(5000),
}
```

**修正手順:**
1. `vi.fn<引数型, 戻り値型>()`の形式で型パラメータを指定
2. 引数なしの場合は`[]`
3. 戻り値の型を明示（例: `Promise<number>`）

### パターン3: モックオブジェクト全体

**❌ Before:**
```typescript
const mockRepository = {
  findAll: vi.fn(),
  create: vi.fn(),
} as any
```

**✅ After:**
```typescript
import type { SavingsRecordRepository } from '@/domain/repositories/SavingsRecordRepository'

const mockRepository: SavingsRecordRepository = {
  findAll: vi.fn<[{ limit?: number; offset?: number }?], Promise<SavingsRecord[]>>(),
  create: vi.fn<[{ amount: number }], Promise<SavingsRecord>>(),
}
```

---

## Storybookインポート警告

### 症状
```
@storybook/react is deprecated, use @storybook/react-vite
```

### 修正方法

**❌ Before:**
```typescript
import type { Meta, StoryObj } from '@storybook/react'
```

**✅ After:**
```typescript
import type { Meta, StoryObj } from '@storybook/react-vite'
```

**対象ファイル:**
- すべての`.stories.tsx`ファイル

---

## ESLint ルール違反

### unused-vars（未使用変数）

**症状:**
```
'useState' is defined but never used
```

**修正方法:**
1. 使用されていない変数/インポートを削除
2. 意図的に未使用の場合は`_`プレフィックスを付ける

```typescript
// ✅ 使用する場合
import { useState } from 'react'

// ✅ 意図的に未使用の場合
const [_value, setValue] = useState(0)
```

### no-console（console.log禁止）

**症状:**
```
Unexpected console statement
```

**修正方法:**
1. 本番コードから`console.log`を削除
2. デバッグ用ならロガーライブラリを使用
3. テストコードなら許容される場合もある

---

## チェックリスト

修正後、必ず以下を確認:

- [ ] `cd app && npm run lint`がエラー0件
- [ ] 修正内容が意図通り
- [ ] 型安全性が保たれている
- [ ] テストが引き続き通る
