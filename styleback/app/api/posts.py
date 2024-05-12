from flask import Blueprint, request, jsonify, abort
import os
import jwt
from app.services.firebase import get_post, get_all_posts, save_user_interaction
from app.services.auth import token_required

posts_blueprint = Blueprint('posts', __name__)

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

