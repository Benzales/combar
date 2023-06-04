import jwt
import datetime
from flask import g, request, jsonify

SECRET_KEY = "my_secret_key"

def create_token(user_id):
    """
    Create a JWT token for a given user_id.
    """
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def verify_token(token):
    """
    Verify a given JWT token and return the user_id contained within.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise Exception("Token expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token. Please log in again.")

    return payload['user_id']

def create_refresh_token(user_id):
    """
    Create a JWT refresh token for a given user_id.
    """
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)  # Refresh token usually lasts longer
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def refresh_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Refresh token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

    user_id = payload['user_id']
    new_access_token = create_token(user_id)
    return jsonify({"access_token": new_access_token}), 200

def load_logged_in_user():
    token = request.headers.get('Authorization')
    try:
        user_id = verify_token(token)
    except Exception as e:
        user_id = None
        
    g.user_id = user_id