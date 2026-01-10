from flask import Blueprint, request, jsonify

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/dashboard', methods=['GET'])
def access_admin_dashboard():
    return jsonify({
        "message": "Welcome to Admin Dashboard",
        "modules": ["User Management", "System Health", "Reports"]
    }), 200

@admin_bp.route('/health', methods=['GET'])
def view_system_health():
    mock_metrics = {
        "status": "Operational",
        "uptime": "99.9%",
        "active_sessions": 12,
        "server_load": "15%"
    }
    return jsonify(mock_metrics), 200

@admin_bp.route('/users/role', methods=['PUT'])
def update_user_role():
    data = request.json
    user_id = data.get('user_id')
    new_role = data.get('new_role')
    return jsonify({
        "message": f"User {user_id} role updated to {new_role}",
        "status": "success"
    }), 200
