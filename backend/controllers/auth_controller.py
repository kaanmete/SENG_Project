from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    return jsonify({
        "status": "success",
        "message": "Login successful!",
        "token": "mock-token-12345",
        "user": {
            "id": 1,
            "username": data.get('username', 'TestUser')
        }
    }), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    return jsonify({
        "status": "success",
        "message": "Registration successful.",
        "email": data.get('email', 'unknown@test.com')
    }), 201

@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({
        "status": "success",
        "message": "Logged out successfully."
    }), 200