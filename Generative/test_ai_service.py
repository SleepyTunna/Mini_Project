import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Test the exact same logic as in ai_service.py
GOOGLE_GENAI_AVAILABLE = False

try:
    import google.generativeai as genai_module
    GOOGLE_GENAI_AVAILABLE = True
    print("✅ Google Generative AI module imported successfully")
except ImportError as e:
    print("❌ Failed to import Google Generative AI:", e)
    # Create dummy module to prevent NameError
    class DummyGenai:
        @staticmethod
        def configure(*args, **kwargs):
            pass
        
        class GenerativeModel:
            def __init__(self, *args, **kwargs):
                pass
            
            def generate_content(self, *args, **kwargs):
                class DummyResponse:
                    def __init__(self):
                        self.text = ""
                return DummyResponse()
    
    genai_module = DummyGenai()

print("GOOGLE_GENAI_AVAILABLE:", GOOGLE_GENAI_AVAILABLE)

# Test API key
api_key = os.getenv('GOOGLE_GENAI_API_KEY', '')
print("API Key:", api_key)
print("API Key valid:", bool(api_key and api_key != 'your-google-genai-api-key'))

# Test initialization
if GOOGLE_GENAI_AVAILABLE and api_key and api_key != 'your-google-genai-api-key':
    try:
        genai_module.configure(api_key=api_key)
        model = genai_module.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Test message")
        print("✅ Google Generative AI initialized and working")
        print("Response:", response.text[:50] + "..." if len(response.text) > 50 else response.text)
    except Exception as e:
        print("❌ Error initializing Google Generative AI:", e)
else:
    print("❌ Google Generative AI not available or API key not set")