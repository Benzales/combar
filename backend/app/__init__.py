import click
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask.cli import with_appcontext
from dotenv import load_dotenv
from flask_cors import CORS
from .config import Config

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    
    from .routes.urls import urls
    from .routes.comments import comments
    from .routes.users import users

    app.register_blueprint(urls)
    app.register_blueprint(comments)
    app.register_blueprint(users)

    CORS(app, resources={r'/api/*': {'origins': '*'}})

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
