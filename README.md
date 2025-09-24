# 🚀 TourGuide - AI-Powered Career Guidance Platform

A comprehensive career guidance platform that uses **Google Gemini AI** to provide personalized career mentorship, roadmap planning, and skill development guidance.

![Career Guidance Platform](https://img.shields.io/badge/AI-Powered-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green) ![React](https://img.shields.io/badge/React-Frontend-blue) ![Google Gemini](https://img.shields.io/badge/Google-Gemini_AI-orange)

## ✨ Features

### 🤖 **AI-Powered Career Mentor**
- **Personalized Roadmaps**: Get custom career paths based on your current skills and goals
- **Context-Aware Guidance**: AI remembers your background and provides tailored advice
- **Actionable Steps**: Receive specific, time-bound action plans (weekly/monthly milestones)
- **Interactive Chat**: Real-time conversation with your personal career assistant
- **Friendly AI Guide**: Conversational AI that acts like a supportive mentor with encouraging language

### 🎯 **Core Capabilities**
- **Career Analysis**: Comprehensive skill assessment and career path recommendations
- **Skill Extraction**: Automatically identify and track your growing skill set
- **Mock Tests**: Personalized quizzes based on your expertise level
- **Industry-Specific Guidance**: Tailored advice for different tech and medical domains
- **Enhanced Medical Domains**: Comprehensive coverage of 12 medical specializations with detailed career paths
- **Educational Resources**: YouTube videos and Google Books recommendations

### 🛠️ **Technology Stack**
- **Backend**: FastAPI (Python 3.13)
- **Frontend**: React with Tailwind CSS
- **AI Integration**: Google Gemini API
- **Authentication**: JWT-based user management
- **Database**: Mock user service (easily extensible to real databases)

## 🚀 Quick Start

### Prerequisites
- Python 3.13+
- Node.js 16+
- Google Gemini API Key
- Google Books API Key (optional but recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-career-guidance.git
cd ai-career-guidance
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd Generative

# Create virtual environment
python -m venv ../.venv

# Activate virtual environment
# On Windows:
..\.venv\Scripts\activate
# On macOS/Linux:
source ../.venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create .env file and add your API keys:
echo "GOOGLE_GENAI_API_KEY=your_gemini_api_key_here" > .env
echo "REACT_APP_GOOGLE_BOOKS_API_KEY=your_google_books_api_key_here" >> .env

# Run the backend server
python main.py
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🎯 Usage Examples

### Career Transition Query
```
"I'm a marketing professional wanting to transition into data science. 
What's my learning roadmap?"
```

**AI Response**: Provides a detailed 6-month roadmap with:
- Month 1: Python fundamentals & statistics
- Month 2: Data manipulation with Pandas
- Month 3: Machine learning basics
- Specific resources, videos, and books

### Medical Specialization Query
```
"I'm interested in becoming a pediatrician. What steps should I take?"
```

**AI Response**: Provides a detailed roadmap for medical specialization with:
- Pre-medical education requirements
- Medical school preparation
- Residency and specialization paths
- Licensing and certification information
- Recommended textbooks and resources

### Skill Building Query
```
"I know Python basics. What should I learn next for web development?"
```

**AI Response**: Tailored guidance based on current skill level with specific next steps, project recommendations, video tutorials, and book suggestions.

## 🔧 API Endpoints

### Core Endpoints
- `POST /chat/` - Interactive career guidance chat
- `POST /analyze` - Comprehensive career analysis
- `POST /mock-test` - Generate personalized skill assessments
- `GET /health` - Service health check

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `POST /auth/logout` - User logout

## 🤖 AI Integration

The platform uses **Google Gemini AI** to provide:

1. **Contextual Understanding**: Analyzes user background and goals
2. **Personalized Responses**: Tailors advice to individual circumstances
3. **Structured Roadmaps**: Creates step-by-step learning plans
4. **Follow-up Questions**: Guides users to provide more specific information
5. **Friendly Tone**: Conversational responses that encourage and support users

### AI Configuration
```python
# Environment variables required
GOOGLE_GENAI_API_KEY=your_gemini_api_key
REACT_APP_GOOGLE_BOOKS_API_KEY=your_google_books_api_key

# The system automatically:
# - Initializes Gemini AI with your API key
# - Integrates Google Books API for educational content
# - Provides intelligent fallbacks if AI is unavailable
# - Maintains conversation context
```

## 📁 Project Structure

```
├── Generative/                 # Backend (FastAPI)
│   ├── main.py                # Application entry point
│   ├── routes/                # API route handlers
│   │   ├── auth.py           # Authentication endpoints
│   │   ├── chat.py           # Career guidance chat
│   │   └── career.py         # Career analysis endpoints
│   ├── services/              # Business logic
│   │   ├── ai_service.py     # Google Gemini AI integration
│   │   ├── auth_service.py   # Authentication logic
│   │   └── mock_user_service.py # User management
│   ├── models/                # Data models
│   └── dependencies.py       # FastAPI dependencies
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ChatBot.js   # AI chat interface
│   │   │   ├── Dashboard.js # Main dashboard
│   │   │   └── Auth/        # Authentication components
│   │   ├── services/        # API communication
│   │   └── context/         # React context
│   └── public/              # Static assets
│
└── .env                       # Environment variables
```

## 🎨 Features Showcase

### 💬 **Interactive Chat Interface**
- Real-time typing indicators
- Message history
- Quick action buttons
- Skill extraction notifications
- Friendly, encouraging AI responses

### 📊 **Career Analysis Dashboard**
- Comprehensive skill assessment
- Multiple career path suggestions
- Salary range information (INR/USD)
- Growth prospect indicators
- Medical specialization options

### 🎯 **Personalized Learning Paths**
- Custom roadmaps based on experience level
- Specific resource recommendations (videos and books)
- Timeline-based milestones
- Progress tracking capabilities

### 📚 **Educational Resources**
- YouTube video recommendations based on your skills
- Google Books recommendations for deeper learning
- Curated courses and tutorials
- Interactive flowcharts for visual learning

## 🔄 **Beginner's Guide to Using the Platform**

### Step 1: Getting Started
1. Open the application in your browser (http://localhost:3000)
2. You'll see a friendly welcome screen with options to select your career category

### Step 2: Choose Your Path
1. Select between **Engineering** or **Medical** fields
2. Choose your specific field (e.g., Software Engineering, Pediatrics)
3. Pick a specialization (e.g., Web Development, Child Psychology)

### Step 3: Explore Your Roadmap
1. After selecting your path, you'll see a personalized learning roadmap
2. Each step includes:
   - Clear learning objectives
   - Estimated time to complete
   - Recommended resources (videos and books)

### Step 4: Access Learning Resources
1. Click "Find Videos" to get YouTube recommendations
2. Click "Find Books" to get book recommendations
3. All resources are tailored to your selected skills

### Step 5: Chat with Your AI Mentor
1. Use the chat icon in the bottom right to talk to your AI mentor
2. Ask questions about your career path, learning resources, or next steps
3. Get personalized advice and encouragement

### Step 6: Visualize Your Progress
1. Visit the Flowchart page to see a visual representation of your learning path
2. Track your progress through each step
3. Adjust your path as needed based on your interests

## 🔒 Security Features

- JWT-based authentication
- Secure API key management
- Input validation and sanitization
- CORS configuration for frontend integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful AI capabilities
- **Google Books API** for educational content
- **FastAPI** for the excellent Python web framework
- **React** for the responsive frontend framework
- **Tailwind CSS** for beautiful, utility-first styling

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the [API Documentation](http://localhost:8000/docs)
- Review the example usage in the code

---

**Made with ❤️ using Google Gemini AI, FastAPI, and React**