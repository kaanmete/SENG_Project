import smtplib

# Kendi bilgilerinle doldur
EMAIL = "aidiagnosticengine@gmail.com"
PASS = "swoo jtwc upzd tdkn" 

try:
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(EMAIL, PASS)
    print("Giriş Başarılı! Bağlantı kurulabiliyor.")
    server.quit()
except Exception as e:
    print(f"Bağlantı Hatası: {e}")