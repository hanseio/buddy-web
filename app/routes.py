from app import app
from flask import render_template

@app.route('/')
def home():
    return render_template('index.html')

#--------------------

from flask import request, jsonify
import numpy as np
from sklearn.linear_model import LogisticRegression

model = LogisticRegression().fit(np.array([[0, 0], [1, 1]]), np.array([0, 1]))

@app.route('/api/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_input = data.get('input', '')

    # 간단한 로직으로 추천 (나중에 개선 가능)
    prediction = model.predict([[len(user_input), user_input.count(' ')]])

    return jsonify({'recommendation': 'This is a recommended message.' if prediction[0] == 1 else 'Try a different approach.'})