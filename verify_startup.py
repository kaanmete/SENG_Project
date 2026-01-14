import sys
import os

# Simulate Procfile: cd backend
os.chdir(os.path.join(os.getcwd(), 'backend'))
sys.path.insert(0, os.getcwd())

print(f"Working Directory: {os.getcwd()}")
print("Simulating Uvicorn startup (import app.main:app)...")

try:
    import app.main
    print("SUCCESS: app.main imported.")
    print(f"App Title: {app.main.app.title}")
except Exception as e:
    print("\n!!! STARTUP CRASH !!!")
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
