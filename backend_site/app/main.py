from fastapi import FastAPI
from .api.chat import router as chat_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "*"],  # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the chat API router
app.include_router(chat_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo AI Chatbot Backend!"}
