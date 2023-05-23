from flask import Blueprint, request, jsonify
from app.models import Comment, Url
from app import db
from urllib.parse import unquote
from bs4 import BeautifulSoup
import requests
from urllib.parse import unquote, urldefrag

api_bp = Blueprint('api', __name__)

@api_bp.route('/api/urls', methods=['GET'])
def get_urls():
    urls = Url.query.all()
    urls_list = []

    for url in urls:
        url_dict = {
            "id": url.id,
            "url": url.url,
            "comments_count": len(url.comments),
        }

        # Fetch the webpage content
        try:
            response = requests.get(url.url, timeout=5)

            # Check the response status code to ensure the request was successful
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                # Attempt to extract the title of the webpage
                title = soup.title.string if soup.title else 'No title'
                url_dict['title'] = title
            else:
                url_dict['title'] = 'Failed to fetch title'
        except requests.RequestException:
            url_dict['title'] = 'Failed to fetch title'
        
        urls_list.append(url_dict)
    
    return jsonify(urls_list)

@api_bp.route('/api/comments', methods=['POST'])
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

    # Create a new comment record and associate it with the Url record
    new_comment = Comment(
        url_id=url_record.id,
        path_to_common_ancestor=data['pathToCommonAncestor'],
        start_offset=data['startOffset'],
        end_offset=data['endOffset'],
        comment_text=data['commentText'],
        selected_text=data['selectedText'],
    )

    db.session.add(new_comment)
    db.session.commit()

    return jsonify({"message": "Comment added successfully"}), 201

@api_bp.route('/api/urls/<path:url_string>/comments', methods=['GET'])
def get_comments_by_url(url_string):
    url_without_fragment, _ = urldefrag(url_string)
    url_record = Url.query.filter_by(url=url_without_fragment).first()

    response = []

    if url_record is not None:
        comments = url_record.comments
        response = [
            {
                'id': comment.id,
                'url': url_record.url,
                'pathToCommonAncestor': comment.path_to_common_ancestor,
                'startOffset': comment.start_offset,
                'endOffset': comment.end_offset,
                'commentText': comment.comment_text,
                'selectedText': comment.selected_text,
            }
            for comment in comments
        ]

    return jsonify(response), 200

# @api_bp.route('/api/users/<int:user_id>/comments', methods=['GET'])
# def get_comments_by_user(user_id):
#     user = User.query.get(user_id)

#     if user is None:
#         return jsonify({"error": "User not found"}), 404

#     comments = user.comments
#     response = [
#         {
#             'id': comment.id,
#             'url': comment.url.url,
#             'text': comment.text,
#             'paths': comment.paths,
#             'start_offset': comment.start_offset,
#             'end_offset': comment.end_offset,
#         }
#         for comment in comments
#     ]

#     return jsonify(response), 200