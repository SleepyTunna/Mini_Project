import json
import os
import requests
from typing import Dict, Any, List
from datetime import datetime
import re
try:
    from google.cloud import aiplatform
    from google.cloud import firestore
    from vertexai.generative_models import GenerativeModel
    VERTEX_AI_AVAILABLE = True
except ImportError:
    print("Warning: Vertex AI not available. Using fallback AI services.")
    VERTEX_AI_AVAILABLE = False

try:
    import google.generativeai as genai
    GOOGLE_GENAI_AVAILABLE = True
except ImportError:
    print("Warning: Google Generative AI not available.")
    GOOGLE_GENAI_AVAILABLE = False

from models.schemas import CareerPath, Course, RoadmapStep, MockTestQuestion

# Currency conversion utility
def convert_usd_to_inr(usd_range: str) -> str:
    """
    Convert USD salary range to INR
    Args:
        usd_range: String like '$60,000 - $120,000'
    Returns:
        String like '₹49.80 lakhs - ₹99.60 lakhs'
    """
    # Exchange rate: 1 USD = 88.09 INR (current rate)
    USD_TO_INR = 88.09
    
    # Extract numbers from USD range - use proper regex
    numbers = re.findall(r'\$([0-9,]+)', usd_range)
    if len(numbers) >= 2:
        try:
            # Remove commas and convert to int
            usd_min = int(numbers[0].replace(',', ''))
            usd_max = int(numbers[1].replace(',', ''))
            
            # Convert to INR
            inr_min = usd_min * USD_TO_INR
            inr_max = usd_max * USD_TO_INR
            
            # Format as Indian currency (with lakhs format)
            def format_inr(amount):
                # Convert to lakhs format for better readability
                if amount >= 10000000:  # 1 crore or more
                    crores = amount // 10000000
                    lakhs = (amount % 10000000) // 100000
                    if lakhs > 0:
                        return f"₹{crores}.{lakhs:02d} crores"
                    else:
                        return f"₹{crores} crores"
                elif amount >= 100000:  # 1 lakh or more
                    lakhs = amount // 100000
                    thousands = (amount % 100000) // 1000
                    if thousands > 0:
                        return f"₹{lakhs}.{thousands:02d} lakhs"
                    else:
                        return f"₹{lakhs} lakhs"
                else:
                    # Format with commas for amounts less than 1 lakh
                    return f"₹{amount:,}"
            
            return f"{format_inr(inr_min)} - {format_inr(inr_max)}"
            
        except ValueError:
            return usd_range  # Return original if conversion fails
    
    return usd_range  # Return original if parsing fails

