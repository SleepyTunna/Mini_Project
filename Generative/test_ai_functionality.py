#!/usr/bin/env python3
"""
Test script to verify AI service functionality
"""

import os
import sys
from dotenv import load_dotenv

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

from services.ai_service import AIService

def test_ai_service():
    """Test the AI service functionality"""
    print("🧪 Testing AI Service...")
    
    # Initialize the AI service
    ai_service = AIService()
    
    # Test career analysis
    print("\n📝 Testing career analysis...")
    try:
        result = ai_service.generate_career_analysis("Python, JavaScript, React", "Intermediate")
        print("✅ Career analysis generated successfully")
        print(f"   Career paths found: {len(result['career_paths'])}")
        print(f"   Roadmap steps: {len(result['roadmap'])}")
        print(f"   Courses suggested: {len(result['courses'])}")
    except Exception as e:
        print(f"❌ Error generating career analysis: {e}")
    
    # Test personalized roadmap
    print("\n🗺️  Testing personalized roadmap...")
    try:
        roadmap = ai_service.generate_personalized_roadmap("Python, JavaScript", "Web Developer", "Intermediate")
        print("✅ Personalized roadmap generated successfully")
        print(f"   Roadmap length: {len(roadmap)} characters")
    except Exception as e:
        print(f"❌ Error generating personalized roadmap: {e}")
    
    # Test skill extraction
    print("\n🔍 Testing skill extraction...")
    try:
        skills_result = ai_service.extract_skills_from_message(
            "I've been learning Python and JavaScript for the past year, and I'm comfortable with React and Node.js",
            "Python, JavaScript"
        )
        print("✅ Skill extraction completed successfully")
        print(f"   Extracted skills: {skills_result['extracted_skills']}")
        print(f"   Updated skills: {skills_result['updated_skills']}")
    except Exception as e:
        print(f"❌ Error extracting skills: {e}")
    
    print("\n🏁 AI service test completed")

if __name__ == "__main__":
    test_ai_service()