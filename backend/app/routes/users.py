from flask import Blueprint, request, jsonify, abort
from app.models import User
from app import db
from urllib.parse import unquote
from bs4 import BeautifulSoup
import requests
from urllib.parse import unquote, urldefrag
from google.oauth2 import id_token
from google.auth.transport import requests
from sqlalchemy import inspect
from sqlalchemy.exc import IntegrityError

users = Blueprint('users', __name__)

@users.route('/api/users', methods=['PUT'])
def update_user():
    data = request.get_json()

    # Ensure all required fields are present
    if not all(k in data for k in ("username", "email")):
        return jsonify({"message": "Missing required field"}), 400

    user = User.query.get(data.get('id'))
    
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Check length constraints
    inspector = inspect(User)
    for attr in ["username", "email", "name", "bio", "profile_picture"]:
        if len(data.get(attr, '')) > inspector.columns[attr].type.length:
            return jsonify({"message": f"{attr.capitalize()} too long"}), 400

    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    user.name = data.get('name', user.name)
    user.bio = data.get('bio', user.bio)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Username or email already exists"}), 400

    return jsonify({'message': 'User updated!'}), 200


@users.route('/api/users/<string:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if user is None:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'username': user.username,
        'email': user.email,
        'name': user.name,
        'bio': user.bio
    }), 200

@users.route('/api/users/google', methods=['POST'])
def google_login():
    token = request.headers.get('Authorization')
    if not token:
        abort(401, 'Authorization header missing')
    
    CLIENT_ID = "803872553454-i0a48spjdqr2vet08sqq78h1g57glbm2.apps.googleusercontent.com"
    
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
        
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        google_id = idinfo['sub']

        # You can replace the code below with your existing user-handling logic
        user = User.query.filter_by(google_id=google_id).first()

        # If user does not exist, create a new user
        if not user:
            user = User(
                email=idinfo['email'],  
                name=idinfo['name'],
                google_id=google_id,
                bio=""
            )
            db.session.add(user)
            db.session.commit()

            username = ''
        
        else: 
            username = user.username

        return jsonify({
            'id': user.id,
            'username': username,
            'email': user.email,
            'name': user.name,
            'bio': user.bio
        }), 200

    except ValueError:
        # Invalid token
        return jsonify({"message": "Invalid token."}), 400