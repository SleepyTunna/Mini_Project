import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__)))

from services.ai_service import AIService

def test_ai_service_courses():
    print("Testing AI Service course generation...")
    ai_service = AIService()
    
    # Test with sample data
    skills = "Web Development"
    expertise = "Beginner"
    
    print(f"Testing with skills: {skills}, expertise: {expertise}")
    
    try:
        result = ai_service._create_enhanced_fallback_response(skills, expertise)
        print("AI Service Response:")
        
        # Check courses
        courses = result.get('courses', [])
        print(f"\nFound {len(courses)} courses:")
        
        for i, course in enumerate(courses, 1):
            print(f"  {i}. {course['title']}")
            print(f"     Provider: {course['provider']}")
            print(f"     URL: {course['url']}")
            
            # Check if URL is a YouTube search link
            if 'youtube.com/results' in course['url']:
                print("     ✅ YouTube search link detected")
            else:
                print("     ❌ Not a YouTube link")
                
        # Check certifications
        certifications = result.get('certifications', [])
        print(f"\nFound {len(certifications)} certifications:")
        
        for i, cert in enumerate(certifications, 1):
            print(f"  {i}. {cert['name']}")
            print(f"     Provider: {cert['provider']}")
            print(f"     URL: {cert['url']}")
        
        return result
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    test_ai_service_courses()