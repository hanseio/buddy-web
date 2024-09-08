from flask import Flask
from app import app
import os
from dotenv import load_dotenv

load_dotenv()

app.secret_key = os.getenv("SECRET_KEY")  # 환경 변수 사용

if __name__ == '__main__':
    app.run(debug=True)