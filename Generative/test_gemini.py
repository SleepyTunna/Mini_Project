import os
import google.generativeai as genai

# Configure the API key
api_key = "AIzaSyAytoNZiRTkprioNLhFVd9sUmAkn-RVyMg"
genai.configure(api_key=api_key)

# Test the connection
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello, world!")
    print("Success! Gemini API is working.")
    print("Response:", response.text)
except Exception as e:
    print("Error connecting to Gemini API:", str(e))