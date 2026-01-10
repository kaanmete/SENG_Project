from flask import Blueprint, request, jsonify

exam_bp = Blueprint('exam', __name__)

@exam_bp.route('/start', methods=['POST'])
def start_exam():
    return jsonify({
        "status": "success",
        "message": "Exam started successfully.",
        "exam_id": "EX-2024-001",
        "level": "A1-Beginner"
    }), 200

@exam_bp.route('/questions', methods=['GET'])
def get_questions():
    dummy_questions = [
        {"id": 1, "text": "What is the past tense of 'go'?", "options": ["goed", "went", "gone"], "type": "multiple_choice"},
        {"id": 2, "text": "She _____ to school every day.", "options": ["go", "goes", "going"], "type": "fill_in_blank"}
    ]
    return jsonify({
        "status": "success",
        "count": len(dummy_questions),
        "questions": dummy_questions
    }), 200

@exam_bp.route('/submit', methods=['POST'])
def submit_answer():
    data = request.json
    question_id = data.get('question_id')
    user_answer = data.get('answer')
    
    return jsonify({
        "status": "success",
        "message": "Answer submitted.",
        "question_id": question_id,
        "is_correct": True
    }), 200