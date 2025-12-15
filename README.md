# SENG_Project
This project is consist of two parts; frontend programming and backend programming. Backend side of this project will be written with Python 3.12.10 version.
Frontend side of this project will be written with HTML5, CSS3 and Javascript.
Purpose of this system is to provide a unified, web-based platform that simplifies English proficiency assessment for Users.


---

## 📁 Project Structure

```bash
LevelAssessment_AI_Engine/
│
├── backend/                              # Python 3.12.10 Backend
│   ├── app.py                            # Uygulama giriş noktası (Flask/FastAPI)
│   ├── config.py                         # DB bağlantısı ve API Key ayarları
│   ├── requirements.txt                  # Bağımlılıklar (openai, sqlalchemy, flask vb.)
│   │
│   ├── controllers/                      # [Class Diagram: Controllers]
│   │   ├── __init__.py
│   │   ├── auth_controller.py            # Login, Register, Verify Email (UC-01, UC-04, UC-05)
│   │   ├── learning_controller.py        # Learning Purpose, Study Plan (UC-02, UC-18)
│   │   ├── exam_controller.py            # Start Exam, Submit Answer, Hints (UC-03, UC-06, UC-08~14)
│   │   ├── result_controller.py          # View Results, Feedback (UC-07, UC-19~21)
│   │   └── admin_controller.py           # System Health, User Mgmt (UC-22)
│   │
│   ├── services/                         # [Class Diagram: Services - İş Mantığı]
│   │   ├── __init__.py
│   │   ├── user_profile_service.py       # Kullanıcı profili ve amacı yönetimi
│   │   ├── exam_service.py               # Adaptive algoritma (FR-06) ve Sınav oturum yönetimi
│   │   ├── hint_service.py               # İpucu üretimi mantığı (UC-06)
│   │   ├── reporting_service.py          # CEFR hesaplama ve rapor oluşturma (UC-25)
│   │   ├── admin_service.py              # Sistem metrikleri ve admin işlemleri
│   │   └── ai_engine_service.py          # [External Module] OpenAI/LLM entegrasyonu (FR-09, FR-14, FR-15)
│   │
│   ├── repositories/                     # [Class Diagram: Repositories - Veritabanı]
│   │   ├── __init__.py
│   │   ├── user_repository.py            # User tablosu işlemleri
│   │   ├── question_repository.py        # Soru havuzu ve dinamik soru yönetimi
│   │   ├── response_repository.py        # Kullanıcı cevaplarını kaydetme
│   │   ├── result_repository.py          # Sonuç ve rapor saklama
│   │   └── system_metrics_repo.py        # Admin paneli için loglar
│   │
│   ├── models/                           # [Class Diagram: Domain Entities]
│   │   ├── user.py                       # User, Administrator sınıfları
│   │   ├── question.py                   # Question, QuestionType (Enum)
│   │   ├── response.py                   # UserResponse (Cevaplar)
│   │   └── report.py                     # ResultReport, StudyPlan, CEFRLevel
│   │
│   └── utils/                            # Yardımcı Araçlar
│       ├── jwt_handler.py                # Token doğrulama (FR-03)
│       ├── email_sender.py               # Email doğrulama servisi (FR-02)
│       └── validators.py                 # Input doğrulama
│
├── frontend/                             # HTML5, CSS3, JS Frontend
│   ├── index.html                        # Landing Page
│   │
│   ├── pages/                            # Sayfalar (Use Case bazlı ayrım)
│   │   ├── auth/
│   │   │   ├── login.html                # (UC-01)
│   │   │   ├── register.html             # (UC-01)
│   │   │   ├── verify_email.html         # (UC-05)
│   │   │   └── reset_password.html       # (UC-04)
│   │   │
│   │   ├── dashboard/
│   │   │   ├── user_home.html            # İlerleme grafikleri (UC-15)
│   │   │   ├── learning_purpose.html     # Amaç belirleme (UC-02)
│   │   │   └── study_plan.html           # Kişisel çalışma planı (UC-18)
│   │   │
│   │   ├── exam/
│   │   │   ├── exam_setup.html           # Sınav tipi seçimi (Reading, Grammar vs.)
│   │   │   ├── exam_room.html            # Ana sınav ekranı (UC-03, UC-26 Timer burada)
│   │   │   └── result_view.html          # Sonuç ve Feedback ekranı (UC-07)
│   │   │
│   │   └── admin/
│   │       ├── system_health.html        # Server load, uptime (UC-22)
│   │       └── user_management.html      # Kullanıcı rolleri düzenleme (UC-22)
│   │
│   ├── css/
│   │   ├── main.css                      # Genel stiller
│   │   ├── dashboard.css                 # Dashboard grid yapısı
│   │   ├── exam.css                      # Sınav arayüzü ve split-screen (Reading için)
│   │   └── responsive.css                # Mobil uyumluluk
│   │
│   └── js/
│       ├── config.js                     # API Base URL
│       ├── api_client.js                 # Backend ile fetch işlemleri (Merkezi yapı)
│       ├── auth_logic.js                 # Login/Register mantığı
│       ├── dashboard_logic.js            # Grafikler (Chart.js entegrasyonu)
│       │
│       └── exam_modules/                 # Sınav Mantığı (Modüler Yapı)
│           ├── exam_manager.js           # Sınav başlatma/bitirme, Timer (UC-26)
│           ├── question_renderer.js      # Soru tipine göre HTML üretme (Reading vs Grammar)
│           ├── adaptive_engine.js        # Frontend tarafı zorluk takibi (Opsiyonel)
│           ├── hint_handler.js           # İpucu butonu işlevleri (UC-06)
│           └── audio_recorder.js         # Speaking sınavı için ses kaydı (FR-14)
│
└── database/
    └── schema.sql                        # PostgreSQL tablo oluşturma scriptleri
```
---
