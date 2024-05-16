from flask import Blueprint, request, jsonify, abort
import os
import jwt
import app
from app.services.firebase import get_post, get_all_posts, save_user_interaction, upload_file_to_storage, add_tags_to_firestore
from app.services.auth import token_required
from app.imagetagger.imagetagger import tag_image
from werkzeug.utils import secure_filename
import tempfile

posts_blueprint = Blueprint('posts', __name__)

# app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max-size limit

@posts_blueprint.route('/cards/<post_id>', methods=['GET'])
# @token_required
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
# @token_required
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
    
@posts_blueprint.route('/upload/<user_id>', methods=['POST'])
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
            # Tag the image
            tags = tag_image(filepath)
            
            # Upload file to Firebase Storage and add tags to Firestore
            file_url = upload_file_to_storage(filepath, filename)
            add_tags_to_firestore(filename, user_id, tags)
            
            # Clean up the temporary directory
            os.remove(filepath)
            os.rmdir(temp_dir)
            
            return jsonify({
                'message': "File and tags uploaded successfully",
                'filename': filename,
                'tags': tags,
                'url': file_url
            })
        except Exception as e:
            # Attempt to clean up even if there is an error
            os.remove(filepath)
            os.rmdir(temp_dir)
            return jsonify(error=str(e)), 500
    return jsonify(error="Invalid file or file type"), 400

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}

