from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config.from_object(Config)

db = SQLAlchemy(app)

@app.route('/')
def home():
    """
    Ana sayfa rotası.
    Uygulamanın çalıştığını test etmek için basit bir mesaj döndürür.
    """
    return "Proje başarıyla çalışıyor! Hoş geldiniz."

# Uygulamayı sadece bu dosya doğrudan çalıştırıldığında başlat
if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'])