import os
from dotenv import load_dotenv

# Load environment variables first
load_dotenv()

print("Environment variables loaded")
print("GOOGLE_GENAI_API_KEY:", os.getenv('GOOGLE_GENAI_API_KEY'))

# Now try to import and test the skill extraction
try:
    from services.ai_service import AIService
    print("✅ AIService imported successfully")
    
    # Initialize the service
    ai_service = AIService()
    print("✅ AIService initialized successfully")
    
    # Test skill extraction
    test_message = "I just learned React hooks and Redux for state management, and I'm getting good at TypeScript"
    current_skills = "Python, JavaScript"
    
    result = ai_service.extract_skills_from_message(test_message, current_skills)
    print("✅ Skill extraction working")
    print("Extracted skills:", result["extracted_skills"])
    print("Updated skills:", result["updated_skills"])
    
except Exception as e:
    print("❌ Error:", e)
    import traceback
    traceback.print_exc()