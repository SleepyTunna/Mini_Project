from fastapi import APIRouter, HTTPException, Depends
from models.schemas import ChatMessage, ChatResponse, User
from services.ai_service import AIService
from services.mock_user_service import user_service
from dependencies import get_current_user
from typing import Optional
import json

router = APIRouter(prefix="/chat", tags=["chat"])

# Move AIService initialization inside the function to ensure proper environment loading
# ai_service = AIService()  # This line will be removed

@router.post("/", response_model=ChatResponse)
async def chat_with_career_assistant(
    chat_message: ChatMessage,
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Interactive career guidance chat powered by Gemini AI.
    Provides personalized roadmap guidance based on user's current skills and goals.
    """
    # Initialize AIService inside the function to ensure environment variables are loaded
    ai_service = AIService()
    
    try:
        # Get user context
        user_skills = current_user.skills if current_user else ""
        user_expertise = current_user.expertise if current_user else "Beginner"
        user_name = current_user.full_name if current_user else "there"
        
        # Create context-aware prompt for personalized career mentorship
        career_guidance_prompt = f"""
You are "CareerMentor", an expert personal career coach and roadmap guide. You are having a one-on-one mentoring session with {user_name}.

CURRENT USER PROFILE:
- Name: {user_name}
- Skills: {user_skills or "Just starting their journey"}
- Experience: {user_expertise}
- Latest Question: "{chat_message.message}"

YOUR ROLE AS PERSONAL CAREER MENTOR:

🎯 **Primary Mission**: Guide {user_name} through their unique career journey with personalized, actionable roadmaps

📋 **Mentoring Style**:
- Act like a supportive career coach who knows {user_name} personally
- Provide specific, step-by-step action plans tailored to their current situation
- Create detailed learning roadmaps with timelines ("In the next 2 weeks...", "By month 3...")
- Give concrete next steps they can start TODAY
- Reference their existing skills and build upon them
- Ask probing questions to understand their goals deeper

💡 **Response Structure** (adapt based on their question):
1. **Personalized insight** about their current situation
2. **Immediate action steps** (next 1-2 weeks)
3. **Specific roadmap** with timeline and milestones
4. **Resources** (exact courses, tools, books with links when possible)
5. **One targeted follow-up question** to guide them further

🚫 **AVOID**:
- Generic career advice that could apply to anyone
- Vague suggestions without actionable steps
- Repeating the same advice
- Long lists without prioritization

✅ **EXAMPLE GOOD RESPONSE STYLE**:
"Hi {user_name}! Based on your {user_skills} skills and {user_expertise} experience, I can see you're ready for [specific next step]. Here's your personalized 90-day roadmap...

**Week 1-2**: [Specific actions]
**Month 1**: [Milestone]
**Month 2-3**: [Advanced steps]

I recommend starting with [specific resource] because it aligns perfectly with your current skill level. 

What specific aspect of [related to their question] would you like to focus on first?"

Remember: You're their dedicated career mentor who cares about their success and provides personalized guidance, not generic advice."""
        
        # Get AI response
        ai_response = ai_service._generate_with_fallback_ai(career_guidance_prompt)
        
        if not ai_response:
            # Enhanced personalized fallback with user context
            ai_response = f"""Hi {user_name}! 🚀 I'm your dedicated Career Mentor, and I'm here to guide you on your unique journey.
            
📋 **Your Current Profile:**
• Skills: {user_skills or "Let's identify your strengths together!"}
• Experience: {user_expertise}
• Goal: Understanding what you want to achieve next
            
🎯 **Your Personalized Action Plan:**
            
**IMMEDIATE NEXT STEPS (This Week):**
1. 📝 Complete a skills gap analysis for your target role
2. 📚 Set aside 1 hour daily for focused learning
3. 🌍 Research 3 companies in your field of interest
            
**30-DAY ROADMAP:**
• Week 1-2: Deep dive into industry trends and requirements
• Week 3-4: Start building a portfolio project or case study
            
**90-DAY VISION:**
• Month 2: Complete relevant certification or course
• Month 3: Network with 5 professionals in your target field
            
💡 **Quick Start Question:** What's the specific career goal or challenge you'd like me to help you tackle right now? 

For example:
• "I want to transition from {user_skills.split(',')[0] if user_skills else 'my current role'} to [target role]"
• "I need to level up my skills in [specific area]"
• "I'm unsure about my next career move"
            
Let's create your personalized roadmap together! 🚪"""
        
        # Check if message contains skills for extraction
        extracted_skills = []
        updated_skills = user_skills or ""
        
        if any(keyword in chat_message.message.lower() for keyword in ['learned', 'learning', 'studying', 'know', 'experience', 'worked with', 'using']):
            skill_extraction = ai_service.extract_skills_from_message(chat_message.message, user_skills or "")
            extracted_skills = skill_extraction.get("extracted_skills", [])
            updated_skills = skill_extraction.get("updated_skills", user_skills or "")
            
            # Update user skills if new skills found
            if current_user and extracted_skills:
                try:
                    from models.schemas import UserUpdate
                    user_update = UserUpdate(skills=updated_skills)
                    await user_service.update_user(current_user.id, user_update)
                    ai_response += f"\n\n✨ Great! I've noted that you have experience with: {', '.join([skill['skill'] for skill in extracted_skills])}. This opens up new opportunities for you!"
                except Exception as e:
                    print(f"Error updating user skills: {e}")
        
        return ChatResponse(
            bot_message=ai_response,
            extracted_skills=extracted_skills,
            updated_skills=updated_skills,
            user=current_user
        )
        
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Sorry, I'm having trouble connecting right now. Please try again!"
        )

@router.post("/update-skills", response_model=ChatResponse)
async def update_skills_via_chat(
    chat_message: ChatMessage,
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Legacy endpoint - redirects to main chat endpoint
    """
    return await chat_with_career_assistant(chat_message, current_user)