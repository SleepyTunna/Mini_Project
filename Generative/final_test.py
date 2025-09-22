import requests
import json

def test_career_analysis():
    """Test the career analysis endpoint with different skill sets"""
    print("Testing career analysis endpoint...")
    
    # Test the analyze endpoint
    url = "http://localhost:8000/analyze"
    
    # Test cases
    test_cases = [
        {
            "skills": "Web Development",
            "expertise": "Beginner",
            "description": "Beginner Web Developer"
        },
        {
            "skills": "Data Science",
            "expertise": "Intermediate",
            "description": "Intermediate Data Scientist"
        },
        {
            "skills": "Mobile Development",
            "expertise": "Advanced",
            "description": "Advanced Mobile Developer"
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n--- Test Case {i}: {test_case['description']} ---")
        
        try:
            print(f"Sending request with skills: {test_case['skills']}, expertise: {test_case['expertise']}")
            response = requests.post(url, json=test_case)
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Success!")
                print(f"  Career Paths: {len(data.get('career_paths', []))}")
                print(f"  Roadmap Steps: {len(data.get('roadmap', []))}")
                print(f"  Courses: {len(data.get('courses', []))}")
                print(f"  Certifications: {len(data.get('certifications', []))}")
                
                # Check if the response is personalized
                if data.get('roadmap'):
                    first_step = data['roadmap'][0]
                    if test_case['skills'].lower() in first_step.get('description', '').lower():
                        print("✅ Response is personalized to user's skills")
                    else:
                        print("⚠️ Response may not be fully personalized")
                
            else:
                print(f"❌ Error: {response.status_code}")
                print(response.text)
                
        except Exception as e:
            print(f"❌ Exception occurred: {e}")

def test_health_check():
    """Test the health check endpoint"""
    print("\n--- Testing Health Check ---")
    
    url = "http://localhost:8000/health"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print("✅ Health check passed")
            print(response.json())
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check exception: {e}")

if __name__ == "__main__":
    test_health_check()
    test_career_analysis()
    print("\n🎉 All tests completed!")