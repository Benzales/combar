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
    
    from app.routes import api_bp
    app.register_blueprint(api_bp)

    CORS(app)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
