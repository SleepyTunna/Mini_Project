import requests
import json

def test_youtube_api():
    """Test the YouTube API to see the exact response format"""
    url = "https://abhi-api.vercel.app/api/search/yts?text=web+development"
    
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("Response structure:")
            print(json.dumps(data, indent=2))
            
            # Check if it has the expected structure
            if 'result' in data:
                print("\nFound 'result' key")
                if 'results' in data['result']:
                    print("Found 'results' array")
                    results = data['result']['results']
                    print(f"Number of results: {len(results)}")
                    if results:
                        print("First result structure:")
                        print(json.dumps(results[0], indent=2))
                else:
                    print("No 'results' array found in 'result'")
                    print("Result keys:", list(data['result'].keys()))
            else:
                print("No 'result' key found")
                print("Top level keys:", list(data.keys()))
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"Exception occurred: {e}")

if __name__ == "__main__":
    test_youtube_api()