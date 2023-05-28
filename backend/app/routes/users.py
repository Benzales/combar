from flask import Blueprint, request, jsonify
from app.models import User
from app import db
from urllib.parse import unquote
from bs4 import BeautifulSoup
import requests
from urllib.parse import unquote, urldefrag

users = Blueprint('users', __name__)

@users.route('/api/users', methods=['POST'])
def register():
    data = request.get_json()


    new_user = User(username=data['username'], 
                    email=data['email'],  
                    full_name=data['full_name'],
                    bio=data.get('bio'))

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'New user created!'}), 201

@users.route('/api/users/<string:id>', methods=['GET'])
def get_user(id):
    print()
    print()
    print(id)
    print()
    print()
    user = User.query.get(id)
    if user is None:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'username': user.username,
        'email': user.email,
        'full_name': user.full_name,
        'bio': user.bio
    }), 200
