import sys
import os
import uvicorn

if __name__ == "__main__":
    # Add backend directory to sys.path so 'app' module can be found
    backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
    sys.path.insert(0, backend_dir)

    # Use the PORT environment variable provided by Railway, default to 3000
    port = int(os.environ.get("PORT", 3000))
    
    print(f"Starting server on port {port}...")
    print(f"Backend directory added to path: {backend_dir}")

    # Import the app (must be after path fix)
    try:
        from app.main import app
        # Start Uvicorn
        uvicorn.run(app, host="0.0.0.0", port=port)
    except Exception as e:
        print("Failed to start application:")
        import traceback
        traceback.print_exc()
        sys.exit(1)
