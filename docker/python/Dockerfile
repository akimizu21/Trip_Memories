#ベースイメージとしてUbuntuを使用
FROM ubuntu:20.04

# 非対話的インストール設定
ENV DEBIAN_FRONTEND=noninteractive

# Pythonのみをインストール
RUN apt-get update && \
    apt-get install -y \
        python3 \
        python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
    
# アプリケーションディレクトリを作成して移動
WORKDIR /app

# requirements.txtをコピー
COPY docker/python/requirements.txt .

# requirements.txtをインストール
RUN pip3 install --no-cache-dir -r /app/requirements.txt

# アプリケーションのソースコードをコピー
COPY ./backend/ .

# Renderは PORT 環境変数を渡してくる
ENV PORT=8080

# 開発用 Uvicornでアプリケーションを起動
# CMD [ "python3", "-m", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8080"]

# 本番用：--reload を削除、ポートを環境変数から取得
CMD python3 -m uvicorn main:app --host 0.0.0.0 --port $PORT