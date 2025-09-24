import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Check if the API key is loaded
api_key = os.getenv('GOOGLE_GENAI_API_KEY')
print("API Key from env:", api_key)
print("API Key length:", len(api_key) if api_key else 0)
print("API Key starts with:", api_key[:10] if api_key else "None")