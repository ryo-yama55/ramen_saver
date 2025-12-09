# ラーメン貯金 - Claude Code コーディング規約

## 命名規則

### 基本原則
**ファイル名・コンポーネント名・関数名・変数名は英語を使用する**

日本語をローマ字表記にしない

### ドメイン用語の英語対応

| 日本語 | 英語 |
|--------|------|
| 貯金 / 貯金する | savings / save |
| 貯金記録 | savings record |
| ラーメン価格 | ramen price |
| 総貯金額 | total savings |
| 今月の貯金額 | monthly savings |
| 履歴 | history |

### コメントは日本語OK
コードの可読性のため、コメントは日本語を使用して構いません。

## アーキテクチャ

### レイヤー構造
```
src/
├── domain/              # ドメイン層
├── infrastructure/      # インフラ層
├── application/         # アプリケーション層
└── presentation/        # プレゼンテーション層
```

### 依存関係のルール
- **ドメイン層**: 他のどの層にも依存しない
- **インフラ層**: ドメイン層のインターフェースを実装
- **アプリケーション層**: ドメイン層とインフラ層に依存
- **プレゼンテーション層**: アプリケーション層のみに依存

## スタイル

- CSS変数（デザイントークン）を使用
- Named Exportを優先
- 1ファイルは300行以内を目安

## Git / GitHub

### コミットメッセージ

**日本語で書く**

```
feat: Repository patternをLocalStorageで実装

- ドメイン層にエンティティとリポジトリインターフェースを追加
- LocalStorage実装とテストを追加
- DIコンテナを設定

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**形式**:
- 1行目: `<type>: <概要>` （英語のtypeプレフィックス + 日本語の概要）
- 2行目: 空行
- 3行目以降: 箇条書きで詳細説明（日本語）
- 最後: Claude Code署名

**type一覧**:
- `feat`: 新機能
- `fix`: バグ修正
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `docs`: ドキュメント更新
- `chore`: ビルド・設定等

### Pull Request

**タイトルと概要は日本語で書く**

- タイトル: コミットメッセージの1行目と同じ形式
- 概要: 日本語で詳しく説明
  - ## 概要セクション
  - ## 主な機能セクション
  - ## テストプランセクション
- コードブロックやディレクトリ構造は見やすく整形

### ブランチ名

**英語で書く**（命名規則と同じ）

```
feature/repository-pattern-with-localstorage
fix/pagination-bug
refactor/improve-performance
```

---

**最終更新**: 2025-12-10
