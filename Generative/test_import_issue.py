import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("GOOGLE_GENAI_API_KEY from env:", os.getenv('GOOGLE_GENAI_API_KEY'))

# Test the import logic step by step
print("\nTesting import logic...")

# Step 1: Try to import google.generativeai
try:
    import google.generativeai as genai_module
    print("✅ google.generativeai imported successfully")
    print("Module:", genai_module)
    
    # Test if we can configure it
    api_key = os.getenv('GOOGLE_GENAI_API_KEY')
    if api_key:
        try:
            genai_module.configure(api_key=api_key)
            print("✅ google.generativeai configured successfully")
            
            # Test if we can create a model
            model = genai_module.GenerativeModel('gemini-1.5-flash')
            print("✅ GenerativeModel created successfully")
        except Exception as e:
            print("❌ Error configuring google.generativeai:", e)
    else:
        print("❌ No API key found")
        
except ImportError as e:
    print("❌ Failed to import google.generativeai:", e)

# Step 2: Check the AIService import
try:
    from services.ai_service import AIService
    print("✅ AIService imported successfully")
    
    # Test initialization
    ai_service = AIService()
    print("✅ AIService initialized successfully")
    
except Exception as e:
    print("❌ Error with AIService:", e)
    import traceback
    traceback.print_exc()