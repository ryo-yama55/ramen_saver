# ラーメン貯金 - デザインシステム

このドキュメントは、ラーメン貯金アプリのデザインシステムの詳細を記載しています。

## 目次

- [概要](#概要)
- [デザイン原則](#デザイン原則)
- [カラーシステム](#カラーシステム)
- [タイポグラフィ](#タイポグラフィ)
- [スペーシング](#スペーシング)
- [コンポーネント](#コンポーネント)
- [アニメーション](#アニメーション)
- [アクセシビリティ](#アクセシビリティ)

---

## 概要

ラーメン貯金のデザインシステムは、一貫性のあるユーザー体験を提供するための基盤です。

**デザインコンセプト**: 「Golden Achievement」
**キーワード**: 達成感、ポジティブ、エンターテインメント、楽しい節約

---

## デザイン原則

### 1. エンターテインメント性重視
- ゲームのような楽しさを提供
- 達成感を強調
- ポジティブな言葉遣い

### 2. シンプルさ
- 直感的な操作
- 最小限のステップ
- 明確な視覚階層

### 3. 親しみやすさ
- フレンドリーな色使い
- 柔らかいエッジ（border-radius）
- 温かみのある表現

### 4. パフォーマンス
- 軽量なアセット
- スムーズなアニメーション
- 高速な読み込み

---

## カラーシステム

### プライマリーパレット: "Golden Achievement"

#### プライマリーカラー（ゴールド/アンバー系）
```css
--primary-gold: #F59E0B        /* Amber 500 */
--primary-gold-light: #FCD34D  /* Amber 300 */
--primary-gold-dark: #D97706   /* Amber 600 */
```

**用途**:
- 金額表示（大きなサイズのみ）
- アクション完了の強調
- ブランド要素

#### セカンダリーカラー（ティール系）
```css
--secondary-teal: #14B8A6      /* Teal 500 */
--secondary-teal-light: #5EEAD4 /* Teal 300 */
```

**用途**:
- アクセント
- 装飾要素
- サブ情報の強調

#### アクセントカラー
```css
--accent-orange: #F97316  /* Orange 500 - CTAボタン */
--accent-pink: #EC4899    /* Pink 500 - お祝い */
```

### セマンティックカラー

| 色 | コード | 用途 |
|---|--------|------|
| Success | `#22C55E` | 成功メッセージ、完了状態 |
| Error | `#EF4444` | エラーメッセージ、警告 |
| Warning | `#F59E0B` | 注意喚起 |
| Info | `#3B82F6` | 情報提示 |

### グラデーション

```css
/* 成功・達成感を表現 */
--gradient-success: linear-gradient(135deg, #F59E0B 0%, #F97316 100%);

/* 背景用 */
--gradient-background: linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 100%);

/* お祝い用 */
--gradient-celebration: linear-gradient(135deg, #F59E0B 0%, #EC4899 100%);
```

### アクセシビリティ注意事項

- **ゴールド（#F59E0B）**: 大きなテキスト（18pt/24px以上）のみ使用可能
- **本文テキスト**: `--neutral-900` または `--neutral-700` を使用
- **コントラスト比**: WCAG AA 準拠を目指す（4.5:1 以上）

---

## タイポグラフィ

### フォントファミリー

**プライマリー**: Noto Sans JP

```css
font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont,
             'Segoe UI', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN',
             'Yu Gothic', YuGothic, Meiryo, sans-serif;
```

**読み込み方法**:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet">
```

### タイポグラフィスケール

| スタイル | ウェイト | サイズ | 行間 | 用途 |
|---------|---------|-------|------|-----|
| **Display** | 900 (Black) | 48-72px | 1.1 | 総貯金額 |
| **H1** | 700 (Bold) | 32-40px | 1.2 | ページタイトル |
| **H2** | 700 (Bold) | 24-32px | 1.2 | セクションタイトル |
| **Body Large** | 400 (Regular) | 18px | 1.6 | 重要な本文 |
| **Body** | 400 (Regular) | 16px | 1.6 | 標準本文 |
| **Body Small** | 400 (Regular) | 14px | 1.6 | 補足テキスト |
| **Label** | 500 (Medium) | 14px | 1.4 | フォームラベル |
| **Button** | 700 (Bold) | 18px | 1.3 | ボタンテキスト |

### レスポンシブタイポグラフィ

`clamp()` を使用した流動的なサイズ設定:

```css
/* 総貯金額 */
font-size: clamp(48px, 12vw, 72px);

/* H1見出し */
font-size: clamp(32px, 6vw, 40px);

/* H2見出し */
font-size: clamp(24px, 5vw, 32px);
```

### 特殊なタイポグラフィ

#### 金額表示用
```css
.savings-amount {
  font-variant-numeric: tabular-nums;
  /* 数字が等幅になり、レイアウトシフトを防ぐ */
}
```

#### グラデーションテキスト
```css
.text-gradient-gold {
  background: var(--gradient-success);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## スペーシング

### スペーシングスケール

| トークン | 値 | 用途 |
|---------|---|------|
| `--space-xs` | 4px | 極小の間隔 |
| `--space-sm` | 8px | アイコンとテキスト間 |
| `--space-md` | 16px | 標準の要素間隔 |
| `--space-lg` | 24px | セクション内の間隔 |
| `--space-xl` | 32px | セクション間の間隔 |
| `--space-2xl` | 48px | 大きなセクション間 |
| `--space-3xl` | 64px | ページ間の余白 |

### 使用例

```css
/* カード内のパディング */
padding: var(--space-md);

/* セクション間のマージン */
margin-bottom: var(--space-xl);

/* ボタンと他要素の間 */
gap: var(--space-lg);
```

---

## コンポーネント

### 1. ボタン

#### プライマリーボタン
**用途**: 「我慢した！」ボタンなど、主要なアクション

```css
.button-primary {
  background: var(--gradient-success);
  color: var(--white);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  padding: 16px 32px;
  border-radius: var(--radius-xl);
  min-height: 56px;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-fast) var(--ease-out);
}

.button-primary:hover {
  box-shadow: var(--shadow-lg);
}

.button-primary:active {
  transform: scale(0.95);
}
```

**状態**:
- Default: グラデーション背景
- Hover: シャドウが強くなる
- Active: scale(0.95)
- Disabled: 不透明度 0.5、ポインターイベント無効

#### セカンダリーボタン
**用途**: 「戻る」「キャンセル」など、副次的なアクション

```css
.button-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border-primary);
  font-weight: var(--font-weight-bold);
  padding: 12px 24px;
  border-radius: var(--radius-lg);
  min-height: 44px;
}
```

### 2. 入力フィールド

#### 数値入力（価格設定用）

```css
.input-number {
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  font-size: var(--font-size-lg);
  border: 2px solid var(--border-primary);
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: border-color var(--transition-base);
}

.input-number:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: var(--shadow-focus);
}

.input-number.error {
  border-color: var(--border-error);
}
```

### 3. カード

#### 履歴アイテムカード

```css
.history-card {
  background: var(--bg-primary);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base);
}

.history-card:hover {
  box-shadow: var(--shadow-md);
}
```

### 4. モーダル

#### 成功メッセージモーダル

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  z-index: var(--z-modal-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: var(--gradient-background);
  padding: var(--space-2xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-2xl);
  max-width: 400px;
  width: 90%;
  text-align: center;
  animation: modalEnter var(--animation-modal-enter-duration) var(--ease-spring);
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### 5. バッジ/タグ

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.badge-gold {
  background: var(--primary-gold-light);
  color: var(--neutral-900);
}
```

---

## アニメーション

### アニメーション原則

1. **パフォーマンス優先**: `transform` と `opacity` のみ使用（GPUアクセラレーション）
2. **控えめ**: ユーザーの操作を妨げない
3. **意味のある**: フィードバックとして機能

### トランジション速度

```css
--transition-fast: 150ms;      /* 即座のフィードバック */
--transition-base: 250ms;      /* 標準 */
--transition-slow: 350ms;      /* 強調したい動き */
--transition-slower: 500ms;    /* カウントアップなど */
```

### 主要アニメーション

#### 1. ボタン押下
```css
.button:active {
  transform: scale(0.95);
  transition: transform 150ms var(--ease-out);
}
```

#### 2. 成功モーダル表示
```css
@keyframes successModalEnter {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.success-modal {
  animation: successModalEnter 350ms var(--ease-spring);
}
```

#### 3. 金額カウントアップ
JavaScriptで実装:
```javascript
function animateValue(start, end, duration) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(timer);
    }
    updateDisplay(Math.floor(current));
  }, 16);
}
```

#### 4. 履歴アイテム追加
```css
@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.history-item-new {
  animation: slideInFromRight 250ms var(--ease-out);
}
```

### ハプティックフィードバック（モバイル）

```javascript
// 軽いフィードバック（ボタン押下）
navigator.vibrate(10);

// 中程度のフィードバック（成功記録）
navigator.vibrate(20);

// パターン振動（マイルストーン達成）
navigator.vibrate([50, 30, 50, 30, 100]);
```

---

## アクセシビリティ

### カラーコントラスト

| 要素 | 最低比率 | 推奨比率 |
|-----|---------|---------|
| 大きなテキスト（24px+） | 3:1 | 4.5:1 |
| 通常テキスト | 4.5:1 | 7:1 |
| UI コンポーネント | 3:1 | - |

### フォーカスインジケーター

```css
:focus-visible {
  outline: 3px solid var(--primary-gold);
  outline-offset: 2px;
}
```

### スクリーンリーダー対応

#### 金額変更のアナウンス
```html
<div role="status" aria-live="polite" class="sr-only">
  800円節約しました！合計12,800円になりました。
</div>
```

#### ボタンのラベル
```html
<button aria-label="ラーメンを我慢したことを記録">
  我慢した！
</button>
```

### キーボードナビゲーション

| キー | 動作 |
|-----|------|
| Tab | 次の要素にフォーカス |
| Shift + Tab | 前の要素にフォーカス |
| Enter / Space | ボタンを起動 |
| Escape | モーダルを閉じる |

### タッチターゲットサイズ

```css
/* モバイル */
.button {
  min-width: 44px;
  min-height: 44px;
}

/* タブレット */
@media (min-width: 768px) {
  .button {
    min-width: 48px;
    min-height: 48px;
  }
}
```

---

## 実装ガイド

### デザイントークンの読み込み

```css
/* メインCSSファイルの先頭で読み込む */
@import './design-tokens.css';
```

### コンポーネントの使用例

```html
<button class="button-primary focus-ring">
  我慢した！
</button>

<div class="history-card">
  <div class="font-tabular-nums text-gradient-gold">
    ¥800
  </div>
</div>
```

---

## 参考資料

- [デザインブリーフ](./design_brief.md)
- [デザイントークンCSS](../../src/styles/design-tokens.css)
- [PWA Manifest](../../public/manifest.json)
