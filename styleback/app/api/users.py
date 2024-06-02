from flask import Blueprint, request, jsonify, abort
import os
import jwt
from app.services.firebase import get_posts_by_user, get_user_details, add_swipe_history
from app.services.auth import token_required
import requests

users_blueprint = Blueprint('users', __name__)

clerk_api_key = os.getenv('CLERK_SECRET_KEY')

# Function to get user from Clerk
@users_blueprint.route('/user/<user_id>', methods=['GET'])
def get_user_profile(user_id):

    # Retrieve user data from clerk
    headers = {'Authorization': f'Bearer {clerk_api_key}'}
    clerk_endpoint = f'https://api.clerk.com/v1/users/{user_id}'
    response = requests.get(clerk_endpoint, headers=headers)
    response_json = response.json()

    # Retrieve posts from firestore
    user_posts = get_posts_by_user(user_id)
    user_data = get_user_details(user_id)

    if not user_data:
        return jsonify({"error": "User not found in Firestore"}), 404
    

    # Create fields of user data
    user = {
        'id': response_json['id'],
        'username': response_json['username'],
        'image_url': response_json['image_url'],
        'bio': user_data['bio'],
        'following': user_data['following'],
        'followers': user_data['followers'],
        'post_ids': user_posts,
    }

    # Check for a successful response
    if response.status_code == 200:
        return jsonify(user), 200
    # Check for a not found response
    elif response.status_code == 404:
        abort(404, description="User not found")
    else:
        # For other HTTP errors, return a generic error message
        # Log the error for debugging purposes
        print(f"Failed to fetch user: {response.status_code}, {response.text}")
        abort(response.status_code, description="Failed to fetch user profile from Clerk")
        
# Upload Post Metrics
@users_blueprint.route('/like/<user_id>/<post_id>', methods=['POST'])
def add_user_like(user_id, post_id):
    try:
        metrics = request.form.get('metrics', '')
        add_swipe_history(user_id, post_id, metrics)
        return jsonify(metrics), 200
    except Exception as e:
            # Attempt to clean up even if there is an error
            return jsonify(error=str(e)), 500