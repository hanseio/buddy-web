from flask import render_template, redirect, url_for, session, request
from flask_dance.contrib.google import make_google_blueprint, google
from authlib.integrations.flask_client import OAuth
from app import app
import os

# Insecure Transport 허용 (로컬 개발 시 사용)
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# Google OAuth 설정
google_bp = make_google_blueprint(
    client_id=os.getenv("GOOGLE_CLIENT_ID"),  # 환경 변수에서 읽어옴
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),  # 환경 변수에서 읽어옴
    redirect_to="google_login"
)
app.register_blueprint(google_bp, url_prefix="/login")

# Authlib를 사용한 OAuth 설정
oauth = OAuth(app)

# Kakao OAuth 설정
kakao = oauth.register(
    name='kakao',
    client_id=os.getenv("KAKAO_CLIENT_ID"),  # 환경 변수에서 읽어옴
    client_secret=None,
    access_token_url='https://kauth.kakao.com/oauth/token',
    authorize_url='https://kauth.kakao.com/oauth/authorize',
    api_base_url='https://kapi.kakao.com/',
    client_kwargs={'scope': ''},
    redirect_uri='http://127.0.0.1:5000/kakao_callback'  # 여기를 수정
)

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/google_login')
def google_login():
    if not google.authorized:
        return redirect(url_for("google.login"))
    resp = google.get("/oauth2/v2/userinfo")
    assert resp.ok, resp.text
    user_info = resp.json()
    session['google_user'] = {
        'email': user_info.get('email'),
        'name': user_info.get('name')
    }
    return redirect(url_for('home'))

@app.route('/kakao_login')
def kakao_login():
    redirect_uri = url_for('kakao_callback', _external=True)
    return kakao.authorize_redirect(redirect_uri)

@app.route('/kakao_callback')
def kakao_callback():
    try:
        token = kakao.authorize_access_token()
        print(f"Received token: {token}")  # 토큰 정보 출력
        
        resp = kakao.get('v2/user/me')
        print(f"Kakao API response: {resp.json()}")  # API 응답 출력
        
        profile = resp.json()
        session['kakao_user'] = {
            'id': profile.get('id'),
            'email': profile.get('kakao_account', {}).get('email'),
            'nickname': profile.get('properties', {}).get('nickname')
        }
        return redirect(url_for('home'))
    except Exception as e:
        print(f"Detailed Kakao login error: {str(e)}")
        print(f"Request args: {request.args}")  # 요청 파라미터 출력
        return f"Failed to login with Kakao: {str(e)}", 400

@app.route('/')
def home():
    if 'google_user' in session or 'kakao_user' in session:
        return render_template('main.html')
    return redirect(url_for('login'))