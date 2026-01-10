from flask import Flask
# Yazdığımız controller'ı sisteme dahil ediyoruz
from controllers.admin_controller import admin_bp

app = Flask(__name__)

# Admin panelini aktif ediyoruz
app.register_blueprint(admin_bp)

@app.route('/')
def home():
    return "Level Assessment AI Engine API is Running! (Irem's PC)"

if __name__ == '__main__':
    app.run(debug=True, port=5000)