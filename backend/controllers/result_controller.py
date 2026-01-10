from flask import Blueprint, request, jsonify

result_bp = Blueprint('result', __name__)

@result_bp.route('/<exam_id>', methods=['GET'])
def get_result(exam_id):
    return jsonify({
        "status": "success",
        "exam_id": exam_id,
        "score": 85,
        "total_questions": 20,
        "correct_answers": 17,
        "proficiency_level": "B1-Intermediate",
        "feedback": "Great job! You have a strong grasp of basic grammar."
    }), 200

@result_bp.route('/history/<user_id>', methods=['GET'])
def get_user_history(user_id):
    history = [
        {"date": "2024-01-10", "score": 85, "level": "B1"},
        {"date": "2023-12-25", "score": 70, "level": "A2"}
    ]
    return jsonify({
        "status": "success",
        "user_id": user_id,
        "history": history
    }), 200