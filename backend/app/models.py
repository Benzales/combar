from app import db
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy_utils import EmailType

followers = db.Table('followers',
    db.Column('follower_id', db.Integer, db.ForeignKey('user.id')),
    db.Column('followed_id', db.Integer, db.ForeignKey('user.id'))
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(50), unique=True)
    username = db.Column(db.String(16), unique=True)
    email = db.Column(EmailType, nullable=False, unique=True)
    name = db.Column(db.String(64))
    registration_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    last_active = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    bio = db.Column(db.String(500))
    profile_picture = db.Column(db.String(200))  # URL or path to the image file
    comments = db.relationship('Comment', backref='user', lazy=True)
    
    followed = db.relationship(
        'User', secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref=db.backref('followers', lazy='dynamic'), lazy='dynamic')
        
    def follow(self, user):
        if not self.is_following(user):
            self.followed.append(user)
            
    def unfollow(self, user):
        if self.is_following(user):
            self.followed.remove(user)
            
    def is_following(self, user):
        return self.followed.filter(followers.c.followed_id == user.id).count() > 0
            
    def followed_posts(self):
        return Comment.query.join(
            followers, (followers.c.followed_id == Comment.user_id)).filter(
                followers.c.follower_id == self.id).order_by(
                    Comment.timestamp.desc())


class Url(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String, nullable=False, unique=True)
    comments = db.relationship('Comment', backref='url', lazy=True)

    def __repr__(self):
        return f'<Url {self.id}>'

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    url_id = db.Column(db.Integer, db.ForeignKey('url.id'), nullable=False)
    path_to_common_ancestor = db.Column(JSON, nullable=False)
    start_offset = db.Column(db.Integer, nullable=False)
    end_offset = db.Column(db.Integer, nullable=False)
    comment_text = db.Column(db.String, nullable=False)
    selected_text = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'<Comment {self.id}>'
