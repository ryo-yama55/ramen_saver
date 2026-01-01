# テストエラーパターンと修正方法

## テストエラー診断フロー

```
1. エラーメッセージを読む
2. テストコードを読んで理解する
3. 実装コードを読んで動作を確認する
4. 仕様を確認する
5. テスト/実装のどちらが正しいか判断する
6. 修正を実施する
```

---

## パターン1: 期待値の不一致

### 症状
```
Expected: 100
Received: 300
```

### 診断手順

1. **テストコードを読む:**
   - 何をテストしているか理解する
   - 期待値が100である理由を確認する

2. **実装コードを読む:**
   - 実際に何を返しているか確認する
   - なぜ300が返されているのか理解する

3. **仕様を確認する:**
   - ドメインロジックを確認
   - 要件定義やデザインドキュメントを参照
   - どちらが正しい動作か判断

4. **修正:**
   - テストが間違っている → テストを修正
   - 実装が間違っている → 実装を修正

### 実例: ページネーションのソート順序

**問題:**
```typescript
// テストの期待値
expect(records[0].amount).toBe(100) // 最初のレコード
expect(records[1].amount).toBe(200)
expect(records[2].amount).toBe(300)

// 実際の結果
records[0].amount === 300 // 逆順！
```

**原因:**
- 実装は「新しい順」でソート
- テストは「古い順」を期待
- 同じミリ秒で作成されたレコードのタイムスタンプが同じため、ソートが不安定

**修正:**
```typescript
// 解決策1: テストの期待値を「新しい順」に修正
expect(records[0].amount).toBe(300) // 最新
expect(records[1].amount).toBe(200)
expect(records[2].amount).toBe(100) // 最古

// 解決策2: タイムスタンプを確実に異なるものにする
await repository.create({ amount: 100 })
await new Promise(resolve => setTimeout(resolve, 1)) // 1ms遅延
await repository.create({ amount: 200 })
await new Promise(resolve => setTimeout(resolve, 1))
await repository.create({ amount: 300 })
```

---

## パターン2: モック関数が呼ばれない

### 症状
```
Expected mock function to have been called, but it was not called.
```

### 診断手順

1. モック関数が正しくセットアップされているか確認
2. コンポーネント/関数が実際にモックを使用しているか確認
3. 非同期処理の場合、`await`や`waitFor`を使っているか確認

### 修正例

**❌ Before:**
```typescript
it('ボタンクリックでAPIが呼ばれる', () => {
  render(<Component />)
  fireEvent.click(screen.getByRole('button'))

  expect(mockApi).toHaveBeenCalled() // ❌ 非同期処理が完了していない
})
```

**✅ After:**
```typescript
it('ボタンクリックでAPIが呼ばれる', async () => {
  render(<Component />)
  fireEvent.click(screen.getByRole('button'))

  await waitFor(() => {
    expect(mockApi).toHaveBeenCalled()
  })
})
```

---

## パターン3: React act() 警告

### 症状
```
An update to Component inside a test was not wrapped in act(...)
```

### 原因
- React 18の厳密なチェック
- 状態更新が完了する前にテストが終了している

### 修正方法

**方法1: waitFor を使用**
```typescript
await waitFor(() => {
  expect(screen.getByText('結果')).toBeInTheDocument()
})
```

**方法2: act でラップ**
```typescript
await act(async () => {
  fireEvent.click(button)
})
```

**方法3: findBy を使用（推奨）**
```typescript
// getBy の代わりに findBy を使う（内部でwaitForを使用）
const element = await screen.findByText('結果')
expect(element).toBeInTheDocument()
```

---

## パターン4: タイムアウトエラー

### 症状
```
Exceeded timeout of 5000 ms for a test
```

### 原因
- 非同期処理が完了しない
- 無限ループ
- 条件が満たされない

### 修正方法

1. **タイムアウトを延長:**
```typescript
it('長時間かかる処理', async () => {
  // ...
}, 10000) // 10秒に延長
```

2. **根本原因を修正:**
   - モックが正しく設定されているか確認
   - 非同期処理が正しく完了しているか確認
   - 条件が達成可能か確認

---

## よくあるstderrメッセージ（問題なし）

以下のstderrメッセージは**テストが成功していれば問題ありません**:

```
stderr | Failed to parse savings records from localStorage
stderr | Invalid date for record
stderr | Failed to initialize user profile
```

これらはエラーハンドリングのテストで**意図的に**発生させているエラーログです。

---

## テスト修正のチェックリスト

- [ ] エラーメッセージを正確に理解した
- [ ] テストコードの意図を理解した
- [ ] 実装コードの動作を理解した
- [ ] 仕様を確認した
- [ ] テスト/実装のどちらを修正すべきか判断した
- [ ] 修正後、全テストが通ることを確認した
- [ ] 修正が他のテストに影響していないか確認した
