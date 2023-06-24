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
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'name': self.name,
            'bio': self.bio,
        }
        
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
    replies = db.relationship('Reply', backref='comment', lazy=True)
    vote = db.Column(db.Integer, nullable=False, default=0)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.user.username,
            'url': self.url.url,
            'pathToCommonAncestor': self.path_to_common_ancestor,
            'startOffset': self.start_offset,
            'endOffset': self.end_offset,
            'commentText': self.comment_text,
            'selectedText': self.selected_text,
            'replies': [reply.to_dict() for reply in self.replies],
            'vote': self.vote
        }

    def __repr__(self):
        return f'<Comment {self.id}>'

class Reply(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    comment_id = db.Column(db.Integer, db.ForeignKey('comment.id'), nullable=False)
    reply_text = db.Column(db.String, nullable=False)
    vote = db.Column(db.Integer, nullable=False, default=0)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.user.username,
            'replyText': self.reply_text,
            'votes': self.vote
        }

    def __repr__(self):
        return f'<Reply {self.id}>'
    
from sqlalchemy import Table, ForeignKey, DateTime
from sqlalchemy.orm import relationship

# this is an association table for many-to-many relation between Group and User
group_user = Table('group_user', db.Model.metadata,
    db.Column('group_id', db.Integer, ForeignKey('group.id')),
    db.Column('user_id', db.Integer, ForeignKey('user.id'))
)

# this is an association table for many-to-many relation between Group and Comment
group_comment = Table('group_comment', db.Model.metadata,
    db.Column('group_id', db.Integer, ForeignKey('group.id')),
    db.Column('comment_id', db.Integer, ForeignKey('comment.id'))
)

class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String(64), nullable=False)
    creation_date = db.Column(DateTime, default=db.func.current_timestamp())
    users = relationship('User', secondary=group_user, backref=db.backref('groups', lazy='dynamic'))
    comments = relationship('Comment', secondary=group_comment, backref=db.backref('groups', lazy='dynamic'))

    def to_dict(self):
        return {
            'id': self.id,
            'groupName': self.group_name,
            'members': [user.to_dict() for user in self.users],
            'comments': [comment.to_dict() for comment in self.comments]
        }