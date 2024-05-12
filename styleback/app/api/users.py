from flask import Blueprint, request, jsonify, abort
import os
import jwt
from app.services.firebase import save_user_interaction
from app.services.auth import token_required
import requests

users_blueprint = Blueprint('users', __name__)

clerk_api_key = os.getenv('CLERK_SECRET_KEY')

# Function to get user from Clerk
@users_blueprint.route('/user/<user_id>', methods=['GET'])
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
        
        