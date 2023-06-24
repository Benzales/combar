from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
from flask_cors import CORS
from .config import Config
from .auth import load_logged_in_user

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    
    from .routes.urls import urls
    from .routes.users import users, groups
    from .routes.comments import comments, replies

    app.register_blueprint(urls)
    app.register_blueprint(users)
    app.register_blueprint(groups)
    app.register_blueprint(comments)
    app.register_blueprint(replies)

    CORS(app, resources={r'/api/*': {'origins': '*'}})

    app.before_request(load_logged_in_user)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
