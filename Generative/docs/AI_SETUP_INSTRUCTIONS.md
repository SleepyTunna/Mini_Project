# AI Service Setup Instructions

This document provides detailed instructions on how to configure AI services for the Career Compass application.

## Prerequisites

Before you begin, you'll need:
1. A Google Cloud Platform account
2. A Google Generative AI (Gemini) API key
3. Optionally, API keys for other AI services (Hugging Face, Groq, etc.)

## Step 1: Get Your Google Generative AI API Key

1. Go to the [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click on "Get API key" in the sidebar
4. Create a new API key or use an existing one
5. Copy the API key - you'll need it in the next step

## Step 2: Configure Your Environment Variables

1. In the project root directory, locate the `.env.example` file
2. Rename it to `.env` (or create a new file named `.env` if it doesn't exist)
3. Update the file with your actual API keys:

```env
# Google Generative AI (Gemini) - Required for AI features
GOOGLE_GENAI_API_KEY=your_actual_google_gemini_api_key_here

# Google Cloud Configuration (Optional - for advanced features)
GOOGLE_CLOUD_PROJECT=your-project-id

# Authentication
SECRET_KEY=your-secret-key-here-generate-a-strong-random-key

# Development Settings
DEBUG=true
LOG_LEVEL=INFO

# API Configuration
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Optional: Other AI Service API Keys (for fallback)
# HUGGINGFACE_API_KEY=your_huggingface_api_key
# GROQ_API_KEY=your_groq_api_key
# OPENAI_FREE_API_URL=your_openai_compatible_api_url
# OPENAI_FREE_API_KEY=your_openai_compatible_api_key

# YouTube API Configuration
YOUTUBE_API_KEY=your_youtube_api_key_here
```

4. Replace `your_actual_google_gemini_api_key_here` with your actual API key from Step 1

## Step 3: Restart the Application

After updating the `.env` file:

1. Stop the currently running backend server (if it's running)
2. Start the backend server again:
   ```bash
   cd Generative
   python main.py
   ```

3. If you're running the frontend, restart it as well:
   ```bash
   cd frontend
   npm start
   ```

## Verification

To verify that the AI services are properly configured:

1. Open the application in your browser
2. Navigate to the career analysis or roadmap section
3. Enter your skills and expertise level
4. The application should now generate personalized AI-powered content instead of showing static fallback data

## Troubleshooting

### Issue: Still seeing static fallback content

1. Check that your `.env` file is in the correct location (`Generative/.env`)
2. Verify that the API key is correctly copied without extra spaces
3. Check the backend console for any error messages
4. Ensure you've restarted the application after updating the `.env` file

### Issue: "Invalid API key" error

1. Verify that your API key is correct and active
2. Check that you haven't exceeded your API quota
3. Make sure you're using a Google Generative AI API key, not a Google Cloud API key

### Issue: "ImportError: No module named 'google.generativeai'"

1. Install the required package:
   ```bash
   pip install google-generativeai
   ```

## Additional AI Services (Optional)

For improved reliability, you can configure additional AI services as fallbacks:

### Hugging Face
1. Sign up at [Hugging Face](https://huggingface.co/)
2. Get your API token from Settings > Access Tokens
3. Add to your `.env`:
   ```env
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```

### Groq
1. Sign up at [Groq](https://console.groq.com/)
2. Create an API key
3. Add to your `.env`:
   ```env
   GROQ_API_KEY=your_groq_api_key
   ```

These additional services will be automatically used if the primary Google Generative AI service is unavailable.