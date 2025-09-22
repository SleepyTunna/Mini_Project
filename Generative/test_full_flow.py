import requests
import json

def test_full_flow():
    """Test the full flow from frontend to backend"""
    print("Testing full flow...")
    
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
        
        print(f"Status code: {response.status_code}")
        print(f"Response headers: {response.headers}")
        
        if response.status_code == 200:
            data = response.json()
            print("Success! Received response:")
            print(json.dumps(data, indent=2))
            return True
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"Exception occurred: {e}")
        return False

if __name__ == "__main__":
    test_full_flow()