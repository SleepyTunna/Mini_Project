import os
from services.ai_service import AIService

# Test the AI service with open-source alternatives
print("=== Testing Open-Source AI Alternatives ===")

# Create AI service instance
ai = AIService()

# Show which services are available
print(f"Vertex AI available: {ai.vertex_ai_available}")
for service, available in ai.fallback_apis.items():
    print(f"{service}: {'✅' if available else '❌'}")

# Test career analysis with fallback
print("\n=== Testing Career Analysis ===")
result = ai._create_enhanced_fallback_response('python, data analysis, machine learning', 'Intermediate')
print(f"Selected career path: {result['selected_path']['title']}")
print(f"Salary range: {result['selected_path']['salary_range']}")
print(f"Growth prospect: {result['selected_path']['growth_prospect']}")

# Show all available paths
print("\nAll available career paths:")
for i, path in enumerate(result['career_paths'], 1):
    print(f"{i}. {path['title']}")