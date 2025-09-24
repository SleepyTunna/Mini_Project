# Test the same import logic as in ai_service.py
GOOGLE_GENAI_AVAILABLE = False

try:
    import google.generativeai as genai_module
    GOOGLE_GENAI_AVAILABLE = True
    print("Google Generative AI module imported successfully")
    print("Module:", genai_module)
except ImportError as e:
    print("Failed to import Google Generative AI:", e)
    GOOGLE_GENAI_AVAILABLE = False

print("GOOGLE_GENAI_AVAILABLE:", GOOGLE_GENAI_AVAILABLE)