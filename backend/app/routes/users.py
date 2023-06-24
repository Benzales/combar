from flask import Blueprint, request, jsonify, abort, g
from app.models import User, Group
from app import db
import requests
from google.oauth2 import id_token
from google.auth.transport import requests
from sqlalchemy import inspect
from sqlalchemy.exc import IntegrityError
import re
from app.auth import create_token, create_refresh_token, refresh_token

users = Blueprint('users', __name__)

@users.route('/api/users', methods=['GET'])
def get_user():
    if g.user_id is None:
        abort(401, 'Invalid token or token expired')
    
    user = User.query.get(g.user_id)
    if user is None:
        return jsonify({'message': 'User not found'}), 404

    return jsonify(user.to_dict()), 200

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

        user = User.query.filter_by(google_id=idinfo['sub']).first()

        # If user does not exist, create a new user
        if not user:
            # Generate the username from the email
            username = idinfo['email'].split('@')[0][:11]
            count = 0

            # Check if this username already exists
            while User.query.filter_by(username=username).first():
                count += 1
                username = f"{username}{count}"

            user = User(
                username=username,
                email=idinfo['email'],  
                name=idinfo['name'],
                google_id=idinfo['sub'],
                bio=""
            )
            db.session.add(user)
            db.session.commit()
    
        jwt_token = create_token(user.id)
        refresh_token = create_refresh_token(user.id)

        response = user.to_dict()
        response.update({
            'accesToken': jwt_token,
            'refreshToken': refresh_token
        })

        return jsonify(response), 200

    except ValueError:
        # Invalid token
        return jsonify({"message": "Invalid token."}), 400
    
@users.route('/api/users', methods=['PUT'])
def update_user():
    if g.user_id is None:
        abort(401, 'Invalid token or token expired')

    data = request.get_json()

    # Ensure all required fields are present
    if not all(k in data for k in ("username", "email")):
        return jsonify({"message": "Missing required field"}), 400

    email = data.get('email')
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"message": "Invalid email format"}), 400

    user = User.query.get(g.user_id)
    
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

@users.route('/api/users/refresh', methods=['POST'])
def refresh():
    token = request.headers.get('Authorization')
    return refresh_token(token)

groups = Blueprint('groups', __name__)

# Get all groups
@groups.route('/api/groups', methods=['GET'])
def get_groups():
    groups = Group.query.all()
    return jsonify([group.to_dict() for group in groups]), 200

# Get a group by id
@groups.route('/api/groups/<int:id>', methods=['GET'])
def get_group(id):
    group = Group.query.get(id)
    if group is None:
        return jsonify({'message': 'Group not found'}), 404

    return jsonify(group.to_dict()), 200

# Create a new group
@groups.route('/api/groups', methods=['POST'])
def create_group():
    data = request.get_json()
    group_name = data.get('groupName')

    group = Group(group_name=group_name)

    db.session.add(group)
    db.session.commit()

    return jsonify(group.to_dict()), 201

# Update a group
@groups.route('/api/groups/<int:id>', methods=['PUT'])
def update_group(id):
    group = Group.query.get(id)
    if group is None:
        return jsonify({'message': 'Group not found'}), 404

    data = request.get_json()
    group_name = data.get('group_name')

    group.group_name = group_name

    db.session.commit()

    return jsonify(group.to_dict()), 200

# Delete a group
@groups.route('/api/groups/<int:id>', methods=['DELETE'])
def delete_group(id):
    group = Group.query.get(id)
    if group is None:
        return jsonify({'message': 'Group not found'}), 404

    db.session.delete(group)
    db.session.commit()

    return jsonify({'message': 'Group deleted'}), 200

# Add users to a group
@groups.route('/api/groups/<string:id>/users', methods=['POST'])
def add_users_to_group(id):
    data = request.get_json()
    usernames = data.get('usernames')

    group = Group.query.get(id)
    if group is None:
        return jsonify({'message': 'Group not found'}), 404

    for username in usernames:
        user = User.query.filter_by(username=username).first()
        if user is None:
            return jsonify({'message': f'User {username} not found'}), 404
        group.users.append(user)

    db.session.commit()

    return jsonify(group.to_dict()), 200
