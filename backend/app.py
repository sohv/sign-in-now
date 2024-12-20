from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv

# load environment variables from .env file
load_dotenv()

# flask app configuration
app = Flask(__name__)
CORS(app) # cors for cross-origin requests

# to configure database URI using environment variables from the .env file
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# initialize SQLAlchemy
db = SQLAlchemy(app)

# define model for the database table
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f'<User {self.name}>'

# test API endpoint
@app.route('/api', methods=['GET'])
def api():
    return jsonify({"message": "API is working"})

# endpoint for user registration
@app.route('/api/users', methods=['POST'])
def register_user():
    data = request.get_json()

    # extract data from the request
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # check if the user already exists
    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({'message': 'User already exists'}), 400

    hashed_password = generate_password_hash(password)  # hashing the password
    new_user = User(name=name, email=email, password=hashed_password)

    # add the new user to the database and commit the transaction
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

# endpoint for login
@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # check if the user exists through email
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    if not check_password_hash(user.password, password):  # hash comparison for security
        return jsonify({'message': 'Incorrect password'}), 401

    return jsonify({'message': 'Login successful'}), 200

if __name__ == '__main__':
    app.run(debug=True)

# comments are meant for my understanding and better readability