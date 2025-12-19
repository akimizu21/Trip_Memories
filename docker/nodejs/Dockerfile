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

# アプリのソースをコピー
COPY frontend ./

# ビルド時に環境変数を受け取る
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# ビルド（環境変数が埋め込まれる）
RUN npm run build

# ポート公開
EXPOSE 3000

# Next.js 本番起動（0.0.0.0にバインド + PORT環境変数を使用）
CMD ["sh", "-c", "npm start -- -H 0.0.0.0 -p ${PORT:-3000}"]