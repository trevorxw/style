from flask import Blueprint, request, jsonify, abort
import os
import jwt
import app
from app.services.firebase import get_post, get_all_posts, get_all_ootd, upload_file_to_storage, add_data_to_firestore, add_ootd_to_firestore, get_posts_by_user, get_ootd_by_user, get_liked_posts_by_user, del_post
from app.services.auth import token_required
from app.imagetagger.imagetagger import tag_image
from werkzeug.utils import secure_filename
import tempfile
from datetime import datetime
import pytz

posts_blueprint = Blueprint('posts', __name__)

# app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max-size limit

@posts_blueprint.route('/cards/<post_id>', methods=['GET'])
@token_required
def get_post_from_id(post_id):
    """
    Retrieves a post from Firestore based on the post_id.
    Returns the JSON response of the post or an error message.
    """
    try:
        response = get_post(post_id)
        return response
    except Exception as e:
        return jsonify({"Could not retrieve post": str(e)}), 500
    
@posts_blueprint.route('/cards/', methods=['GET'])
@token_required
def get_posts():
    """
    Retrieves a post from Firestore based on the post_id.
    Returns the JSON response of the post or an error message.
    """
    try:
        response = get_all_posts()
        return response
    except Exception as e:
        return jsonify({"Could not retrieve post": str(e)}), 500
    
@posts_blueprint.route('/ootds/<user_id>', methods=['GET'])
def get_ootds(user_id):
    """
    Retrieves a post from Firestore based on the post_id.
    Returns the JSON response of the post or an error message.
    """
    try:
        response = get_all_ootd(user_id)
        return response
    except Exception as e:
        return jsonify({"Could not retrieve post": str(e)}), 500
    
@posts_blueprint.route('/cards/<user_id>', methods=['GET'])
@token_required
def get_user_posts(user_id):
    """
    Retrieves all posts uploaded by a user.
    Returns the JSON response of the post or an error message.
    """
    try:
        response = get_posts_by_user(user_id)
        return response
    except Exception as e:
        return jsonify({"Could not retrieve post": str(e)}), 500
    
@posts_blueprint.route('/ootd/<user_id>', methods=['GET'])
@token_required
def get_user_ootd(user_id):
    """
    Retrieves all ootd uploaded by a user.
    Returns the JSON response of the post or an error message.
    """
    try:
        response = get_ootd_by_user(user_id)
        return response
    except Exception as e:
        return jsonify({"Could not retrieve post": str(e)}), 500
    
@posts_blueprint.route('/likes/<user_id>', methods=['GET'])
@token_required
def get_user_liked_posts(user_id):
    """
    Retrieves all posts uploaded by a user.
    Returns the JSON response of the post or an error message.
    """
    try:
        response = get_liked_posts_by_user(user_id)
        return response
    except Exception as e:
        return jsonify({"Could not retrieve post": str(e)}), 500

@posts_blueprint.route('/upload/<user_id>', methods=['POST'])
@token_required
def upload_file(user_id):
    if 'file' not in request.files:
        return jsonify(error="No file part"), 400
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
            # Additional data
            description = request.form.get('description', '')
            category = request.form.get('category', '')
            shops = request.form.get('shops', '')

            # Tag the image
            tags = tag_image(filepath)
            
            # Upload file to Firebase Storage and add tags to Firestore
            unique_filename = f"{user_id}{datetime.now().astimezone(pytz.timezone('America/Los_Angeles')).strftime('%Y%m%d%H%M%S')}"
            file_url = upload_file_to_storage(filepath, unique_filename+'.jpg')

            # Add file metadata and tags to Firestore
            file_metadata = {
                'user_id': user_id,
                'created_at': datetime.now(),
                'url': file_url,
                'shops': shops,
                'description': description,
                'category': category,
                'likes': 0,
                'shares': 0,
                'tags': tags,
            }
            if 'ootd' in category:
                add_ootd_to_firestore(unique_filename, user_id, file_metadata)
            else:
                add_data_to_firestore(unique_filename, user_id, file_metadata)
            
            # Clean up the temporary directory
            os.remove(filepath)
            os.rmdir(temp_dir)
            
            return jsonify(file_metadata), 200
        except Exception as e:
            # Attempt to clean up even if there is an error
            os.remove(filepath)
            os.rmdir(temp_dir)
            return jsonify(error=str(e)), 500
    return jsonify(error="Invalid file or file type"), 400

@posts_blueprint.route('/post/<user_id>/<post_id>', methods=['DELETE'])
def delete_post(user_id, post_id):
    try:
        # Document reference
        
        if del_post(user_id, post_id):
            return jsonify({"success": "Collection deleted successfully"}), 202
        else:
            return jsonify({"error": "Failed to delete collection or collection not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}

