from flask import Blueprint, request, jsonify
from app.models import Selection, Url
from app import db
from urllib.parse import unquote

api_bp = Blueprint('api', __name__)

@api_bp.route('/api/selection', methods=['POST'])
def create_selection():
    data = request.get_json()
    url_string = data['url']

    # Check if the URL already exists in the database
    url_record = Url.query.filter_by(url=url_string).first()

    # If the URL does not exist, create a new Url record
    if url_record is None:
        url_record = Url(url=url_string)
        db.session.add(url_record)
        db.session.commit()

    # Create a new Selection record and associate it with the Url record
    new_selection = Selection(
        url_id=url_record.id,
        paths_to_text_node=data['pathsToTextNode'],
        start_offset=data['startOffset'],
        end_offset=data['endOffset'],
        comment_text=data['commentText'],
        selected_text=data['selectedText'],
    )

    db.session.add(new_selection)
    db.session.commit()

    return jsonify({"message": "Selection added successfully"}), 201

@api_bp.route('/api/urls/<path:url_string>/selections', methods=['GET'])
def get_selections_by_url(url_string):
    decoded_url = unquote(url_string)
    url_record = Url.query.filter_by(url=decoded_url).first()

    if url_record is not None:
        selections = url_record.selections
        response = [
            {
                'id': selection.id,
                'url': url_record.url,
                'pathsToTextNode': selection.paths_to_text_node,
                'startOffset': selection.start_offset,
                'endOffset': selection.end_offset,
                'commentText': selection.comment_text,
                'selectedText': selection.selected_text,
            }
            for selection in selections
        ]

    else: 
        response = []

    return jsonify(response), 200

# @api_bp.route('/api/users/<int:user_id>/selections', methods=['GET'])
# def get_selections_by_user(user_id):
#     user = User.query.get(user_id)

#     if user is None:
#         return jsonify({"error": "User not found"}), 404

#     selections = user.selections
#     response = [
#         {
#             'id': selection.id,
#             'url': selection.url.url,
#             'text': selection.text,
#             'paths': selection.paths,
#             'start_offset': selection.start_offset,
#             'end_offset': selection.end_offset,
#         }
#         for selection in selections
#     ]

#     return jsonify(response), 200