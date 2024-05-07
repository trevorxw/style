from dotenv import load_dotenv
from flask import Flask, jsonify, request, abort
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

clerk_api_key = os.getenv('CLERK_SECRET_KEY')

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

# Retrieve next num_cards for user_id
@app.route('/cards/<user_id>/<num_cards>', methods=['GET'])
def get_cards(user_id, num_cards):
    print(num_cards, " cards requested for user: ", user_id)
    try:
        query_snapshot = db.collection('UserPost').stream()
        cards = [{'id': doc.id, **doc.to_dict()} for doc in query_snapshot]
        return jsonify(cards), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Add new user
@app.route('/new_user/<user_id>', methods=['PUT'])
def new_user(user_id):
    # Create a dictionary with post_ids initialized
    user_data = {'post_id_{}'.format(i): None for i in range(1, 11)}
    
    # Add user_id to the dictionary
    user_data['user_id'] = user_id

    # Add the new user data to Firestore
    db.collection('users').document(user_id).set(user_data)

    # Return success message
    return jsonify({"success": True, "message": "User created successfully"}), 200
        
    
# Function to get user from Clerk
@app.route('/user/<user_id>', methods=['GET'])
def get_clerk_user(user_id):
    headers = {'Authorization': f'Bearer {clerk_api_key}'}
    clerk_endpoint = f'https://api.clerk.com/v1/users/{user_id}'
    response = requests.get(clerk_endpoint, headers=headers)
    
    # Check for a successful response
    if response.status_code == 200:
        return response.json()
    # Check for a not found response
    elif response.status_code == 404:
        abort(404, description="User not found")
    else:
        # For other HTTP errors, return a generic error message
        # Log the error for debugging purposes
        print(f"Failed to fetch user: {response.status_code}, {response.text}")
        abort(response.status_code, description="Failed to fetch user profile from Clerk")

    

# def get_user_image(user_id):
#     # Query Clerk for user.
#     user = get_clerk_user(user_id)
    
#     if not user:
#         # Abort and send a 404 Not Found if user data could not be retrieved
#         abort(404, description="User not found or failed to fetch user data.")
        
#     # Construct response
#     response = {
#         'user': user.image_url
#     }
#     return jsonify(response), 200

cred = credentials.Certificate("style-d2141-firebase-adminsdk-7j1ar-e2ee195ff6.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)