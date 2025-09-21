import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Roadmap = () => {
  const [showYouTubeVideos, setShowYouTubeVideos] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('programming');
  
  // Get user context to access their skills
  const { user, analysisResult, currentSkills, currentExpertise } = useAppContext();

  // Enhanced search categories for better YouTube results
  const searchCategories = {
    programming: 'programming tutorials web development',
    frontend: 'frontend development react javascript css',
    backend: 'backend development node.js python django',
    fullstack: 'full stack development MERN MEAN tutorial',
    datascience: 'data science machine learning python pandas',
    mobile: 'mobile app development react native flutter',
    devops: 'devops docker kubernetes ci cd deployment',
    ai: 'artificial intelligence machine learning deep learning'
  };

  // Enhanced demo data with more realistic content
  const getDemoVideos = (category) => {
    const demoData = {
      programming: [
        {
          title: "Complete Web Development Bootcamp 2024 - HTML, CSS, JavaScript, React",
          channel: "The Complete Web Developer Course",
          duration: "42:15:30",
          views: "2.8M views",
          thumbnail: "https://via.placeholder.com/320x180/FF0000/FFFFFF?text=Web+Dev+2024",
          url: "https://youtube.com/watch?v=programming1"
        },
        {
          title: "Python Programming Full Course - Learn Python in 12 Hours",
          channel: "FreeCodeCamp",
          duration: "12:08:42",
          views: "15.2M views",
          thumbnail: "https://via.placeholder.com/320x180/306998/FFFFFF?text=Python+Course",
          url: "https://youtube.com/watch?v=programming2"
        },
        {
          title: "JavaScript Crash Course For Beginners - Complete Tutorial",
          channel: "Traversy Media",
          duration: "1:40:17",
          views: "4.1M views",
          thumbnail: "https://via.placeholder.com/320x180/F7DF1E/000000?text=JavaScript",
          url: "https://youtube.com/watch?v=programming3"
        }
      ],
      frontend: [
        {
          title: "React.js Full Course 2024 - Build 4 Projects",
          channel: "JavaScript Mastery",
          duration: "8:25:43",
          views: "3.2M views",
          thumbnail: "https://via.placeholder.com/320x180/61DAFB/000000?text=React+2024",
          url: "https://youtube.com/watch?v=frontend1"
        },
        {
          title: "CSS Grid & Flexbox for Responsive Web Design",
          channel: "Kevin Powell",
          duration: "2:15:20",
          views: "1.8M views",
          thumbnail: "https://via.placeholder.com/320x180/1572B6/FFFFFF?text=CSS+Grid",
          url: "https://youtube.com/watch?v=frontend2"
        },
        {
          title: "Vue.js 3 Crash Course - Build a Complete App",
          channel: "Net Ninja",
          duration: "3:30:15",
          views: "950K views",
          thumbnail: "https://via.placeholder.com/320x180/4FC08D/FFFFFF?text=Vue.js+3",
          url: "https://youtube.com/watch?v=frontend3"
        }
      ],
      backend: [
        {
          title: "Node.js & Express.js Full Course - REST API Tutorial",
          channel: "Programming with Mosh",
          duration: "5:12:30",
          views: "2.1M views",
          thumbnail: "https://via.placeholder.com/320x180/339933/FFFFFF?text=Node.js+API",
          url: "https://youtube.com/watch?v=backend1"
        },
        {
          title: "Django Python Web Framework - Full Course for Beginners",
          channel: "FreeCodeCamp",
          duration: "4:20:17",
          views: "1.9M views",
          thumbnail: "https://via.placeholder.com/320x180/092E20/FFFFFF?text=Django+Course",
          url: "https://youtube.com/watch?v=backend2"
        },
        {
          title: "PostgreSQL Database Tutorial - Complete Course",
          channel: "Database Star",
          duration: "3:45:22",
          views: "850K views",
          thumbnail: "https://via.placeholder.com/320x180/336791/FFFFFF?text=PostgreSQL",
          url: "https://youtube.com/watch?v=backend3"
        }
      ]
    };
    
    return demoData[category] || demoData.programming;
  };

  // Enhanced function to search YouTube videos based on user's actual skills
  const searchYouTubeVideos = async (category = 'programming', userSkills = '') => {
    setLoadingVideos(true);
    setSelectedCategory(category);
    
    // Create search term based on user's actual skills or category
    let searchTerm;
    if (userSkills && userSkills.trim()) {
      // Use user's actual skills for more relevant results
      searchTerm = userSkills.split(',').slice(0, 3).join(' ').trim();
    } else if (analysisResult && analysisResult.skills) {
      // Use skills from analysis result if available
      searchTerm = analysisResult.skills.split(',').slice(0, 3).join(' ').trim();
    } else {
      // Fallback to category-based search
      searchTerm = searchCategories[category] || searchCategories.programming;
    }
    
    console.log('Searching YouTube for:', searchTerm);
    
    try {
      const response = await fetch(`https://abhi-api.vercel.app/api/search/yts?text=${encodeURIComponent(searchTerm)}`, {
        timeout: 10000 // 10 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.results && data.results.length > 0) {
          // Enhanced filtering and sorting
          const filteredVideos = data.results
            .filter(video => video.title && video.title.length > 10) // Filter out short titles
            .slice(0, 9); // Get more videos (9 instead of 6)
          
          console.log('Found YouTube videos:', filteredVideos.length);
          setYoutubeVideos(filteredVideos);
          setShowYouTubeVideos(true);
          return;
        }
      }
      
      // Enhanced fallback to category-specific demo data
      console.log(`YouTube API unavailable for ${category}, using demo data`);
      setYoutubeVideos(getDemoVideos(category));
      setShowYouTubeVideos(true);
      
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      // Show category-specific demo videos on error
      setYoutubeVideos(getDemoVideos(category));
      setShowYouTubeVideos(true);
    } finally {
      setLoadingVideos(false);
    }
  };
  const roadmapSteps = [
    {
      id: 1,
      title: "Skill Assessment",
      description: "Take our comprehensive assessment to identify your current skills and knowledge gaps.",
      icon: "📊",
      status: "completed"
    },
    {
      id: 2,
      title: "Career Path Selection",
      description: "Choose from AI-recommended career paths based on your skills and interests.",
      icon: "🎯",
      status: "current"
    },
    {
      id: 3,
      title: "YouTube Studies",
      description: "Discover curated YouTube videos and tutorials for your learning path.",
      icon: "📺",
      status: "upcoming",
      isYouTube: true
    },
    {
      id: 4,
      title: "Learning Plan",
      description: "Get a personalized learning roadmap with courses and resources.",
      icon: "📚",
      status: "upcoming"
    },
    {
      id: 5,
      title: "Skill Development",
      description: "Complete courses and hands-on projects to build required skills.",
      icon: "💪",
      status: "upcoming"
    },
    {
      id: 6,
      title: "Mock Interviews",
      description: "Practice with AI-powered mock interviews and get feedback.",
      icon: "🎤",
      status: "upcoming"
    },
    {
      id: 7,
      title: "Career Success",
      description: "Land your dream job with confidence and the right skills.",
      icon: "🏆",
      status: "upcoming"
    }
  ];

  return (
    <section className="py-16 bg-gray-50 wavy-background">
      <div className="floating-elements">
        <div className="float-1"></div>
        <div className="float-2"></div>
        <div className="float-3"></div>
      </div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Your Career Journey</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Follow our proven roadmap to accelerate your career growth in <span className="font-semibold text-indigo-600">{currentSkills ? currentSkills.split(',')[0].trim() : 'your chosen field'}</span>
          </p>
          {currentExpertise && (
            <p className="text-gray-500 mt-2">Tailored for {currentExpertise} level professionals</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roadmapSteps.map((step, index) => (
            <div 
              key={step.id}
              className={`enhanced-card rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100 ${
                step.status === 'completed' ? 'border-l-4 border-green-500' : 
                step.status === 'current' ? 'border-l-4 border-blue-500' : 
                'border-l-4 border-gray-300'
              }`}
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
              <p className="text-gray-600 mb-4">{step.description}</p>
              
              {/* Enhanced YouTube Integration with User Skills */}
              {step.isYouTube && (
                <div className="mb-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => searchYouTubeVideos('programming', analysisResult?.skills || user?.skills)}
                      disabled={loadingVideos}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors duration-200 text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <span>{loadingVideos ? 'Loading...' : 'Your Skills'}</span>
                    </button>
                    
                    <button
                      onClick={() => searchYouTubeVideos('frontend', analysisResult?.skills || user?.skills)}
                      disabled={loadingVideos}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors duration-200 text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span>Frontend</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => searchYouTubeVideos('backend', analysisResult?.skills || user?.skills)}
                      disabled={loadingVideos}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors duration-200 text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                      </svg>
                      <span>Backend</span>
                    </button>
                    
                    <button
                      onClick={() => searchYouTubeVideos('fullstack', analysisResult?.skills || user?.skills)}
                      disabled={loadingVideos}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors duration-200 text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z"/>
                      </svg>
                      <span>Full Stack</span>
                    </button>
                  </div>
                  
                  {(analysisResult?.skills || currentSkills || user?.skills) && (
                    <div className="text-xs text-gray-600 mt-2">
                      💡 Searching based on your skills: {(analysisResult?.skills || currentSkills || user?.skills)?.split(',').slice(0, 3).join(', ')}
                    </div>
                  )}
                </div>
              )}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                step.status === 'completed' ? 'bg-green-100 text-green-800' :
                step.status === 'current' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {step.status === 'completed' ? '✓ Completed' :
                 step.status === 'current' ? '→ Current Step' :
                 '○ Upcoming'}
              </div>
            </div>
          ))}
        </div>
        
        {/* YouTube Videos Section */}
        {showYouTubeVideos && (
          <div className="mt-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4 text-gray-900">📺 Recommended Study Videos - {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h3>
              <p className="text-lg text-gray-600">Curated YouTube content to accelerate your learning journey</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {youtubeVideos.map((video, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src={video.thumbnail || 'https://via.placeholder.com/320x180?text=Video'} 
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <a 
                        href={video.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        <span>Watch Now</span>
                      </a>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2">
                      {video.title || 'Study Video'}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {video.channel || 'Educational Channel'}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{video.duration || 'Duration not specified'}</span>
                      <span>{video.views || 'View count unavailable'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <button
                onClick={() => setShowYouTubeVideos(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Hide Videos
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Roadmap;