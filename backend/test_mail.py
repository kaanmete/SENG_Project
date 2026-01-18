import smtplib

EMAIL = "aidiagnosticengine@gmail.com"
PASS = "swoo jtwc upzd tdkn" 

try:
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(EMAIL, PASS)
    print("Login successful! Connection is being established.")
    server.quit()
except Exception as e:
    print(f"Connection Error: {e}")
