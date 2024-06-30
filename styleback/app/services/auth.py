from flask import request, jsonify
from firebase_admin import auth
import jwt
import os
from functools import wraps

def token_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        # Check for token in the request header
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Authorization token is missing'}), 401
        
        try:
            # Remove 'Bearer ' if present
            if 'Bearer ' in token:
                token = token.replace('Bearer ', '', 1)
            # Verify the token
            decoded_token = auth.verify_id_token(token)
            request.user = decoded_token
        except Exception as e:
            return jsonify({'error': 'Invalid or expired token', 'details': str(e)}), 403
        
        return f(*args, **kwargs)
    return wrap