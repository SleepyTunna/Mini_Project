import requests
import json

def test_analyze_endpoint():
    url = "http://localhost:8000/analyze"
    payload = {
        "skills": "python",
        "expertise": "beginner"
    }
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print(f"Sending request to {url}")
        print(f"Payload: {payload}")
        
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {response.headers}")
        
        if response.status_code == 200:
            data = response.json()
            print("Success! Response data:")
            print(json.dumps(data, indent=2))
        else:
            print(f"Error: {response.status_code}")
            print(f"Response text: {response.text}")
            
    except Exception as e:
        print(f"Exception occurred: {e}")
        print(f"Exception type: {type(e)}")

if __name__ == "__main__":
    test_analyze_endpoint()