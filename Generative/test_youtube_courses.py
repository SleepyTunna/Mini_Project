import requests
import json

def test_youtube_courses():
    """Test that courses are now linked to YouTube"""
    print("Testing YouTube course links...")
    
    # Test the analyze endpoint
    url = "http://localhost:8000/analyze"
    
    # Test data
    test_data = {
        "skills": "Web Development",
        "expertise": "Beginner"
    }
    
    try:
        print(f"Sending request to {url} with data: {test_data}")
        response = requests.post(url, json=test_data)
        
        if response.status_code == 200:
            data = response.json()
            print("Success! Received response:")
            
            # Check courses
            courses = data.get('courses', [])
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
            certifications = data.get('certifications', [])
            print(f"\nFound {len(certifications)} certifications:")
            
            for i, cert in enumerate(certifications, 1):
                print(f"  {i}. {cert['name']}")
                print(f"     Provider: {cert['provider']}")
                print(f"     URL: {cert['url']}")
                
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"Exception occurred: {e}")

if __name__ == "__main__":
    test_youtube_courses()