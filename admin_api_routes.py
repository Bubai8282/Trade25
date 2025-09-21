from flask import Blueprint, jsonify

admin_api = Blueprint('admin_api', __name__, url_prefix='/admin/api')

@admin_api.route('/dashboard-data', methods=['GET'])
def dashboard_data():
    # Dummy data for dashboard
    return jsonify({
        'data': {
            'stats': {
                'total_users': 1000,
                'free_users': 600,
                'medium_users': 300,
                'pro_users': 100
            }
        }
    })

@admin_api.route('/users', methods=['GET'])
def users():
    # Dummy user list
    return jsonify({
        'users': [
            {'id': 1, 'name': 'Alice', 'email': 'alice@example.com'},
            {'id': 2, 'name': 'Bob', 'email': 'bob@example.com'}
        ]
    })

@admin_api.route('/subscription-requests', methods=['GET'])
def subscription_requests():
    # Dummy subscription requests
    return jsonify({
        'requests': []
    })


@admin_api.route('/recent-screenings', methods=['GET'])
def recent_screenings():
    # Dummy screenings
    return jsonify({
        'screenings': [
            {'id': 1, 'name': 'Tech Growth', 'results_count': 10, 'created_at': '2025-09-20'},
            {'id': 2, 'name': 'Value Picks', 'results_count': 5, 'created_at': '2025-09-19'}
        ]
    })
