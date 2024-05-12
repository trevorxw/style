from flask import Blueprint, request, jsonify, abort
import os
import jwt
from app.services.firebase import save_user_interaction
from app.services.auth import token_required

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/item/<item_id>', methods=['GET'])
@token_required
def get_item_details(current_user, item_id):
    try:
        item = get_item(item_id)
        if item:
            return jsonify(item), 200
        else:
            abort(404)  # Not found
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_blueprint.route('/interaction', methods=['POST'])
@token_required
def log_interaction(current_user):
    try:
        data = request.json
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        data['user_id'] = current_user
        result = save_user_interaction(data)
        return jsonify(result), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Additional routes can be added here
