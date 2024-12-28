# ベースイメージとしてNodeを使用してビルド
FROM node:18 AS build

# アプリケーションディレクトリを作成して移動
WORKDIR /src

# package.jsonとpackage-lock.jsonをコピーして依存関係をインストール
COPY frontend/package*.json .
RUN npm install