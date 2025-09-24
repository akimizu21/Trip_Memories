# 開発用

# ベースイメージとしてNodeを使用してビルド
FROM node:18 AS build

# アプリケーションディレクトリを作成して移動
WORKDIR /src

# package.jsonとpackage-lock.jsonをコピーして依存関係をインストール
COPY frontend/package*.json .
RUN npm install

# ここからデプロイのために追加

# アプリ本体をコピー
COPY frontend/ ./

# Next.js を本番用にビルド
RUN npm run build && npm run export

# --- Production Stage ---
FROM nginx:alpine

# nginx のデフォルト設定を削除して置き換え（必要なら）
# COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# build成果物をコピー
COPY --from=build /app/out /usr/share/nginx/html

# nginx が 80 番ポートで配信
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]