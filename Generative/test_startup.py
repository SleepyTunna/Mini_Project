# Test the exact startup process
import os
from dotenv import load_dotenv

# Load environment variables (same as main.py)
load_dotenv()

print("GOOGLE_GENAI_API_KEY from env:", os.getenv('GOOGLE_GENAI_API_KEY'))

# Import the settings (same as main.py)
from config.settings import settings

print("Settings loaded")

# Import the routes (same as main.py)
from routes import analyze, health, mock_test, auth, chat, update_skills, ai_search

print("Routes imported")

# Test AIService initialization
from services.ai_service import AIService
ai_service = AIService()
print("AIService initialized")

# Test a simple AI call
response = ai_service._generate_with_fallback_ai("Hello, world!")
print("AI response:", response[:100] + "..." if len(response) > 100 else response)