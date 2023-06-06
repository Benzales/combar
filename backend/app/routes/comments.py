from flask import Blueprint, request, jsonify, g
from app.models import Comment, Url, User
from app import db
from urllib.parse import unquote
from bs4 import BeautifulSoup
import requests
from urllib.parse import unquote, urldefrag

comments = Blueprint('comments', __name__)


@comments.route('/api/comments', methods=['POST'])
def create_comment():
    data = request.get_json()
    url_string = data['url']
    url_without_fragment, _ = urldefrag(unquote(url_string))

    # Check if the URL already exists in the database
    url_record = Url.query.filter_by(url=url_without_fragment).first()

    # If the URL does not exist, create a new Url record
    if url_record is None:
        url_record = Url(url=url_without_fragment)
        db.session.add(url_record)
        db.session.commit()

    # Set to anonymous user if not logged in
    user_id = 1
    if g.user_id is not None:
        user_id = g.user_id

    # Create a new comment record and associate it with the Url record
    new_comment = Comment(
        url_id=url_record.id,
        user_id = user_id,
        path_to_common_ancestor=data['pathToCommonAncestor'],
        start_offset=data['startOffset'],
        end_offset=data['endOffset'],
        comment_text=data['commentText'],
        selected_text=data['selectedText'],
    )

    db.session.add(new_comment)
    db.session.commit()

    return jsonify({"message": "Comment added successfully"}), 201

@comments.route('/api/urls/<path:url_string>/comments', methods=['GET'])
def get_comments_by_url(url_string):
    url_without_fragment, _ = urldefrag(url_string)
    url_record = Url.query.filter_by(url=url_without_fragment).first()

    response = []

    if url_record is not None:
        comments = url_record.comments

        for comment in comments:

            user_record = User.query.filter_by(id=comment.user_id).first()

            response.append({
                'username': user_record.username,
                'url': url_record.url,
                'pathToCommonAncestor': comment.path_to_common_ancestor,
                'startOffset': comment.start_offset,
                'endOffset': comment.end_offset,
                'commentText': comment.comment_text,
                'selectedText': comment.selected_text,
            })

    return jsonify(response), 200