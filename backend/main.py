from fastapi import FastAPI
from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv
from .api.chat import router as chat_router
from .utils.logging import setup_logging

# Load environment variables
load_dotenv()

# Setup logging
setup_logging()

class Settings(BaseSettings):
    debug: bool = False
    openai_api_key: str = ""
    database_url: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
app = FastAPI(title="Todo AI Chatbot Backend", version="1.0.0")

# Include the chat API router
app.include_router(chat_router)

@app.get("/")
def read_root():
    return {"message": "Todo AI Chatbot Backend is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Todo AI Chatbot Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)