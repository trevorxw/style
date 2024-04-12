from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import firebase_admin
from firebase_admin import credentials, firestore
import jwt
import requests
from functools import wraps

load_dotenv()  # This loads the environment variables from .env.

app = Flask(__name__)
CORS(app)

clerk_api_key = os.getenv('CLERK_API_KEY')

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        try:
            data = jwt.decode(token, os.environ.get(clerk_api_key), algorithms=["HS256"])
            current_user = data['sub']
        except:
            return jsonify({'message': 'Token is invalid!'}), 403
        return f(current_user, *args, **kwargs)
    return decorated_function

@app.route('/cards', methods=['GET'])
def get_cards():
    print("cards requested")
    try:
        query_snapshot = db.collection('UserPost').stream()
        cards = [{'id': doc.id, **doc.to_dict()} for doc in query_snapshot]
        return jsonify(cards), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Function to get user from Clerk
def get_clerk_user(user_id):
    headers = {'Authorization': f'Bearer {clerk_api_key}'}
    clerk_endpoint = f'https://api.clerk.com/style/users/{user_id}'
    response = requests.get(clerk_endpoint, headers=headers)
    if response.status_code == 200:
        return response.json()
    return None
    
@app.route('/profile/<user_id>', methods=['GET'])
def get_user(user_id):
    # Query Clerk for user.
    user = get_clerk_user(user_id)
    # Construct response
    response = {
        'user': user
    }
    return jsonify(response), 200

cred = credentials.Certificate("style-d2141-firebase-adminsdk-7j1ar-e2ee195ff6.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)