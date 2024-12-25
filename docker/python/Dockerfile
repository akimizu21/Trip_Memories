#ベースイメージとしてPythonを使用してビルド
FROM python:3.7

# アプリケーションディレクトリを作成して移動
WORKDIR /app

# requirements.txtをコピー
COPY docker/python/requirements.txt .

# requirements.txtをインストール
RUN pip install --no-cache-dir -r /app/requirements.txt

# アプリケーションのソースコードをコピー
COPY ./backend/ .

# Uvicornでアプリケーションを起動
CMD [ "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8080"]

