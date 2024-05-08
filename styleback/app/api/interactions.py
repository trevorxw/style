from flask import Blueprint, request, jsonify, abort
import os
import jwt
from app.services.firebase import get_item, save_user_interaction
from app.services.auth import token_required

interactions_blueprint = Blueprint('interactions', __name__)

@interactions_blueprint.route('/item/<item_id>', methods=['GET'])

# Retrieve next num_cards for user_id
@interactions_blueprint.route('/cards/<user_id>/<num_cards>', methods=['GET'])
@token_required
def get_cards(user_id, num_cards):
    print(num_cards, " cards requested for user: ", user_id)
    try:
        query_snapshot = db.collection('UserPost').stream()
        cards = [{'id': doc.id, **doc.to_dict()} for doc in query_snapshot]
        return jsonify(cards), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
