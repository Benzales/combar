from flask import Blueprint, request, jsonify
from app.models import Selection
from app import db
from urllib.parse import unquote

api_bp = Blueprint('api', __name__)

@api_bp.route('/api/selection', methods=['POST'])
def create_selection():
    data = request.get_json()

    new_selection = Selection(
        url=data['url'],
        text=data['text'],
        paths=data['paths'],
        start_offset=data['startOffset'],
        end_offset=data['endOffset']
    )

    print(new_selection)

    db.session.add(new_selection)
    db.session.commit()
    print(f'Added new selection: {new_selection}')

    return jsonify({"message": "Selection data added successfully"}), 201

@api_bp.route('/api/urls/<path:url_string>/selections', methods=['GET'])
def get_selections_by_url(url_string):
    decoded_url = unquote(url_string)
    url_record = Url.query.filter_by(url=decoded_url).first()

    if url_record is None:
        return jsonify({"error": "URL not found"}), 404

    selections = url_record.selections
    response = [
        {
            'id': selection.id,
            'url': url_record.url,
            'text': selection.text,
            'paths': selection.paths,
            'start_offset': selection.start_offset,
            'end_offset': selection.end_offset,
        }
        for selection in selections
    ]

    return jsonify(response), 200

@api_bp.route('/api/users/<int:user_id>/selections', methods=['GET'])
def get_selections_by_user(user_id):
    user = User.query.get(user_id)

    if user is None:
        return jsonify({"error": "User not found"}), 404

    selections = user.selections
    response = [
        {
            'id': selection.id,
            'url': selection.url.url,
            'text': selection.text,
            'paths': selection.paths,
            'start_offset': selection.start_offset,
            'end_offset': selection.end_offset,
        }
        for selection in selections
    ]

    return jsonify(response), 200