class AIService:
    """Service for handling AI-related operations with multiple AI provider fallbacks"""
    
    def __init__(self):
        """Initialize the AI service with Vertex AI as primary and fallbacks"""
        self.project_id = os.getenv("GOOGLE_CLOUD_PROJECT", "your-project-id")
        self.vertex_ai_available = VERTEX_AI_AVAILABLE
        self.model = None
        self.firestore_client = None
        
        # Initialize Vertex AI if available
        if self.vertex_ai_available:
            try:
                aiplatform.init(project=self.project_id)
                self.model = GenerativeModel("gemini-1.0-pro")
                print("✅ Vertex AI initialized successfully")
            except Exception as e:
                print(f"Warning: Could not initialize Vertex AI: {e}")
                self.vertex_ai_available = False
        
        # Initialize Firestore client with error handling
        if self.vertex_ai_available:
            try:
                self.firestore_client = firestore.Client(project=self.project_id)
            except Exception as e:
                print(f"Warning: Could not initialize Firestore client: {e}")
                self.firestore_client = None
        
        # Initialize fallback AI services
        self.fallback_apis = {
            'google_genai': self._init_google_genai(),
            'huggingface': self._init_huggingface(),
            'ollama': self._init_ollama(),
            'openai_free': self._init_openai_free(),
            'groq': self._init_groq()
        }
        
        print(f"🤖 AI Service initialized. Vertex AI: {'✅' if self.vertex_ai_available else '❌'}")
        if not self.vertex_ai_available:
            available_fallbacks = [name for name, available in self.fallback_apis.items() if available]
            print(f"📡 Available fallback AI services: {available_fallbacks if available_fallbacks else 'None - using static responses'}")
    
    def _init_google_genai(self) -> bool:
        """Initialize Google Generative AI API (Gemini)"""
        try:
            # Try both the SDK and direct REST API approach
            api_key = os.getenv('GOOGLE_GENAI_API_KEY', '')
            if not api_key or api_key == 'your-google-genai-api-key':
                return False
            
            # Set up for direct REST API calls
            self.google_genai_api_key = api_key
            self.google_genai_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={api_key}"
            
            if GOOGLE_GENAI_AVAILABLE:
                # Also set up the SDK if available
                genai.configure(api_key=api_key)
                self.genai_model = genai.GenerativeModel('gemini-1.5-flash')
                print("✅ Google Generative AI (Gemini) initialized successfully with SDK")
            else:
                print("✅ Google Generative AI (Gemini) initialized for direct REST API calls")
            
            return True
        except Exception as e:
            print(f"Warning: Could not initialize Google Generative AI: {e}")
            return False
    
    def _init_huggingface(self) -> bool:
        """Initialize Hugging Face API (free tier available)"""
        try:
            # Hugging Face provides free API access
            self.hf_api_url = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large"
            # You can also use: facebook/blenderbot-400M-distill, microsoft/DialoGPT-medium
            self.hf_headers = {
                "Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY', '')}",
                "Content-Type": "application/json"
            }
            return True
        except Exception as e:
            print(f"Warning: Could not initialize Hugging Face API: {e}")
            return False
    
    def _init_ollama(self) -> bool:
        """Initialize Ollama (local AI models - completely free)"""
        try:
            # Check if Ollama is running locally
            response = requests.get("http://localhost:11434/api/tags", timeout=2)
            if response.status_code == 200:
                self.ollama_url = "http://localhost:11434/api/generate"
                print("✅ Ollama detected locally")
                return True
        except:
            pass
        return False
    
    def _init_groq(self) -> bool:
        """Initialize Groq API (fast and free)"""
        try:
            self.groq_api_key = os.getenv('GROQ_API_KEY', '')
            self.groq_url = "https://api.groq.com/openai/v1/chat/completions"
            return bool(self.groq_api_key)
        except:
            return False
    
    def _init_openai_free(self) -> bool:
        """Initialize OpenAI-compatible free APIs"""
        try:
            # Free OpenAI-compatible APIs like Together AI, Groq, etc.
            self.openai_free_url = os.getenv('OPENAI_FREE_API_URL', '')
            self.openai_free_key = os.getenv('OPENAI_FREE_API_KEY', '')
            return bool(self.openai_free_url and self.openai_free_key)
        except:
            return False
    
    def _generate_with_fallback_ai(self, prompt: str) -> str:
        """Try different AI services as fallbacks with enhanced Gemini integration"""
        
        # Try Google Generative AI first (Gemini) - Primary service
        if self.fallback_apis['google_genai']:
            try:
                # Try SDK first if available
                if hasattr(self, 'genai_model'):
                    # Enhanced configuration for better responses
                    generation_config = {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "top_k": 40,
                        "max_output_tokens": 1000,
                    }
                    
                    response = self.genai_model.generate_content(
                        prompt,
                        generation_config=generation_config
                    )
                    if response.text:
                        print("✅ Generated personalized content using Google Generative AI (Gemini SDK)")
                        return response.text
                
                # Fallback to direct REST API call with enhanced configuration
                elif hasattr(self, 'google_genai_url'):
                    payload = {
                        "contents": [{
                            "parts": [{
                                "text": prompt
                            }]
                        }],
                        "generationConfig": {
                            "temperature": 0.7,
                            "topP": 0.9,
                            "topK": 40,
                            "maxOutputTokens": 1000,
                            "stopSequences": []
                        },
                        "safetySettings": [
                            {
                                "category": "HARM_CATEGORY_HARASSMENT",
                                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                "category": "HARM_CATEGORY_HATE_SPEECH", 
                                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                            },
                            {
                                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                            }
                        ]
                    }
                    response = requests.post(
                        self.google_genai_url,
                        json=payload,
                        headers={"Content-Type": "application/json"},
                        timeout=45  # Increased timeout for better responses
                    )
                    if response.status_code == 200:
                        result = response.json()
                        if 'candidates' in result and result['candidates']:
                            text = result['candidates'][0]['content']['parts'][0]['text']
                            print("✅ Generated personalized content using Google Generative AI (REST API)")
                            return text
                    else:
                        print(f"Gemini API error: {response.status_code} - {response.text}")
                            
            except Exception as e:
                print(f"Google Generative AI request failed: {e}")
        
        # Try Ollama second (local, completely free)
        if self.fallback_apis['ollama']:
            try:
                response = requests.post(
                    self.ollama_url,
                    json={
                        "model": "llama2",  # or "mistral", "codellama", etc.
                        "prompt": prompt,
                        "stream": False
                    },
                    timeout=30
                )
                if response.status_code == 200:
                    result = response.json()
                    if 'response' in result:
                        print("✅ Generated content using Ollama (local AI)")
                        return result['response']
            except Exception as e:
                print(f"Ollama request failed: {e}")
        
        # Try Hugging Face API
        if self.fallback_apis['huggingface']:
            try:
                # Use a better model for generation
                hf_generation_url = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large"
                response = requests.post(
                    hf_generation_url,
                    headers=self.hf_headers,
                    json={
                        "inputs": prompt,
                        "parameters": {
                            "max_length": 1000,
                            "temperature": 0.7,
                            "do_sample": True
                        }
                    },
                    timeout=30
                )
                if response.status_code == 200:
                    result = response.json()
                    if isinstance(result, list) and len(result) > 0:
                        print("✅ Generated content using Hugging Face API")
                        return result[0].get('generated_text', '')
            except Exception as e:
                print(f"Hugging Face request failed: {e}")
        
        # Try Groq API (fast and free)
        if self.fallback_apis['groq']:
            try:
                response = requests.post(
                    self.groq_url,
                    headers={
                        "Authorization": f"Bearer {self.groq_api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "mixtral-8x7b-32768",
                        "messages": [{"role": "user", "content": prompt}],
                        "max_tokens": 1000,
                        "temperature": 0.7
                    },
                    timeout=30
                )
                if response.status_code == 200:
                    result = response.json()
                    if 'choices' in result and len(result['choices']) > 0:
                        print("✅ Generated content using Groq API")
                        return result['choices'][0]['message']['content']
            except Exception as e:
                print(f"Groq request failed: {e}")
        
        # Try OpenAI-compatible free API
        if self.fallback_apis['openai_free']:
            try:
                response = requests.post(
                    f"{self.openai_free_url}/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.openai_free_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "gpt-3.5-turbo",  # or whatever model the service provides
                        "messages": [{"role": "user", "content": prompt}],
                        "max_tokens": 1000,
                        "temperature": 0.7
                    },
                    timeout=30
                )
                if response.status_code == 200:
                    result = response.json()
                    if 'choices' in result and len(result['choices']) > 0:
                        print("✅ Generated content using OpenAI-compatible API")
                        return result['choices'][0]['message']['content']
            except Exception as e:
                print(f"OpenAI-compatible API request failed: {e}")
        
        # If all AI services fail, return empty string (caller handles fallback)
        print("⚠️ All AI services failed, using static fallback")
        return ""
    def generate_personalized_roadmap(self, user_skills: str, career_goal: str, experience_level: str) -> str:
        """
        Generate a personalized career roadmap using Gemini AI
        """
        roadmap_prompt = f"""
Create a detailed, personalized career roadmap for someone with the following profile:

Current Skills: {user_skills or "Beginner level"}
Career Goal: {career_goal}
Experience Level: {experience_level}

Provide a comprehensive roadmap that includes:

1. **Immediate Actions (Next 30 days):**
   - 2-3 specific tasks they should start immediately
   - Skills to focus on first
   - Resources to begin with

2. **Short-term Goals (3-6 months):**
   - Key milestones to achieve
   - Skills to develop
   - Projects to build
   - Certifications to pursue

3. **Medium-term Goals (6-12 months):**
   - Advanced skills to master
   - Portfolio projects
   - Networking opportunities
   - Job search preparation

4. **Long-term Vision (1-2 years):**
   - Career advancement opportunities
   - Leadership skills development
   - Specialization areas

5. **Specific Resources:**
   - Recommended courses (with platforms)
   - Books to read
   - Tools to learn
   - Communities to join

6. **Success Metrics:**
   - How to measure progress
   - Key performance indicators
   - Portfolio pieces to create

Make this roadmap actionable, specific, and tailored to their current skill level. Include realistic timelines and practical next steps.
        """
        
        ai_response = self._generate_with_fallback_ai(roadmap_prompt)
        
        if ai_response:
            return ai_response
        
        # Fallback roadmap if AI is unavailable
        return f"""
🗺️ **Your Personalized Career Roadmap**

**Current Status:** {experience_level} with skills in {user_skills or "foundational areas"}
**Target Goal:** {career_goal}

**🚀 Immediate Actions (Next 30 days):**
1. Assess your current skill gaps
2. Set up a dedicated learning schedule (1-2 hours daily)
3. Create accounts on key learning platforms

**🎯 Short-term Goals (3-6 months):**
1. Complete 2-3 foundational courses
2. Build your first portfolio project
3. Join relevant online communities
4. Start following industry leaders

**📈 Medium-term Goals (6-12 months):**
1. Complete an advanced certification
2. Build 3-5 portfolio projects
3. Start networking in your field
4. Apply for relevant positions

**🌟 Long-term Vision (1-2 years):**
1. Secure your target role
2. Develop leadership skills
3. Consider specialization areas
4. Mentor others in your journey

**📚 Recommended Resources:**
- Online platforms: Coursera, Udemy, freeCodeCamp
- Books: Industry-specific bestsellers
- Tools: Popular industry software
- Communities: LinkedIn groups, Discord servers

**📉 Track Your Progress:**
- Weekly skill assessments
- Monthly portfolio updates
- Quarterly goal reviews
        """
    def generate_career_analysis(self, skills: str, expertise: str) -> Dict[str, Any]:
        """Generate career analysis using available AI services with fallbacks"""
        
        prompt = f"""
        Based on the following skills and expertise, provide a comprehensive career analysis:

        Skills: {skills}
        Expertise: {expertise}

        Please provide a JSON response with the following structure:
        {{
            "career_paths": [
                {{
                    "title": "Career Path Title",
                    "description": "Brief description of the career path",
                    "required_skills": ["skill1", "skill2", "skill3"],
                    "salary_range": "e.g., ₹49.80 lakhs - ₹99.60 lakhs",
                    "growth_prospect": "High/Medium/Low with brief explanation"
                }}
            ],
            "selected_path": {{
                "title": "Best matching career path",
                "description": "Detailed description",
                "required_skills": ["skill1", "skill2", "skill3"],
                "salary_range": "e.g., ₹49.80 lakhs - ₹99.60 lakhs",
                "growth_prospect": "High/Medium/Low with brief explanation"
            }},
            "roadmap": [
                {{
                    "step": 1,
                    "title": "Step title",
                    "description": "What to do in this step",
                    "duration": "e.g., 3-6 months",
                    "resources": ["resource1", "resource2"]
                }}
            ],
            "courses": [
                {{
                    "title": "Course title",
                    "provider": "Course provider",
                    "duration": "e.g., 8 weeks",
                    "difficulty": "Beginner/Intermediate/Advanced",
                    "url": "Course URL or platform"
                }}
            ]
        }}

        Provide exactly 3 career paths, select the best one, create a 5-step roadmap, and suggest 3-5 relevant courses.
        Focus on practical, actionable advice.
        """

        # Try Vertex AI first if available
        if self.vertex_ai_available and self.model:
            try:
                response = self.model.generate_content(prompt)
                response_text = response.text
                
                # Extract JSON from response
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_str = response_text[start_idx:end_idx]
                    result = json.loads(json_str)
                    print("✅ Generated career analysis using Vertex AI")
                    return result
                    
            except Exception as e:
                print(f"Vertex AI generation failed: {e}")
        
        # Try fallback AI services
        ai_response = self._generate_with_fallback_ai(prompt)
        if ai_response:
            try:
                # Try to extract JSON from AI response
                start_idx = ai_response.find('{')
                end_idx = ai_response.rfind('}') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_str = ai_response[start_idx:end_idx]
                    result = json.loads(json_str)
                    return result
            except Exception as e:
                print(f"Error parsing AI response: {e}")
        
        # Fallback to static response
        print("📊 Using enhanced static career analysis")
        return self._create_enhanced_fallback_response(skills, expertise)
    
    def _create_enhanced_fallback_response(self, skills: str, expertise: str) -> Dict[str, Any]:
        """Create an enhanced fallback response that adapts to user's skills"""
        
        skills_lower = skills.lower()
        
        # Determine primary domain based on skills
        if any(skill in skills_lower for skill in ['python', 'javascript', 'java', 'programming', 'coding', 'react', 'node']):
            primary_domain = 'software_development'
        elif any(skill in skills_lower for skill in ['data', 'analytics', 'sql', 'pandas', 'statistics', 'machine learning']):
            primary_domain = 'data_science'
        elif any(skill in skills_lower for skill in ['design', 'ui', 'ux', 'photoshop', 'figma', 'adobe']):
            primary_domain = 'design'
        elif any(skill in skills_lower for skill in ['marketing', 'social media', 'seo', 'content', 'advertising']):
            primary_domain = 'marketing'
        elif any(skill in skills_lower for skill in ['project management', 'agile', 'scrum', 'leadership']):
            primary_domain = 'project_management'
        else:
            primary_domain = 'general_tech'
        
        # Get domain-specific responses
        domain_responses = {
            'software_development': {
                'career_paths': [
                    {
                        'title': 'Full Stack Developer',
                        'description': 'Develop complete web applications from frontend to backend',
                        'required_skills': ['JavaScript', 'React', 'Node.js', 'Databases', 'Git'],
                        'salary_range': convert_usd_to_inr('$70,000 - $130,000'),
                        'growth_prospect': 'High - Strong demand for versatile developers'
                    },
                    {
                        'title': 'Software Engineer',
                        'description': 'Design and develop software systems and applications',
                        'required_skills': ['Programming Languages', 'Data Structures', 'System Design', 'Testing'],
                        'salary_range': convert_usd_to_inr('$80,000 - $150,000'),
                        'growth_prospect': 'High - Technology sector continues to grow rapidly'
                    },
                    {
                        'title': 'DevOps Engineer',
                        'description': 'Bridge development and operations to streamline software delivery',
                        'required_skills': ['Docker', 'Kubernetes', 'AWS/Cloud', 'CI/CD', 'Monitoring'],
                        'salary_range': convert_usd_to_inr('$85,000 - $140,000'),
                        'growth_prospect': 'Very High - Essential for modern software delivery'
                    }
                ],
                'selected_path': {
                    'title': 'Full Stack Developer',
                    'description': 'Based on your skills, becoming a Full Stack Developer offers the best opportunity to leverage your programming knowledge while building complete applications',
                    'required_skills': ['JavaScript', 'React', 'Node.js', 'Databases', 'Git', 'API Development'],
                    'salary_range': convert_usd_to_inr('$70,000 - $130,000'),
                    'growth_prospect': 'High - Full stack developers are highly sought after for their versatility'
                }
            },
            'data_science': {
                'career_paths': [
                    {
                        'title': 'Data Scientist',
                        'description': 'Extract insights from data to drive business decisions',
                        'required_skills': ['Python', 'Statistics', 'Machine Learning', 'SQL', 'Data Visualization'],
                        'salary_range': convert_usd_to_inr('$90,000 - $160,000'),
                        'growth_prospect': 'Very High - Data-driven decision making is crucial'
                    },
                    {
                        'title': 'Data Analyst',
                        'description': 'Analyze data to identify trends and create reports',
                        'required_skills': ['SQL', 'Excel', 'Tableau/PowerBI', 'Statistics', 'Business Intelligence'],
                        'salary_range': convert_usd_to_inr('$60,000 - $100,000'),
                        'growth_prospect': 'High - Every company needs data insights'
                    },
                    {
                        'title': 'ML Engineer',
                        'description': 'Deploy and maintain machine learning models in production',
                        'required_skills': ['Python', 'TensorFlow/PyTorch', 'MLOps', 'Cloud Platforms', 'Docker'],
                        'salary_range': convert_usd_to_inr('$100,000 - $180,000'),
                        'growth_prospect': 'Very High - AI/ML adoption is accelerating'
                    }
                ],
                'selected_path': {
                    'title': 'Data Scientist',
                    'description': 'Your analytical skills and data experience position you well for a data science career',
                    'required_skills': ['Python', 'Statistics', 'Machine Learning', 'SQL', 'Data Visualization', 'Domain Expertise'],
                    'salary_range': convert_usd_to_inr('$90,000 - $160,000'),
                    'growth_prospect': 'Very High - Data science skills are in extremely high demand'
                }
            }
        }
        
        # Get appropriate response or use software development as default
        response_data = domain_responses.get(primary_domain, domain_responses['software_development'])
        
        return {
            'career_paths': response_data['career_paths'],
            'selected_path': response_data['selected_path'],
            'roadmap': [
                {
                    'step': 1,
                    'title': 'Skill Assessment and Gap Analysis',
                    'description': 'Evaluate your current skills and identify areas for improvement',
                    'duration': '2-4 weeks',
                    'resources': ['Online assessments', 'Portfolio review', 'Industry research']
                },
                {
                    'step': 2,
                    'title': 'Learn Core Technologies',
                    'description': 'Master the fundamental technologies for your chosen career path',
                    'duration': '3-6 months',
                    'resources': ['Online courses', 'Documentation', 'Practice projects']
                },
                {
                    'step': 3,
                    'title': 'Build Portfolio Projects',
                    'description': 'Create impressive projects that demonstrate your skills to employers',
                    'duration': '2-4 months',
                    'resources': ['GitHub', 'Personal website', 'Case studies']
                },
                {
                    'step': 4,
                    'title': 'Network and Gain Experience',
                    'description': 'Connect with professionals and gain real-world experience',
                    'duration': '3-6 months',
                    'resources': ['LinkedIn', 'Tech meetups', 'Open source contributions', 'Internships']
                },
                {
                    'step': 5,
                    'title': 'Job Search and Interview Preparation',
                    'description': 'Prepare for interviews and start applying to positions',
                    'duration': '1-3 months',
                    'resources': ['Interview practice', 'Resume optimization', 'Job boards', 'Referrals']
                }
            ],
            'courses': [
                {
                    'title': 'The Complete Web Developer Course',
                    'provider': 'Udemy',
                    'duration': '12 weeks',
                    'difficulty': 'Beginner',
                    'url': 'https://www.udemy.com/course/the-complete-web-development-bootcamp/'
                },
                {
                    'title': 'CS50\'s Introduction to Computer Science',
                    'provider': 'Harvard (edX)',
                    'duration': '10 weeks',
                    'difficulty': 'Beginner',
                    'url': 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x'
                },
                {
                    'title': 'Python for Everybody Specialization',
                    'provider': 'University of Michigan (Coursera)',
                    'duration': '8 weeks',
                    'difficulty': 'Beginner',
                    'url': 'https://www.coursera.org/specializations/python'
                },
                {
                    'title': 'JavaScript Algorithms and Data Structures',
                    'provider': 'freeCodeCamp',
                    'duration': '6 weeks',
                    'difficulty': 'Intermediate',
                    'url': 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/'
                },
                {
                    'title': 'AWS Cloud Practitioner',
                    'provider': 'Amazon Web Services',
                    'duration': '4 weeks',
                    'difficulty': 'Beginner',
                    'url': 'https://aws.amazon.com/training/learn-about/cloud-practitioner/'
                }
            ]
        }

    def generate_mock_test(self, skills: str, expertise: str, topic: str = "", user_id: str = "") -> Dict[str, Any]:
        """Generate a mock test using available AI services with fallbacks"""
        
        # Build the prompt
        topic_text = f" focusing on {topic}" if topic else ""
        prompt = f"""
        Generate a 5-question mock test for a user with skills {skills} and expertise {expertise}{topic_text}.
        Include questions and answers in JSON format:
        [
          {{"question": "...", "answer": "..."}},
          {{"question": "...", "answer": "..."}},
          {{"question": "...", "answer": "..."}},
          {{"question": "...", "answer": "..."}},
          {{"question": "...", "answer": "..."}}
        ]
        
        Make the questions challenging but appropriate for the specified skill level.
        Provide detailed answers that explain the concepts.
        """

        questions = None
        
        # Try Vertex AI first if available
        if self.vertex_ai_available and self.model:
            try:
                response = self.model.generate_content(prompt)
                response_text = response.text
                
                # Try to find JSON in the response
                start_idx = response_text.find('[')
                end_idx = response_text.rfind(']') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_str = response_text[start_idx:end_idx]
                    questions_data = json.loads(json_str)
                    
                    # Convert to MockTestQuestion objects
                    questions = [MockTestQuestion(**q) for q in questions_data]
                    print("✅ Generated mock test using Vertex AI")
                    
            except Exception as e:
                print(f"Vertex AI mock test generation failed: {e}")
        
        # Try fallback AI services if Vertex AI failed
        if not questions:
            ai_response = self._generate_with_fallback_ai(prompt)
            if ai_response:
                try:
                    # Try to extract JSON from AI response
                    start_idx = ai_response.find('[')
                    end_idx = ai_response.rfind(']') + 1
                    
                    if start_idx != -1 and end_idx != -1:
                        json_str = ai_response[start_idx:end_idx]
                        questions_data = json.loads(json_str)
                        questions = [MockTestQuestion(**q) for q in questions_data]
                except Exception as e:
                    print(f"Error parsing AI mock test response: {e}")
        
        # Fallback to static questions if all AI services failed
        if not questions:
            print("📝 Using enhanced static mock test")
            questions = self._create_enhanced_fallback_test(skills, expertise, topic)
        
        # Generate test ID
        test_id = f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{hash(skills + expertise) % 10000}"
        
        # Prepare test data
        test_data = {
            "test_id": test_id,
            "skills": skills,
            "expertise": expertise,
            "topic": topic,
            "user_id": user_id,
            "questions": [q.dict() for q in questions],
            "created_at": datetime.now().isoformat(),
            "timestamp": datetime.now().isoformat()
        }
        
        # Save to Firestore with proper error handling
        try:
            if hasattr(self, 'firestore_client') and self.firestore_client:
                doc_ref = self.firestore_client.collection('mock_tests').document(test_id)
                doc_ref.set(test_data)
                print(f"Mock test saved to Firestore with ID: {test_id}")
            else:
                print(f"Warning: Firestore not available. Mock test not saved: {test_id}")
        except Exception as e:
            print(f"Error saving to Firestore: {e}")
        
        return {
            "test_id": test_id,
            "questions": [q.dict() for q in questions],
            "user_id": user_id,
            "created_at": test_data["created_at"]
        }
    
    def _create_enhanced_fallback_test(self, skills: str, expertise: str, topic: str = "") -> List[MockTestQuestion]:
        """Create enhanced fallback mock test questions based on user skills and topic"""
        
        skills_lower = skills.lower()
        topic_lower = topic.lower() if topic else ""
        
        # Determine question type based on skills and topic
        if any(skill in skills_lower for skill in ['python', 'programming']) or 'python' in topic_lower:
            return self._create_python_test_questions(expertise)
        elif any(skill in skills_lower for skill in ['javascript', 'js', 'react', 'frontend']) or 'javascript' in topic_lower:
            return self._create_javascript_test_questions(expertise)
        elif any(skill in skills_lower for skill in ['data', 'analytics', 'sql', 'database']) or 'data' in topic_lower:
            return self._create_data_science_test_questions(expertise)
        elif any(skill in skills_lower for skill in ['design', 'ui', 'ux']) or 'design' in topic_lower:
            return self._create_design_test_questions(expertise)
        else:
            return self._create_general_tech_test_questions(expertise)
    
    def _create_python_test_questions(self, expertise: str) -> List[MockTestQuestion]:
        """Create Python-specific test questions"""
        if expertise.lower() in ['advanced', 'expert']:
            return [
                MockTestQuestion(
                    question="What is the difference between __str__ and __repr__ methods in Python classes?",
                    answer="__str__ is meant to be readable and is called by str() and print(). __repr__ is meant to be unambiguous and is called by repr(). __repr__ should ideally return a string that could recreate the object."
                ),
                MockTestQuestion(
                    question="Explain Python's Global Interpreter Lock (GIL) and its impact on multithreading.",
                    answer="The GIL prevents multiple native threads from executing Python bytecodes simultaneously. This means CPU-bound programs won't benefit from multithreading, but I/O-bound programs can still benefit. Use multiprocessing for CPU-bound tasks."
                ),
                MockTestQuestion(
                    question="What are Python decorators and how do they work internally?",
                    answer="Decorators are functions that modify other functions. They use closure to wrap the original function. @decorator is syntactic sugar for func = decorator(func). They're useful for logging, authentication, caching, etc."
                ),
                MockTestQuestion(
                    question="Explain the difference between deep copy and shallow copy in Python.",
                    answer="Shallow copy creates a new object but inserts references to objects in the original. Deep copy creates new objects recursively. Use copy.copy() for shallow and copy.deepcopy() for deep copying."
                ),
                MockTestQuestion(
                    question="How does Python's memory management work?",
                    answer="Python uses reference counting plus cycle detection for garbage collection. Objects are deleted when reference count reaches zero. Cycle detector handles circular references that reference counting can't resolve."
                )
            ]
        else:
            return [
                MockTestQuestion(
                    question="What is the difference between a list and a tuple in Python?",
                    answer="Lists are mutable (can be changed) and use square brackets []. Tuples are immutable (cannot be changed) and use parentheses (). Lists are better for data that changes, tuples for fixed data."
                ),
                MockTestQuestion(
                    question="How do you handle exceptions in Python?",
                    answer="Use try-except blocks. Put risky code in 'try', handle errors in 'except'. You can catch specific exceptions or use 'except Exception' for general errors. Always include meaningful error messages."
                ),
                MockTestQuestion(
                    question="What is a Python function and how do you define one?",
                    answer="A function is a reusable block of code. Define with 'def function_name(parameters):' followed by indented code. Functions can return values using 'return' and accept parameters to work with different data."
                ),
                MockTestQuestion(
                    question="Explain Python dictionaries and their use cases.",
                    answer="Dictionaries store key-value pairs using curly braces {}. Keys must be unique and immutable. They're perfect for mapping relationships, caching, and when you need fast lookups by key."
                ),
                MockTestQuestion(
                    question="What are Python loops and when would you use each type?",
                    answer="'for' loops iterate over sequences (lists, strings, ranges). 'while' loops continue until a condition is false. Use 'for' when you know the iterations, 'while' for conditional repetition."
                )
            ]
    
    def _create_javascript_test_questions(self, expertise: str) -> List[MockTestQuestion]:
        """Create JavaScript-specific test questions"""
        if expertise.lower() in ['advanced', 'expert']:
            return [
                MockTestQuestion(
                    question="Explain JavaScript's event loop and how asynchronous operations work.",
                    answer="The event loop handles async operations by moving callbacks to a queue when async operations complete. It continuously checks if the call stack is empty, then processes queued callbacks. This enables non-blocking I/O."
                ),
                MockTestQuestion(
                    question="What is closure in JavaScript and provide a practical example.",
                    answer="Closure is when an inner function has access to outer function's variables even after the outer function returns. Example: function outer(x) { return function(y) { return x + y; }; } - the inner function 'closes over' x."
                ),
                MockTestQuestion(
                    question="Explain the difference between 'this' in regular functions vs arrow functions.",
                    answer="Regular functions have dynamic 'this' based on how they're called. Arrow functions inherit 'this' from enclosing scope (lexical this). Arrow functions can't be used as constructors and don't have their own 'this'."
                ),
                MockTestQuestion(
                    question="What are JavaScript Promises and how do they handle async operations?",
                    answer="Promises represent eventual completion of async operations. They have three states: pending, fulfilled, rejected. Use .then() for success, .catch() for errors, .finally() for cleanup. Better than callbacks for avoiding callback hell."
                ),
                MockTestQuestion(
                    question="Explain prototype inheritance in JavaScript.",
                    answer="Every object has a prototype chain. When accessing a property, JS looks up the chain until found. Objects inherit from Object.prototype by default. Use Object.create() or class syntax for inheritance."
                )
            ]
        else:
            return [
                MockTestQuestion(
                    question="What is the difference between 'let', 'const', and 'var' in JavaScript?",
                    answer="'var' is function-scoped and hoisted. 'let' and 'const' are block-scoped. 'const' cannot be reassigned after declaration. Use 'const' by default, 'let' when you need to reassign, avoid 'var'."
                ),
                MockTestQuestion(
                    question="How do you create and manipulate arrays in JavaScript?",
                    answer="Create arrays with [] or new Array(). Common methods: push() adds to end, pop() removes from end, shift()/unshift() for beginning, slice() for copying portions, splice() for adding/removing elements."
                ),
                MockTestQuestion(
                    question="What are JavaScript functions and different ways to declare them?",
                    answer="Functions are reusable code blocks. Declare with: function name() {}, const name = function() {}, const name = () => {}. Arrow functions are shorter and don't have their own 'this'."
                ),
                MockTestQuestion(
                    question="How do you work with objects in JavaScript?",
                    answer="Objects store key-value pairs. Create with {} or new Object(). Access properties with dot notation (obj.key) or brackets (obj['key']). Add/modify properties by assignment."
                ),
                MockTestQuestion(
                    question="What is DOM manipulation and how do you select elements?",
                    answer="DOM manipulation changes HTML elements with JavaScript. Select elements using document.getElementById(), querySelector(), getElementsByClassName(). Modify with innerHTML, textContent, style properties."
                )
            ]
    
    def _create_data_science_test_questions(self, expertise: str) -> List[MockTestQuestion]:
        """Create data science-specific test questions"""
        return [
            MockTestQuestion(
                question="What is the difference between supervised and unsupervised learning?",
                answer="Supervised learning uses labeled data to train models for prediction (classification/regression). Unsupervised learning finds patterns in unlabeled data (clustering, dimensionality reduction)."
            ),
            MockTestQuestion(
                question="Explain what SQL JOINs are and when to use different types.",
                answer="JOINs combine data from multiple tables. INNER JOIN returns matching records. LEFT JOIN returns all left table records plus matches. RIGHT JOIN returns all right table records plus matches. FULL JOIN returns all records."
            ),
            MockTestQuestion(
                question="What is data normalization and why is it important?",
                answer="Data normalization scales features to similar ranges (0-1 or standard normal). It's important because algorithms like neural networks and k-means are sensitive to feature scales, and it improves convergence and performance."
            ),
            MockTestQuestion(
                question="Explain the bias-variance tradeoff in machine learning.",
                answer="Bias is error from oversimplifying assumptions. Variance is error from model sensitivity to training data. High bias = underfitting, high variance = overfitting. Goal is finding optimal balance for best generalization."
            ),
            MockTestQuestion(
                question="What are some common data visualization best practices?",
                answer="Choose appropriate chart types for data. Use clear labels and titles. Avoid 3D charts and pie charts with many categories. Ensure accessibility with colorblind-friendly palettes. Start y-axis at zero for bar charts."
            )
        ]
    
    def _create_design_test_questions(self, expertise: str) -> List[MockTestQuestion]:
        """Create design-specific test questions"""
        return [
            MockTestQuestion(
                question="What are the key principles of good user interface design?",
                answer="Key principles include: consistency, clarity, efficiency, forgiveness (easy to undo), accessibility, user control, and feedback. Focus on user needs, maintain visual hierarchy, and reduce cognitive load."
            ),
            MockTestQuestion(
                question="Explain the difference between UX and UI design.",
                answer="UX (User Experience) focuses on overall user journey, research, and problem-solving. UI (User Interface) focuses on visual design, layouts, and interactions. UX is strategy, UI is implementation."
            ),
            MockTestQuestion(
                question="What is color theory and how does it apply to digital design?",
                answer="Color theory studies how colors interact. Use complementary colors for contrast, analogous for harmony. Consider color psychology and accessibility. Maintain sufficient contrast ratios (4.5:1 for normal text)."
            ),
            MockTestQuestion(
                question="What is typography and what makes good typography in digital interfaces?",
                answer="Typography is the art of arranging text. Good digital typography uses readable fonts, appropriate sizes (16px+ for body), proper line spacing (1.4-1.6), adequate contrast, and hierarchy through size and weight."
            ),
            MockTestQuestion(
                question="Explain responsive design principles.",
                answer="Responsive design adapts to different screen sizes. Use flexible grids, scalable images, and CSS media queries. Follow mobile-first approach, design for touch interfaces, and ensure content remains accessible across devices."
            )
        ]
    
    def _create_general_tech_test_questions(self, expertise: str) -> List[MockTestQuestion]:
        """Create general technology test questions"""
        return [
            MockTestQuestion(
                question="What is version control and why is it important in software development?",
                answer="Version control tracks changes to code over time. It enables collaboration, backup, branching for features, and rollback to previous versions. Git is the most popular system, enabling distributed development."
            ),
            MockTestQuestion(
                question="Explain the difference between frontend and backend development.",
                answer="Frontend handles user interface and user experience (HTML, CSS, JavaScript). Backend handles server logic, databases, and APIs (Python, Java, Node.js). They communicate through APIs to create complete applications."
            ),
            MockTestQuestion(
                question="What is an API and how do RESTful APIs work?",
                answer="API (Application Programming Interface) allows applications to communicate. REST uses HTTP methods (GET, POST, PUT, DELETE) with stateless requests. Returns data in JSON format with proper status codes."
            ),
            MockTestQuestion(
                question="What are the key principles of good software architecture?",
                answer="Key principles include: modularity, separation of concerns, loose coupling, high cohesion, scalability, maintainability, and following design patterns. Good architecture makes code easier to understand, test, and modify."
            ),
            MockTestQuestion(
                question="Explain the importance of testing in software development.",
                answer="Testing ensures code works correctly and prevents bugs. Types include unit tests (individual functions), integration tests (component interaction), and end-to-end tests (full user workflows). Automated testing saves time and improves reliability."
            )
        ]
    
    def extract_skills_from_message(self, message: str, current_skills: str = "") -> Dict[str, Any]:
        """Extract and merge skills from user message using available AI services with fallbacks"""
        
        prompt = f"""
        A user has shared information about their learning or skills. Please extract any technical skills, technologies, programming languages, tools, or professional competencies mentioned.
        
        User message: "{message}"
        Current skills: "{current_skills}"
        
        Please provide a JSON response with the following structure:
        {{
            "extracted_skills": ["skill1", "skill2", "skill3"],
            "updated_skills": "merged and deduplicated list of all skills as a comma-separated string",
            "bot_response": "A friendly response acknowledging what the user learned and encouraging them"
        }}
        
        Rules:
        1. Extract only actual skills, technologies, or competencies
        2. Merge with existing skills, avoiding duplicates
        3. Keep the response encouraging and supportive
        4. If no new skills are found, return empty extracted_skills array but still provide a helpful response
        """

        # Try Vertex AI first if available
        if self.vertex_ai_available and self.model:
            try:
                response = self.model.generate_content(prompt)
                response_text = response.text
                
                # Try to find JSON in the response
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_str = response_text[start_idx:end_idx]
                    result = json.loads(json_str)
                    print("✅ Extracted skills using Vertex AI")
                    return result
                    
            except Exception as e:
                print(f"Vertex AI skill extraction failed: {e}")
        
        # Try fallback AI services
        ai_response = self._generate_with_fallback_ai(prompt)
        if ai_response:
            try:
                # Try to extract JSON from AI response
                start_idx = ai_response.find('{')
                end_idx = ai_response.rfind('}') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_str = ai_response[start_idx:end_idx]
                    return json.loads(json_str)
            except Exception as e:
                print(f"Error parsing AI skill extraction response: {e}")
        
        # Fallback to static response
        print("🔍 Using enhanced static skill extraction")
        return self._create_enhanced_fallback_skill_response(message, current_skills)
    
    def _create_enhanced_fallback_skill_response(self, message: str, current_skills: str) -> Dict[str, Any]:
        """Create an enhanced fallback response for skill extraction using pattern matching"""
        
        # Use the same pattern matching as _extract_skills_fallback
        result = self._extract_skills_fallback(message)
        extracted_skills_data = result.get("extracted_skills", [])
        
        # Convert to skill names only for merging
        extracted_skills = [skill["skill"] for skill in extracted_skills_data]
        
        # Merge with current skills
        current_skills_list = [skill.strip() for skill in current_skills.split(",") if skill.strip()] if current_skills else []
        all_skills = current_skills_list + extracted_skills
        
        # Remove duplicates while preserving order
        seen = set()
        unique_skills = []
        for skill in all_skills:
            skill_lower = skill.lower()
            if skill_lower not in seen:
                seen.add(skill_lower)
                unique_skills.append(skill)
        
        updated_skills = ", ".join(unique_skills)
        
        # Generate encouraging response based on extracted skills
        if extracted_skills:
            if len(extracted_skills) == 1:
                bot_response = f"Great job learning {extracted_skills[0]}! That's a valuable skill that will serve you well in your career journey. Keep up the excellent work! 🚀"
            else:
                skills_text = ", ".join(extracted_skills[:-1]) + f" and {extracted_skills[-1]}"
                bot_response = f"Wow, you've been busy! Learning {skills_text} shows real dedication to your professional growth. These skills will definitely boost your career prospects! 🎆"
        else:
            # Encouraging response even when no skills detected
            encouraging_responses = [
                "Thanks for sharing! I'm here to help you track your learning journey. Feel free to tell me about any new skills, technologies, or courses you've been working on! 📚",
                "I love hearing about your progress! Whether it's coding, design, or any other skills, I'm here to help you map out your career path. What would you like to explore next? 🎯",
                "Your dedication to learning is inspiring! Keep me updated on any new technologies or skills you pick up - I'll help you see how they fit into your career growth! ✨",
                "Every learning step counts towards your goals! Feel free to share any courses, tutorials, or projects you're working on. I'm here to support your journey! 🌱"
            ]
            import random
            bot_response = random.choice(encouraging_responses)
        
        return {
            "extracted_skills": extracted_skills,
            "updated_skills": updated_skills,
            "bot_response": bot_response
        }
    
    def extract_skills_with_levels(self, message: str) -> Dict[str, Any]:
        """Extract skills and expertise levels from message using available AI services with fallbacks"""
        
        prompt = f"""
        Extract all new skills and expertise levels mentioned in this message: "{message}"
        
        Return a JSON array with the following structure:
        [
          {{"skill": "skill name", "expertise_level": "beginner/intermediate/advanced/expert"}},
          {{"skill": "skill name", "expertise_level": "beginner/intermediate/advanced/expert"}}
        ]
        
        Rules:
        1. Extract only actual technical skills, programming languages, tools, or professional competencies
        2. Infer the expertise level from context (if someone "learned" something = beginner, "worked with" = intermediate, "mastered" = advanced, etc.)
        3. If no level is mentioned, default to "beginner" for new learning, "intermediate" for general experience
        4. Return empty array if no skills are found
        5. Skills should be properly formatted (e.g., "JavaScript", "React", "Python", "SQL")
        """

        # Try Vertex AI first if available
        if self.vertex_ai_available and self.model:
            try:
                response = self.model.generate_content(prompt)
                response_text = response.text
                
                # Try to find JSON in the response
                start_idx = response_text.find('[')
                end_idx = response_text.rfind(']') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_str = response_text[start_idx:end_idx]
                    extracted_skills = json.loads(json_str)
                    print("✅ Extracted skills with levels using Vertex AI")
                    return {"extracted_skills": extracted_skills}
                    
            except Exception as e:
                print(f"Vertex AI skill level extraction failed: {e}")
        
        # Try fallback AI services
        ai_response = self._generate_with_fallback_ai(prompt)
        if ai_response:
            try:
                # Try to extract JSON from AI response
                start_idx = ai_response.find('[')
                end_idx = ai_response.rfind(']') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_str = ai_response[start_idx:end_idx]
                    extracted_skills = json.loads(json_str)
                    return {"extracted_skills": extracted_skills}
            except Exception as e:
                print(f"Error parsing AI skill level extraction response: {e}")
        
        # Fallback to static extraction
        print("🎯 Using enhanced static skill level extraction")
        return self._extract_skills_fallback(message)
    
    def _extract_skills_fallback(self, message: str) -> Dict[str, Any]:
        """Fallback skill extraction when AI is not available"""
        # Common technical skills and tools to look for
        skill_patterns = {
            # Programming Languages
            'python': 'Python',
            'javascript': 'JavaScript',
            'java': 'Java',
            'c#': 'C#',
            'c++': 'C++',
            'typescript': 'TypeScript',
            'php': 'PHP',
            'ruby': 'Ruby',
            'go': 'Go',
            'rust': 'Rust',
            'swift': 'Swift',
            'kotlin': 'Kotlin',
            
            # Frontend Technologies
            'react': 'React',
            'vue': 'Vue.js',
            'angular': 'Angular',
            'html': 'HTML',
            'css': 'CSS',
            'bootstrap': 'Bootstrap',
            'tailwind': 'Tailwind CSS',
            'sass': 'SASS',
            'jquery': 'jQuery',
            
            # Backend Technologies
            'node.js': 'Node.js',
            'nodejs': 'Node.js',
            'express': 'Express.js',
            'django': 'Django',
            'flask': 'Flask',
            'spring': 'Spring',
            'laravel': 'Laravel',
            'rails': 'Ruby on Rails',
            
            # Databases
            'sql': 'SQL',
            'mysql': 'MySQL',
            'postgresql': 'PostgreSQL',
            'mongodb': 'MongoDB',
            'sqlite': 'SQLite',
            'redis': 'Redis',
            'firestore': 'Firestore',
            
            # DevOps and Tools
            'docker': 'Docker',
            'kubernetes': 'Kubernetes',
            'aws': 'AWS',
            'azure': 'Azure',
            'gcp': 'Google Cloud Platform',
            'git': 'Git',
            'jenkins': 'Jenkins',
            'terraform': 'Terraform',
            
            # Machine Learning / AI
            'machine learning': 'Machine Learning',
            'tensorflow': 'TensorFlow',
            'pytorch': 'PyTorch',
            'pandas': 'Pandas',
            'numpy': 'NumPy',
            'scikit-learn': 'Scikit-learn',
            
            # Other
            'api': 'API Development',
            'rest': 'REST APIs',
            'graphql': 'GraphQL',
            'microservices': 'Microservices',
            'agile': 'Agile',
            'scrum': 'Scrum'
        }
        
        message_lower = message.lower()
        extracted_skills = []
        
        # Look for skill mentions in the message
        for pattern, skill_name in skill_patterns.items():
            if pattern in message_lower:
                # Infer expertise level from context
                expertise_level = 'beginner'  # default
                
                if any(word in message_lower for word in ['expert', 'mastered', 'advanced', 'proficient']):
                    expertise_level = 'expert'
                elif any(word in message_lower for word in ['experienced', 'worked with', 'using', 'good at']):
                    expertise_level = 'intermediate'
                elif any(word in message_lower for word in ['learned', 'learning', 'started', 'new to']):
                    expertise_level = 'beginner'
                elif any(word in message_lower for word in ['improved', 'better', 'advanced']):
                    expertise_level = 'intermediate'
                    
                extracted_skills.append({
                    'skill': skill_name,
                    'expertise_level': expertise_level
                })
        
        # Remove duplicates
        seen = set()
        unique_skills = []
        for skill in extracted_skills:
            skill_key = skill['skill'].lower()
            if skill_key not in seen:
                seen.add(skill_key)
                unique_skills.append(skill)
        
        return {"extracted_skills": unique_skills}
