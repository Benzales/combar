from flask import Blueprint, request, jsonify, g
from app.models import Comment, Url, User, Reply
from app import db
from urllib.parse import unquote
from bs4 import BeautifulSoup
import requests
from urllib.parse import unquote, urldefrag

comments = Blueprint('comments', __name__)
replies = Blueprint('replies', __name__)

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

            comment_user_record = User.query.filter_by(id=comment.user_id).first()

            replies = []
            for reply in comment.replies:
                reply_user_record = User.query.filter_by(id=reply.user_id).first()
                replies.append({
                    'username': reply_user_record.username,
                    'replyText': reply.reply_text,
                    'votes': reply.vote,
                    'id': reply.id,
                })

            response.append({
                'id': comment.id,
                'username': comment_user_record.username,
                'url': url_record.url,
                'pathToCommonAncestor': comment.path_to_common_ancestor,
                'startOffset': comment.start_offset,
                'endOffset': comment.end_offset,
                'commentText': comment.comment_text,
                'selectedText': comment.selected_text,
                'replies': replies,
                'votes': comment.vote,
            })

    return jsonify(response), 200

def vote(comment, data):
    if 'vote' not in data:
        return jsonify({'message': 'Bad Request'}), 400

    vote_value = data['vote']
    if vote_value not in [-1, 1]:
        return jsonify({'message': 'Invalid vote value'}), 400
    comment.vote += vote_value
    db.session.commit()

    return jsonify({'message': 'Vote updated successfully', 'vote': comment.vote})

@comments.route('/api/comments/<int:comment_id>/vote', methods=['POST'])
def vote_comment(comment_id):
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({'message': 'Comment not found'}), 404
    
    data = request.get_json()
    return vote(comment, data)

@replies.route('/api/replies/<int:reply_id>/vote', methods=['POST'])
def vote_reply(reply_id):
    reply = Reply.query.get(reply_id)
    if not reply:
        return jsonify({'message': 'Comment not found'}), 404
    
    data = request.get_json()
    return vote(reply, data)

@replies.route('/api/comments/<int:comment_id>/replies', methods=['POST'])
def create_reply(comment_id):
    data = request.get_json()

    # Set to anonymous user if not logged in
    user_id = 1
    if g.user_id is not None:
        user_id = g.user_id

    # Create a new reply record and associate it with the Comment record
    new_reply = Reply(
        comment_id=comment_id,
        user_id = user_id,
        reply_text=data['replyText'],
    )

    db.session.add(new_reply)
    db.session.commit()

    return jsonify({"message": "Reply added successfully"}), 201