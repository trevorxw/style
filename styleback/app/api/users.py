from flask import Blueprint, request, jsonify, abort
import os
import jwt
from app.services.firebase import get_posts_by_user, get_user_details, add_swipe_history, get_user_collection, get_user_collections, add_new_collection, create_new_user, edit_collection_user, upload_file_to_collections, del_collection
from app.services.auth import token_required
import requests
from werkzeug.utils import secure_filename
import tempfile
from datetime import datetime
import pytz

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

    create_new_user(user_id)

    # Retrieve posts from firestore
    user_posts = get_posts_by_user(user_id)
    user_data = get_user_details(user_id)

    if not user_data:
        return jsonify({"error": "User not found in Firestore"}), 404
    
    bio = ''

    if 'bio' in response_json['unsafe_metadata']:
         bio = response_json['unsafe_metadata']['bio']

    # Create fields of user data
    user = {
        'id': response_json['id'],
        'username': response_json['username'],
        'image_url': response_json['image_url'],
        'bio': bio,
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

# Retrieve/Create User Collections
@users_blueprint.route('/collections/<user_id>', methods=['GET', 'POST'])
def manage_collections(user_id):
    if request.method == 'GET':
        try:
            response = get_user_collections(user_id)
            return response
        except Exception as e:
            return jsonify({"error": "Could not fetch user collections", "details": str(e)}), 500

    elif request.method == 'POST':
        try:
            # Retrieve data from the POST request
            data = request.get_json()
            result = add_new_collection(user_id, data)
            return jsonify(result), 201
        except Exception as e:
            return jsonify({"error": "Failed to create collection", "details": str(e)}), 500
        

# Edit User Collection
@users_blueprint.route('/collection/<user_id>/<collection_id>', methods=['GET', 'POST'])
def edit_collection(user_id, collection_id):
    if request.method == 'GET':
        response = get_user_collection(user_id, collection_id)
        return response
    
    elif request.method == 'POST':
        data = {}
        if 'posts' in request.form:

            posts = request.form.get('posts', [])
            data['posts'] = posts

        if 'title' in request.form or 'description' in request.form:

            title = request.form.get('title', '')
            description = request.form.get('description', '')
            data = {}
            if title != '':
                data['title'] = title
            if description != '':
                data['description'] = description

        if 'file' in request.files:
            file = request.files['file']
            if file.filename == '':
                return jsonify(error="No selected file"), 400
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                # Create temp file path
                temp_dir = tempfile.mkdtemp()
                filepath = os.path.join(temp_dir, filename)
                file.save(filepath)
                try:

                    # Upload file to Firebase Storage and add tags to Firestore
                    unique_filename = f"{user_id}/{collection_id}"
                    file_url = upload_file_to_collections(filepath, unique_filename)

                    data['uri'] = file_url
                except Exception as e:
                    os.remove(filepath)
                    os.rmdir(temp_dir)

                    return jsonify({"error": "Failed to edit collection", "details": str(e)}), 500
        edit_collection_user(user_id, collection_id, data)
        return jsonify(collection_id), 200

# Delete User Collection
@users_blueprint.route('/collection/<user_id>/<collection_id>', methods=['DELETE'])
def delete_collection(user_id, collection_id):
    try:
        # Document reference
        
        if del_collection(user_id, collection_id):
            return jsonify({"success": "Collection deleted successfully"}), 202
        else:
            return jsonify({"error": "Failed to delete collection or collection not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Upload Post Metrics
@users_blueprint.route('/like/<user_id>/<post_id>', methods=['POST'])
def add_user_like(user_id, post_id):
    try:
        data = request.get_json()  # Use .get_json() to parse JSON body
        liked = data.get('liked', 0)
        duration = data.get('duration', 0)
        shared = data.get('shared', 0)
        time = data.get('time', datetime.now().astimezone(pytz.timezone('America/Los_Angeles')).strftime('%Y%m%d%H%M%S'))

        metrics = {
                'liked': liked,
                'duration': duration,
                'shared': shared,
                'time': time,
            }
        add_swipe_history(user_id, post_id, metrics)
        return jsonify(metrics), 200
    except Exception as e:
            # Attempt to clean up even if there is an error
            return jsonify(error=str(e)), 500
    
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}