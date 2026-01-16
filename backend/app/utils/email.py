import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
 
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
 
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
MAIL_FROM = os.getenv("MAIL_FROM", SMTP_USER)
 
def send_verification_email(to_email: str, token: str) -> None:
    if not all([SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM]):
        raise RuntimeError("SMTP config missing. Check SMTP_HOST/PORT/USER/PASS/MAIL_FROM in .env")
 
    verify_url = f"{FRONTEND_URL}/verify-email?token={token}"
 
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Verify your email"
    msg["From"] = MAIL_FROM
    msg["To"] = to_email
 
    text = f"Verify your email: {verify_url}"
    html = f"""
<html>
<body>
<p>Hi! 👋</p>
<p>Please verify your email by clicking the link below:</p>
<p><a href="{verify_url}">Verify Email</a></p>
<p>If you didn’t request this, ignore this email.</p>
</body>
</html>
    """
 
    msg.attach(MIMEText(text, "plain", "utf-8"))
    msg.attach(MIMEText(html, "html", "utf-8"))
 
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(MAIL_FROM, [to_email], msg.as_string())