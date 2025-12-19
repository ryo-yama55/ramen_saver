.PHONY: help install test lint build clean ci

# デフォルトターゲット
help:
	@echo "Available commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make test     - Run tests"
	@echo "  make lint     - Run linter"
	@echo "  make build    - Build the application"
	@echo "  make ci       - Run CI checks (lint + test + build)"
	@echo "  make clean    - Clean build artifacts"

# 依存関係のインストール
install:
	cd app && npm ci

# テストの実行（unitテストのみ）
test:
	cd app && npm run test -- --run --project=unit

# Lintの実行
lint:
	cd app && npm run lint

# ビルドの実行
build:
	cd app && npm run build

# CI用のコマンド（lint + test + build）
ci: lint test build
	@echo "✅ All CI checks passed!"

# クリーンアップ
clean:
	rm -rf app/dist
	rm -rf app/node_modules
	rm -rf app/.vite
