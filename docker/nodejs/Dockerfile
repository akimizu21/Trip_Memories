# ベースイメージとしてUbuntuを使用
FROM ubuntu:20.04

# 非対話的インストール設定
ENV DEBIAN_FRONTEND=noninteractive

# Node.js 18をインストール
RUN apt-get update && \
    apt-get install -y curl ca-certificates && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 依存関係をインストール
COPY frontend/package*.json ./
RUN npm install

# アプリのソースをコピーしてビルド
COPY frontend ./
RUN npm run build

# ポート公開
EXPOSE 3000

# Next.js 本番起動
CMD ["npm", "start"]