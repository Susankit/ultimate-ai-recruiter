from fastapi import FastAPI

app = FastAPI()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "message": "Hello World from FastAPI Backend Offline Node!"
    }