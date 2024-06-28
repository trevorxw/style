from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
import firebase_admin
from firebase_admin import credentials, storage

def create_app():
    load_dotenv()  # Load environment variables
    app = Flask(__name__)
    CORS(app)

    # Initialize Firebase
    cred = credentials.Certificate("fitpic-59ecb-firebase-adminsdk-he85m-ac5a8a7931.json")
    firebase_admin.initialize_app(cred, {
        'storageBucket': "fitpic-59ecb.appspot.com",
    })

    from .api.posts import posts_blueprint
    from .api.users import users_blueprint
    
    app.register_blueprint(posts_blueprint)
    app.register_blueprint(users_blueprint)

    return app