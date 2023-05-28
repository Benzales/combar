from flask import Blueprint, request, jsonify
from app.models import Comment, Url
from app import db
from urllib.parse import unquote
from bs4 import BeautifulSoup
import requests
from urllib.parse import unquote, urldefrag

urls = Blueprint('urls', __name__)

@urls.route('/api/urls', methods=['GET'])
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

