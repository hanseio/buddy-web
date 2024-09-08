from openai import OpenAI
import os
from langdetect import detect

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def detect_language(text):
    try:
        return detect(text)
    except:
        return 'ko'  # 기본값으로 영어 설정

def get_system_message(lang):
    messages = {
        'ko': "당신은 항상 다른 사람들에게 조언을 해주는 가장 친한 친구입니다.",
        'en': "You're the best friend who always gives advice to others.",
        'ja': "あなたは常に他人にアドバイスをする親友です。",
        # 필요한 언어를 추가할 수 있습니다.
    }
    return messages.get(lang, messages['en'])  # 지원하지 않는 언어는 영어로 기본 설정

def generate_ai_response(user_message, use_language_detection=False):
    try:
        if use_language_detection:
            detected_lang = detect_language(user_message)
            system_message = get_system_message(detected_lang)
        else:
            system_message = "You're the best friend who always gives advice to others."

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You’re the best friend who always gives advice to others."},
                {"role": "user", "content": "Hello?"},
                {"role": "assistant", "content": "Hey! What's going on?"},
                {"role": "user", "content": user_message}
            ],
            max_tokens=150
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating AI response: {e}")
        return "죄송합니다. 응답을 생성하는 데 문제가 발생했습니다."