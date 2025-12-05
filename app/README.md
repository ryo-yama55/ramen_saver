# ラーメン貯金

ラーメンを我慢して節約を実現するWebアプリケーション

## 技術スタック

- **フレームワーク**: React 18
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **状態管理**: Zustand (with persist middleware)
- **PWA**: vite-plugin-pwa

## 開発環境のセットアップ

### 必要な環境

- Node.js 18以上
- npm または yarn

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開く

### ビルド

```bash
npm run build
```

ビルド成果物は `dist/` ディレクトリに出力されます。

### プレビュー（ビルド後の確認）

```bash
npm run preview
```

## プロジェクト構造

```
app/
├── src/
│   ├── components/    # UIコンポーネント
│   ├── pages/         # ページコンポーネント
│   ├── store/         # Zustandストア
│   ├── utils/         # ユーティリティ関数
│   ├── hooks/         # カスタムフック
│   ├── App.jsx        # ルートコンポーネント
│   ├── main.jsx       # エントリーポイント
│   └── index.css      # グローバルCSS
├── public/            # 静的ファイル
├── index.html
├── vite.config.js     # Vite設定
├── tailwind.config.js # Tailwind CSS設定
└── package.json
```

## データ構造

アプリケーションのデータはブラウザのlocalStorageに保存されます。

### Record（我慢記録）

```javascript
{
  id: string,        // ユニークID
  date: string,      // 記録日時（ISO 8601形式）
  amount: number     // 節約額（円）
}
```

### State

```javascript
{
  isOnboarded: boolean,   // オンボーディング完了フラグ
  ramenPrice: number,     // ラーメン価格（円）
  records: Record[]       // 我慢記録の配列
}
```

## ライセンス

MIT
