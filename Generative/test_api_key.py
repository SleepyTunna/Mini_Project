import os
from dotenv import load_dotenv
from services.ai_service import AIService

# Load environment variables
load_dotenv()

print("Testing API key configuration...")
print(f"GOOGLE_GENAI_API_KEY in environment: {'GOOGLE_GENAI_API_KEY' in os.environ}")
if 'GOOGLE_GENAI_API_KEY' in os.environ:
    key = os.environ['GOOGLE_GENAI_API_KEY']
    print(f"API Key length: {len(key)}")
    print(f"API Key starts with: {key[:10]}...")
    print(f"API Key ends with: ...{key[-10:]}")

print("\nInitializing AI Service...")
ai_service = AIService()
print(f"Google GenAI available: {ai_service.fallback_apis['google_genai']}")

# Test a simple AI call
if ai_service.fallback_apis['google_genai']:
    print("\nTesting simple AI call...")
    try:
        # Simple test prompt
        test_prompt = "What is 2+2?"
        response = ai_service._generate_with_fallback_ai(test_prompt)
        if response:
            print("✅ AI call successful!")
            print(f"Response: {response[:100]}...")
        else:
            print("❌ AI call failed - empty response")
    except Exception as e:
        print(f"❌ AI call failed with error: {e}")
else:
    print("❌ Google GenAI not available")