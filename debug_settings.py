import sys
import os

# Change to backend directory to simulate execution context
os.chdir(os.path.join(os.getcwd(), 'backend'))
sys.path.insert(0, os.getcwd())

try:
    print("Attempting to load Settings...")
    from app.core.config import Settings
    settings = Settings()
    print("Settings loaded successfully!")
    print(settings.model_dump())
except Exception as e:
    print("\n!!! CONFIGURATION ERROR !!!")
    print(e)
    # If it's a Pydantic error, print details
    if hasattr(e, 'errors'):
        import json
        print(json.dumps(e.errors(), indent=2))
