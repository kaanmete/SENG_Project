import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("❌ API Key yok!")
    exit()

client = genai.Client(api_key=API_KEY)

print("🔍 Modeller Listeleniyor...\n")

try:
    # Basitçe tüm modelleri dön ve sadece ID'lerini yaz
    for model in client.models.list():
        # Model nesnesinin kendisini değil, direkt name özelliğini yazdıralım
        print(f"📦 Model: {model.name}")
            
except Exception as e:
    print(f"❌ Hata detayları: {e}")