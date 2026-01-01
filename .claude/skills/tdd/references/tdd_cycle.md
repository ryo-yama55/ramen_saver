# TDDサイクル（Red-Green-Refactor）詳細ガイド

## TDDの3ステップ

### 🔴 Red: 落ちるテストを書く

**目的**: 仕様を明確にし、テストが正しく失敗することを確認する

**手順**:
1. 実装したい機能を1つだけ選ぶ
2. その機能の最もシンプルなケースのテストを書く
3. テストを実行して、**期待通りに失敗する**ことを確認
4. 失敗理由が正しいか確認（例: 関数が未定義、期待値と異なる、等）

**例（新機能: 金額の合計計算）**:
```typescript
// ❌ まだ実装されていない
describe('calculateTotal', () => {
  it('金額の配列を合計する', () => {
    const amounts = [100, 200, 300]
    const result = calculateTotal(amounts)

    expect(result).toBe(600)
  })
})

// 実行結果: ❌ FAIL
// ReferenceError: calculateTotal is not defined
```

**重要ポイント**:
- **小さく始める**: 最もシンプルなケースから
- **1つずつ**: 一度に1つのテストだけ
- **失敗を確認**: テストが正しく失敗することを確認

---

### 🟢 Green: 最小限の実装で通す

**目的**: テストを通すための最もシンプルなコードを書く

**原則**:
- **最小限**: テストを通すために必要最小限のコード
- **ベタ書きOK**: リファクタリングは後で
- **作り込まない**: 将来の拡張性は考えない

**例**:
```typescript
// ✅ 最小限の実装
function calculateTotal(amounts: number[]): number {
  return amounts.reduce((sum, amount) => sum + amount, 0)
}

// 実行結果: ✅ PASS
// calculateTotal › 金額の配列を合計する
```

**避けるべきこと（Greenフェーズで）**:
- ❌ エラーハンドリングを追加する（テストがなければ不要）
- ❌ バリデーションを追加する（テストがなければ不要）
- ❌ パフォーマンス最適化（テストがなければ不要）
- ❌ 汎用化・抽象化（テストがなければ不要）

---

### 🔵 Refactor: リファクタリング

**目的**: テストを通したまま、コードを改善する

**前提条件**:
- ✅ すべてのテストが通っている
- ✅ テストカバレッジが十分

**リファクタリングの観点**:

1. **重複の排除（DRY原則）**
   ```typescript
   // Before
   it('正の金額を合計する', () => {
     const amounts = [100, 200]
     const result = calculateTotal(amounts)
     expect(result).toBe(300)
   })

   it('負の金額を含む配列を合計する', () => {
     const amounts = [-100, 200]
     const result = calculateTotal(amounts)
     expect(result).toBe(100)
   })

   // After (共通処理を抽出)
   describe('calculateTotal', () => {
     const testCases = [
       { input: [100, 200], expected: 300, description: '正の金額' },
       { input: [-100, 200], expected: 100, description: '負の金額を含む' },
     ]

     testCases.forEach(({ input, expected, description }) => {
       it(`${description}の配列を合計する`, () => {
         expect(calculateTotal(input)).toBe(expected)
       })
     })
   })
   ```

2. **命名の改善**
   - 意図が伝わる変数名・関数名に変更
   - テストケース名をより明確に

3. **関数の分割**
   - 1つの関数が大きくなりすぎたら分割
   - 単一責任の原則（SRP）を守る

4. **型の改善**
   - any型の排除
   - より厳密な型定義

**リファクタリング後の確認**:
```bash
# すべてのテストが通ることを確認
npm run test
```

---

## TDDサイクルの繰り返し

```
🔴 Red → 🟢 Green → 🔵 Refactor
  ↑                            ↓
  └────────────────────────────┘
       次のテストケースへ
```

**次のテストケースを追加する例**:

1. **🔴 Red**: 空配列のテストを追加
   ```typescript
   it('空配列の場合は0を返す', () => {
     expect(calculateTotal([])).toBe(0)
   })
   ```

2. **🟢 Green**: すでに実装済み（reduce が空配列に対応）
   ```typescript
   // 実行結果: ✅ PASS
   ```

3. **🔴 Red**: NaN を含む配列のテスト
   ```typescript
   it('NaNを含む配列の場合はエラーを投げる', () => {
     expect(() => calculateTotal([100, NaN])).toThrow()
   })

   // 実行結果: ❌ FAIL (エラーが投げられない)
   ```

4. **🟢 Green**: バリデーションを追加
   ```typescript
   function calculateTotal(amounts: number[]): number {
     if (amounts.some(isNaN)) {
       throw new Error('Invalid amount: NaN is not allowed')
     }
     return amounts.reduce((sum, amount) => sum + amount, 0)
   }

   // 実行結果: ✅ PASS
   ```

5. **🔵 Refactor**: バリデーション関数を抽出
   ```typescript
   function validateAmounts(amounts: number[]): void {
     if (amounts.some(isNaN)) {
       throw new Error('Invalid amount: NaN is not allowed')
     }
   }

   function calculateTotal(amounts: number[]): number {
     validateAmounts(amounts)
     return amounts.reduce((sum, amount) => sum + amount, 0)
   }
   ```

---

## TDDのリズム

**推奨サイクル時間**:
- 🔴 Red: 1-5分
- 🟢 Green: 1-5分
- 🔵 Refactor: 0-10分

**合計**: 1サイクル 5-15分程度

**長すぎる場合**:
- テストケースが大きすぎる → より小さく分割
- 実装が複雑すぎる → より単純なケースから始める

---

## チェックリスト

各サイクルで確認すべきこと:

### 🔴 Red フェーズ
- [ ] テストが1つだけ追加されている
- [ ] テストが期待通りに失敗する
- [ ] 失敗理由が明確

### 🟢 Green フェーズ
- [ ] すべてのテストが通る
- [ ] 最小限の実装（過剰な実装をしていない）
- [ ] コードが読める状態

### 🔵 Refactor フェーズ
- [ ] すべてのテストが通ったまま
- [ ] コードの重複が減った
- [ ] 命名が改善された
- [ ] コードがより理解しやすくなった
