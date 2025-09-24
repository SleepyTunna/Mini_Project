import requests
import time

# Test the backend API endpoints
def test_backend_api():
    base_url = "http://localhost:8000"
    
    print("Testing backend API endpoints...")
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        print(f"Health check: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")
    
    # Test career analysis endpoint
    try:
        payload = {
            "skills": "Python, JavaScript, React",
            "expertise": "Intermediate"
        }
        print(f"\nSending career analysis request with payload: {payload}")
        response = requests.post(f"{base_url}/analyze", json=payload)
        print(f"Career analysis: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  Career paths: {len(data.get('career_paths', []))}")
            print(f"  Roadmap steps: {len(data.get('roadmap', []))}")
            print(f"  Courses: {len(data.get('courses', []))}")
            print("✅ Career analysis working correctly!")
        else:
            print(f"  Error: {response.text}")
    except Exception as e:
        print(f"Career analysis failed: {e}")

if __name__ == "__main__":
    test_backend_api()