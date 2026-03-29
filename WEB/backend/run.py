import os
import sys

# Change working directory to the backend directory
backend_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(backend_dir)
sys.path.insert(0, backend_dir)

print(f"Working directory: {os.getcwd()}")
print(f"Python path: {sys.path[0]}")

import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
