import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__)))

from services.ai_service import AIService

def test_ai_service():
    print("Testing AI Service...")
    ai_service = AIService()
    
    # Test with sample data
    skills = "Web Development"
    expertise = "Beginner"
    
    print(f"Testing with skills: {skills}, expertise: {expertise}")
    
    try:
        result = ai_service.generate_career_analysis(skills, expertise)
        print("AI Service Response:")
        print(result)
        return result
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    test_ai_service()