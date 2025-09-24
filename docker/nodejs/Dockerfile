# 開発用

# # ベースイメージとしてNodeを使用してビルド
# FROM node:18 AS build

# # アプリケーションディレクトリを作成して移動
# WORKDIR /src

# # package.jsonとpackage-lock.jsonをコピーして依存関係をインストール
# COPY frontend/package*.json .
# RUN npm install

# ======================
# 1. ビルドステージ
# ======================
FROM node:18 AS builder
WORKDIR /app

# 依存関係をインストール
COPY frontend/package*.json ./
RUN npm install

# アプリのソースをコピーしてビルド
COPY frontend ./
RUN npm run build

# ======================
# 2. 実行ステージ
# ======================
FROM node:18-alpine AS runner
WORKDIR /app

# 本番に必要なファイルだけコピー
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# ポート公開
EXPOSE 3000

# Next.js 本番起動
CMD ["npm", "start"]