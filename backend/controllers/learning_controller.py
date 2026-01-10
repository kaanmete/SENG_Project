from flask import Blueprint, request, jsonify

learning_bp = Blueprint('learning', __name__)

@learning_bp.route('/materials', methods=['GET'])
def get_materials():
    materials = [
        {
            "id": 101,
            "title": "Present Continuous Tense Guide",
            "type": "pdf",
            "url": "/downloads/grammar_a1.pdf",
            "level": "A1"
        },
        {
            "id": 102,
            "title": "Common Verbs Vocabulary List",
            "type": "video",
            "url": "https://video-platform.com/v/12345",
            "level": "A1"
        }
    ]
    return jsonify({
        "status": "success",
        "count": len(materials),
        "materials": materials
    }), 200

@learning_bp.route('/progress', methods=['POST'])
def update_progress():
    data = request.json
    material_id = data.get('material_id')
    status = data.get('status')
    
    return jsonify({
        "status": "success",
        "message": f"Progress updated for material {material_id}",
        "current_status": status
    }), 200