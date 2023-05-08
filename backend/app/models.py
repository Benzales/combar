from app import db
from sqlalchemy.dialects.postgresql import JSON

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String, nullable=False, unique=True)
#     selections = db.relationship('Selection', backref='user', lazy=True)

#     def __repr__(self):
#         return f'<User {self.id}>'

class Url(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String, nullable=False, unique=True)
    selections = db.relationship('Selection', backref='url', lazy=True)

    def __repr__(self):
        return f'<Url {self.id}>'

class Selection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    url_id = db.Column(db.Integer, db.ForeignKey('url.id'), nullable=False)
    paths_to_text_node = db.Column(JSON, nullable=False)
    start_offset = db.Column(db.Integer, nullable=False)
    end_offset = db.Column(db.Integer, nullable=False)
    comment_text = db.Column(db.String, nullable=False)
    selected_text = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'<Selection {self.id}>'
