# テストパターン集

## AAAパターン（Arrange-Act-Assert）

すべてのテストはこの3セクションで構成する:

```typescript
it('指定した金額でレコードを作成する', () => {
  // Arrange: 準備（テストデータ、モック、初期状態の設定）
  const input = { amount: 800 }
  const repository = new SavingsRecordRepository()

  // Act: 実行（テスト対象の関数/メソッドを呼ぶ）
  const result = repository.create(input)

  // Assert: 検証（期待値と実際の値を比較）
  expect(result.amount).toBe(800)
  expect(result.recordedAt).toBeInstanceOf(Date)
})
```

**ポイント**:
- 各セクションは空行で区切る
- コメントは省略可（構造が明確なら）
- Actセクションは1行が理想（複数の操作が必要な場合は関数に抽出）

---

## テスト観点の優先度

TDDでは以下の順番でテストを追加:

### 1. 正常系（Happy Path）

**最優先**: 代表的な入力で期待通り動作するか

```typescript
describe('SavingsRecordRepository#create', () => {
  it('正の金額でレコードを作成できる', () => {
    const repository = new SavingsRecordRepository()
    const result = repository.create({ amount: 800 })

    expect(result.amount).toBe(800)
  })
})
```

### 2. 境界値

**次に重要**: 最小値・最大値・0・空など

```typescript
describe('境界値', () => {
  it('金額が0の場合も保存できる', () => {
    const repository = new SavingsRecordRepository()
    const result = repository.create({ amount: 0 })

    expect(result.amount).toBe(0)
  })

  it('空の配列を渡すと空配列を返す', () => {
    const repository = new SavingsRecordRepository()
    const results = repository.findAll({ limit: 0 })

    expect(results).toEqual([])
  })
})
```

### 3. 異常系・エラーケース

**必要に応じて**: 不正な入力への対応

```typescript
describe('異常系', () => {
  it('負の金額の場合はエラーを投げる', () => {
    const repository = new SavingsRecordRepository()

    expect(() => {
      repository.create({ amount: -100 })
    }).toThrow('Amount must be non-negative')
  })

  it('NaNの場合はエラーを投げる', () => {
    const repository = new SavingsRecordRepository()

    expect(() => {
      repository.create({ amount: NaN })
    }).toThrow('Amount must be a valid number')
  })
})
```

---

## テストケース命名規則

**原則**: 日本語で、仕様がそのまま分かる名前

### パターン1: 条件 + 期待結果

```typescript
describe('Repository#create', () => {
  it('正の金額の場合はレコードを保存する', () => {})
  it('負の金額の場合はエラーを投げる', () => {})
  it('金額が0の場合も保存できる', () => {})
})
```

### パターン2: 入力 → 出力

```typescript
describe('calculateTotal', () => {
  it('[100, 200, 300] を渡すと 600 を返す', () => {})
  it('空配列を渡すと 0 を返す', () => {})
  it('NaNを含む配列を渡すとエラーを投げる', () => {})
})
```

### パターン3: ユーザーストーリー形式

```typescript
describe('HomePage', () => {
  it('我慢ボタンをクリックすると総貯金額が増える', () => {})
  it('ローディング中はボタンが無効化される', () => {})
  it('エラー時はエラーメッセージが表示される', () => {})
})
```

---

## モックパターン

### パターン1: 依存するクラスをモック

```typescript
import { vi } from 'vitest'
import type { SavingsRecordRepository } from '@/domain/repositories/SavingsRecordRepository'

describe('SaveRamenResistanceUseCase', () => {
  it('リポジトリのcreateメソッドを呼ぶ', async () => {
    // Arrange
    const mockRepository: SavingsRecordRepository = {
      create: vi.fn<[{ amount: number }], Promise<SavingsRecord>>()
        .mockResolvedValue({
          id: '1',
          amount: 800,
          recordedAt: new Date(),
        }),
      findAll: vi.fn(),
    }

    const useCase = new SaveRamenResistanceUseCase(mockRepository)

    // Act
    await useCase.execute({ amount: 800 })

    // Assert
    expect(mockRepository.create).toHaveBeenCalledWith({ amount: 800 })
  })
})
```

### パターン2: 外部依存（時間、乱数）をモック

```typescript
describe('SavingsRecord', () => {
  it('作成時に現在時刻が記録される', () => {
    // Arrange: 時刻を固定
    const fixedDate = new Date('2025-01-01T12:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(fixedDate)

    // Act
    const record = new SavingsRecord({ amount: 800 })

    // Assert
    expect(record.recordedAt).toEqual(fixedDate)

    // Cleanup
    vi.useRealTimers()
  })
})
```

---

## 非同期処理のテストパターン

### パターン1: async/await

```typescript
it('非同期でレコードを作成する', async () => {
  const repository = new SavingsRecordRepository()

  const result = await repository.create({ amount: 800 })

  expect(result.amount).toBe(800)
})
```

### パターン2: waitFor（React Testing Library）

