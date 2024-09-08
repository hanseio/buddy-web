from dotenv import load_dotenv
load_dotenv()  # .env 파일에서 환경 변수를 로드합니다.

from app import app

if __name__ == '__main__':
    app.run(debug=True)