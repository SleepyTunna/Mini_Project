import os
from dotenv import load_dotenv

# Load environment variables first
load_dotenv()

print("Environment variables loaded")
print("GOOGLE_GENAI_API_KEY:", os.getenv('GOOGLE_GENAI_API_KEY'))

# Now try to import and initialize the AI service
try:
    from services.ai_service import AIService
    print("✅ AIService imported successfully")
    
    # Initialize the service
    ai_service = AIService()
    print("✅ AIService initialized successfully")
    
    # Test a simple prompt
    response = ai_service._generate_with_fallback_ai("Hello, world!")
    print("✅ AI service working")
    print("Response:", response[:100] + "..." if len(response) > 100 else response)
    
except Exception as e:
    print("❌ Error:", e)
    import traceback
    traceback.print_exc()