```typescript
import { waitFor } from '@testing-library/react'

it('ボタンクリック後にAPIが呼ばれる', async () => {
  render(<HomePage />)

  fireEvent.click(screen.getByRole('button', { name: '我慢する' }))

  await waitFor(() => {
    expect(mockApi.create).toHaveBeenCalled()
  })
})
```

### パターン3: findBy（暗黙的な待機）

```typescript
it('ローディング後に成功メッセージが表示される', async () => {
  render(<HomePage />)

  fireEvent.click(screen.getByRole('button', { name: '我慢する' }))

  // findByは要素が見つかるまで自動で待機
  const message = await screen.findByText('頑張りました！')
  expect(message).toBeInTheDocument()
})
```

---

## エッジケース/境界値のパターン

### 数値

```typescript
describe('入力値検証', () => {
  it('0の場合', () => {})
  it('1の場合（最小の正の値）', () => {})
  it('-1の場合（最小の負の値）', () => {})
  it('Number.MAX_SAFE_INTEGERの場合', () => {})
  it('Number.MIN_SAFE_INTEGERの場合', () => {})
  it('Infinityの場合', () => {})
  it('NaNの場合', () => {})
})
```

### 配列/コレクション

```typescript
describe('配列処理', () => {
  it('空配列の場合', () => {})
  it('1要素の配列の場合', () => {})
  it('重複要素を含む配列の場合', () => {})
  it('大量の要素を含む配列の場合', () => {})
})
```

### 文字列

```typescript
describe('文字列処理', () => {
  it('空文字列の場合', () => {})
  it('スペースのみの場合', () => {})
  it('1文字の場合', () => {})
  it('非常に長い文字列の場合', () => {})
  it('特殊文字を含む場合', () => {})
})
```

---

## データ駆動テスト（Table-Driven Tests）

同じロジックで複数のケースをテストする場合:

```typescript
describe('calculateTotal', () => {
  const testCases = [
    { input: [], expected: 0, description: '空配列' },
    { input: [100], expected: 100, description: '1要素' },
    { input: [100, 200], expected: 300, description: '2要素' },
    { input: [100, 200, 300], expected: 600, description: '3要素' },
    { input: [-100, 200], expected: 100, description: '負の値を含む' },
  ]

  testCases.forEach(({ input, expected, description }) => {
    it(`${description}: ${JSON.stringify(input)} → ${expected}`, () => {
      expect(calculateTotal(input)).toBe(expected)
    })
  })
})
```

---

## カバレッジの目標

- **行カバレッジ**: 80%以上
- **分岐カバレッジ**: 80%以上
- **関数カバレッジ**: 100%（すべての関数にテストを書く）

**注意**: カバレッジは目安。**仕様をテストで表現した結果**としてカバレッジが上がるのが理想。数字を満たすためにテストを書くのは本末転倒。

---

## アンチパターン（避けるべきこと）

### ❌ テストに実装の詳細を含める

```typescript
// ❌ Bad: 内部実装に依存
it('内部的にArray.reduceを使っている', () => {
  const spy = vi.spyOn(Array.prototype, 'reduce')
  calculateTotal([100, 200])
  expect(spy).toHaveBeenCalled()
})

// ✅ Good: 公開インターフェースをテスト
it('[100, 200] を渡すと 300 を返す', () => {
  expect(calculateTotal([100, 200])).toBe(300)
})
```

### ❌ 複数の観点を1つのテストに詰め込む

```typescript
// ❌ Bad: テストが失敗したとき、どの観点が問題か分からない
it('様々な入力をテストする', () => {
  expect(calculateTotal([])).toBe(0)
  expect(calculateTotal([100])).toBe(100)
  expect(() => calculateTotal([NaN])).toThrow()
})

// ✅ Good: 1テスト1観点
it('空配列の場合は0を返す', () => {
  expect(calculateTotal([])).toBe(0)
})

it('1要素の配列の場合はその値を返す', () => {
  expect(calculateTotal([100])).toBe(100)
})

it('NaNを含む場合はエラーを投げる', () => {
  expect(() => calculateTotal([NaN])).toThrow()
})
```

### ❌ テスト間で状態を共有

```typescript
// ❌ Bad: テストの順序に依存する
let repository: SavingsRecordRepository

beforeAll(() => {
  repository = new SavingsRecordRepository()
})

it('レコードを作成する', async () => {
  await repository.create({ amount: 100 })
})

it('レコードが1件存在する', async () => {
  const records = await repository.findAll()
  expect(records).toHaveLength(1) // 前のテストに依存！
})

// ✅ Good: 各テストで独立して準備
it('レコードを作成する', async () => {
  const repository = new SavingsRecordRepository()
  await repository.create({ amount: 100 })
  expect(await repository.findAll()).toHaveLength(1)
})

it('複数レコードを作成できる', async () => {
  const repository = new SavingsRecordRepository()
  await repository.create({ amount: 100 })
  await repository.create({ amount: 200 })
  expect(await repository.findAll()).toHaveLength(2)
})
```
