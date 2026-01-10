from flask import Blueprint, request, jsonify

hint_bp = Blueprint('hint', __name__)

@hint_bp.route('/get', methods=['POST'])
def get_hint():
    data = request.json
    question_id = data.get('question_id')
    
    return jsonify({
        "status": "success",
        "question_id": question_id,
        "hint_text": "Pay attention to the time expressions in the sentence (e.g., 'yesterday', 'now').",
        "cost": 5,
        "remaining_points": 95
    }), 200

@hint_bp.route('/status', methods=['GET'])
def check_hint_status():
    return jsonify({
        "status": "success",
        "hints_remaining": 3,
        "total_hints_allowed": 5,
        "message": "You can use 3 more hints."
    }), 200