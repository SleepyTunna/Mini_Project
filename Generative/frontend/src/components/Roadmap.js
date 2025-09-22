import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { careerAPI } from '../services/api';

const Roadmap = () => {
  const [showYouTubeVideos, setShowYouTubeVideos] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('programming');
  const [careerPaths, setCareerPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
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
    ai: 'artificial intelligence machine learning deep learning',
    game: 'game development unity unreal engine tutorial',
    design: 'UI UX design tools figma adobe xd'
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
          thumbnail: "https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Web+Dev+2024",
          url: "https://youtube.com/watch?v=programming1"
        },
        {
          title: "Python Programming Full Course - Learn Python in 12 Hours",
          channel: "FreeCodeCamp",
          duration: "12:08:42",
          views: "15.2M views",
          thumbnail: "https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Python+Course",
          url: "https://youtube.com/watch?v=programming2"
        },
        {
          title: "JavaScript Crash Course For Beginners - Complete Tutorial",
          channel: "Traversy Media",
          duration: "1:40:17",
          views: "4.1M views",
          thumbnail: "https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=JavaScript",
          url: "https://youtube.com/watch?v=programming3"
        }
      ],
      frontend: [
        {
          title: "React.js Full Course 2024 - Build 4 Projects",
          channel: "JavaScript Mastery",
          duration: "8:25:43",
          views: "3.2M views",
          thumbnail: "https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=React+2024",
          url: "https://youtube.com/watch?v=frontend1"
        },
        {
          title: "CSS Grid & Flexbox for Responsive Web Design",
          channel: "Kevin Powell",
          duration: "2:15:20",
          views: "1.8M views",
          thumbnail: "https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=CSS+Grid",
          url: "https://youtube.com/watch?v=frontend2"
        },
        {
          title: "Vue.js 3 Crash Course - Build a Complete App",
          channel: "Net Ninja",
          duration: "3:30:15",
          views: "950K views",
          thumbnail: "https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Vue.js+3",
          url: "https://youtube.com/watch?v=frontend3"
        }
      ],
      backend: [
        {
          title: "Node.js & Express.js Full Course - REST API Tutorial",
          channel: "Programming with Mosh",
          duration: "5:12:30",
          views: "2.1M views",
          thumbnail: "https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Node.js+API",
          url: "https://youtube.com/watch?v=backend1"
        },
        {
          title: "Django Python Web Framework - Full Course for Beginners",
          channel: "FreeCodeCamp",
          duration: "4:20:17",
          views: "1.9M views",
          thumbnail: "https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Django+Course",
          url: "https://youtube.com/watch?v=backend2"
        },
        {
          title: "PostgreSQL Database Tutorial - Complete Course",
          channel: "Database Star",
          duration: "3:45:22",
          views: "850K views",
          thumbnail: "https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=PostgreSQL",
          url: "https://youtube.com/watch?v=backend3"
        }
      ],
      game: [
        {
          title: "Unity Game Development Full Course - Beginner to Pro",
          channel: "Brackeys",
          duration: "6:45:30",
          views: "4.2M views",
          thumbnail: "https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Unity+Course",
          url: "https://youtube.com/watch?v=game1"
        },
        {
          title: "Unreal Engine 5 Tutorial - Beginner to Advanced",
          channel: "Virtus Learning Hub",
          duration: "8:20:15",
          views: "1.5M views",
          thumbnail: "https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Unreal+Engine",
          url: "https://youtube.com/watch?v=game2"
        },
        {
          title: "Blender 3D Modeling Tutorial for Beginners",
          channel: "Blender Guru",
          duration: "3:15:40",
          views: "2.8M views",
          thumbnail: "https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Blender+Tutorial",
          url: "https://youtube.com/watch?v=game3"
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
      // Use the custom YouTube API endpoint
      const response = await fetch(`https://abhi-api.vercel.app/api/search/yts?text=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000 // 15 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.results && data.results.length > 0) {
          // Process and filter videos
          const processedVideos = data.results
            .filter(video => video.title && video.title.length > 10) // Filter out short titles
            .map(video => ({
              ...video,
              // Ensure all required fields are present
              title: video.title || 'Untitled Video',
              channel: video.channel || 'Unknown Channel',
              duration: video.duration || 'Unknown Duration',
              views: video.views || 'Unknown Views',
              thumbnail: video.thumbnail || 'https://via.placeholder.com/320x180?text=No+Thumbnail',
              url: video.url || '#'
            }))
            .slice(0, 9); // Get up to 9 videos
          
          console.log('Found YouTube videos:', processedVideos.length);
          setYoutubeVideos(processedVideos);
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

  // Fetch career analysis when component mounts or when skills/expertise change
  useEffect(() => {
    const fetchCareerAnalysis = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get skills and expertise from context or use defaults
        const skills = currentSkills || analysisResult?.skills || user?.skills || 'programming';
        const expertise = currentExpertise || analysisResult?.expertise || user?.expertise || 'beginner';
        
        // Call the career analysis API
        const result = await careerAPI.analyzeCareer(skills, expertise);
        
        // Update state with the results
        if (result.career_paths) {
          setCareerPaths(result.career_paths);
        }
        
        if (result.selected_path) {
          setSelectedPath(result.selected_path);
        }
        
        if (result.roadmap) {
          setRoadmap(result.roadmap);
        }
        
        if (result.courses) {
          setCourses(result.courses);
        }
      } catch (err) {
        console.error('Error fetching career analysis:', err);
        setError('Failed to load career analysis. Using demo data.');
        
        // Set demo data on error
        setCareerPaths([
          {
            title: "Software Developer",
            description: "Build applications and systems using programming languages",
            required_skills: ["JavaScript", "Python", "React", "Node.js"],
            salary_range: "₹49.80 lakhs - ₹99.60 lakhs",
            growth_prospect: "High - Technology sector continues to grow rapidly"
          },
          {
            title: "Data Scientist",
            description: "Analyze complex data to help organizations make informed decisions",
            required_skills: ["Python", "R", "SQL", "Machine Learning"],
            salary_range: "₹60.50 lakhs - ₹120.40 lakhs",
            growth_prospect: "Very High - Data-driven decision making is crucial"
          },
          {
            title: "DevOps Engineer",
            description: "Bridge development and operations to improve deployment processes",
            required_skills: ["Docker", "Kubernetes", "CI/CD", "Cloud Platforms"],
            salary_range: "₹55.30 lakhs - ₹110.20 lakhs",
            growth_prospect: "Very High - Critical for modern software delivery"
          }
        ]);
        
        setSelectedPath({
          title: "Software Developer",
          description: "Build applications and systems using programming languages",
          required_skills: ["JavaScript", "Python", "React", "Node.js"],
          salary_range: "₹49.80 lakhs - ₹99.60 lakhs",
          growth_prospect: "High - Technology sector continues to grow rapidly"
        });
        
        setRoadmap([
          {
            step: 1,
            title: "Skill Assessment and Gap Analysis",
            description: "Evaluate your current skills and identify areas for improvement",
            duration: "2-4 weeks",
            resources: ["Online assessments", "Portfolio review", "Industry research"]
          },
          {
            step: 2,
            title: "Learn Core Technologies",
            description: "Master the fundamental technologies for your chosen career path",
            duration: "3-6 months",
            resources: ["Online courses", "Documentation", "Practice projects"]
          },
          {
            step: 3,
            title: "Build Portfolio Projects",
            description: "Create impressive projects that demonstrate your skills to employers",
            duration: "2-4 months",
            resources: ["GitHub", "Personal website", "Case studies"]
          },
          {
            step: 4,
            title: "Network and Gain Experience",
            description: "Connect with professionals and gain real-world experience",
            duration: "3-6 months",
            resources: ["LinkedIn", "Tech meetups", "Open source contributions", "Internships"]
          },
          {
            step: 5,
            title: "Job Search and Interview Preparation",
            description: "Prepare for interviews and start applying to positions",
            duration: "1-3 months",
            resources: ["Interview practice", "Resume optimization", "Job boards", "Referrals"]
          }
        ]);
        
        setCourses([
          {
            title: "The Complete Web Developer Course",
            provider: "Udemy",
            duration: "12 weeks",
            difficulty: "Beginner",
            url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/"
          },
          {
            title: "CS50's Introduction to Computer Science",
            provider: "Harvard (edX)",
            duration: "10 weeks",
            difficulty: "Beginner",
            url: "https://www.edx.org/course/introduction-computer-science-harvardx-cs50x"
          },
          {
            title: "Python for Everybody Specialization",
            provider: "University of Michigan (Coursera)",
            duration: "8 weeks",
            difficulty: "Beginner",
            url: "https://www.coursera.org/specializations/python"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCareerAnalysis();
  }, [currentSkills, currentExpertise, analysisResult, user]);

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
    // Changed from dark mode to light mode
    <section className="py-16 professional-background">
      <div className="floating-elements">
        <div className="float-1"></div>
        <div className="float-2"></div>
        <div className="float-3"></div>
      </div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          // Updated text colors for light mode
          <h2 className="text-4xl font-bold mb-4 text-gray-800 professional-heading">Your Career Journey</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto professional-text">
            Follow our proven roadmap to accelerate your career growth in <span className="font-semibold text-indigo-600">{currentSkills ? currentSkills.split(',')[0].trim() : 'your chosen field'}</span>
          </p>
          {currentExpertise && (
            <p className="text-gray-500 mt-2 professional-text">Tailored for {currentExpertise} level professionals</p>
          )}
        </div>
        
        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Analyzing your career path...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-triangle text-yellow-400"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Career Paths Section */}
        {!loading && careerPaths.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 professional-heading">Career Paths</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {careerPaths.map((path, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                    selectedPath && selectedPath.title === path.title 
                      ? 'border-indigo-500 ring-2 ring-indigo-200' 
                      : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedPath(path)}
                >
                  <h4 className="text-xl font-semibold mb-2 text-gray-800">{path.title}</h4>
                  <p className="text-gray-600 mb-4">{path.description}</p>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Required Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {path.required_skills.slice(0, 4).map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-600">{path.salary_range}</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {path.growth_prospect.split(' - ')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Selected Career Path Details */}
        {selectedPath && (
          <div className="mb-12 bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Selected Path: {selectedPath.title}</h3>
            <p className="text-gray-600 mb-6">{selectedPath.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-800">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPath.required_skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-800">Prospects</h4>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Salary Range:</span> {selectedPath.salary_range}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Growth:</span> {selectedPath.growth_prospect}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Roadmap Section */}
        {!loading && roadmap.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 professional-heading">Learning Roadmap</h3>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-200 transform translate-x-1/2"></div>
              
              <div className="space-y-8">
                {roadmap.map((step, index) => (
                  <div key={step.step} className="relative flex">
                    {/* Step indicator */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold z-10">
                      {step.step}
                    </div>
                    
                    {/* Step content */}
                    <div className="ml-6 flex-grow bg-white rounded-lg shadow-md p-6 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xl font-semibold text-gray-800">{step.title}</h4>
                        <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                          {step.duration}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">{step.description}</p>
                      
                      {step.resources && step.resources.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium text-gray-700 mb-2">Resources:</h5>
                          <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {step.resources.map((resource, resIndex) => (
                              <li key={resIndex}>{resource}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Courses Section */}
        {!loading && courses.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 professional-heading">Recommended Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="p-6">
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">{course.title}</h4>
                    <p className="text-gray-600 mb-4">{course.provider}</p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {course.difficulty}
                      </span>
                      <span className="text-sm text-gray-500">{course.duration}</span>
                    </div>
                    
                    <a 
                      href={course.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      View Course
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roadmapSteps.map((step, index) => (
            <div 
              key={step.id}
              className={`enhanced-card rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-200 ${
                step.status === 'completed' ? 'border-l-4 border-green-500' : 
                step.status === 'current' ? 'border-l-4 border-indigo-500' : 
                'border-l-4 border-gray-300'
              }`}
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              // Updated text colors for light mode
              <h3 className="text-xl font-semibold mb-3 text-gray-800 professional-subheading">{step.title}</h3>
              <p className="text-gray-600 mb-4 professional-text">{step.description}</p>
              
              {/* Enhanced YouTube Integration with User Skills */}
              {step.isYouTube && (
                <div className="mb-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => searchYouTubeVideos('programming', analysisResult?.skills || user?.skills)}
                      disabled={loadingVideos}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors duration-200 text-sm professional-button"
                    >
                      <i className="fab fa-youtube"></i>
                      <span>{loadingVideos ? 'Loading...' : 'Your Skills'}</span>
                    </button>
                    
                    <button
                      onClick={() => searchYouTubeVideos('frontend', analysisResult?.skills || user?.skills)}
                      disabled={loadingVideos}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors duration-200 text-sm professional-button"
                    >
                      <i className="fab fa-youtube"></i>
                      <span>Frontend</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => searchYouTubeVideos('backend', analysisResult?.skills || user?.skills)}
                      disabled={loadingVideos}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors duration-200 text-sm professional-button"
                    >
                      <i className="fab fa-youtube"></i>
                      <span>Backend</span>
                    </button>
                    
                    <button
                      onClick={() => searchYouTubeVideos('game', analysisResult?.skills || user?.skills)}
                      disabled={loadingVideos}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors duration-200 text-sm professional-button"
                    >
                      <i className="fab fa-youtube"></i>
                      <span>Game Dev</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => searchYouTubeVideos('datascience', analysisResult?.skills || user?.skills)}
                      disabled={loadingVideos}
                      className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors duration-200 text-sm professional-button"
                    >
                      <i className="fab fa-youtube"></i>
                      <span>Data Science</span>
                    </button>
                    
                    <button
                      onClick={() => searchYouTubeVideos('design', analysisResult?.skills || user?.skills)}
                      disabled={loadingVideos}
                      className="bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors duration-200 text-sm professional-button"
                    >
                      <i className="fab fa-youtube"></i>
                      <span>Design</span>
                    </button>
                  </div>
                  
                  {(analysisResult?.skills || currentSkills || user?.skills) && (
                    <div className="text-xs text-gray-500 mt-2 professional-text">
                      💡 Searching based on your skills: {(analysisResult?.skills || currentSkills || user?.skills)?.split(',').slice(0, 3).join(', ')}
                    </div>
                  )}
                </div>
              )}
              
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                step.status === 'completed' ? 'bg-green-100 text-green-800' :
                step.status === 'current' ? 'bg-indigo-100 text-indigo-800' :
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
              // Updated text colors for light mode
              <h3 className="text-3xl font-bold mb-4 text-gray-800 professional-heading">📺 Recommended Study Videos - {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h3>
              <p className="text-lg text-gray-600 professional-text">Curated YouTube content to accelerate your learning journey</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {youtubeVideos.map((video, index) => (
                // Updated card styling for light mode
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 professional-card border border-gray-200">
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
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 professional-button"
                      >
                        <i className="fab fa-youtube"></i>
                        <span>Watch Now</span>
                      </a>
                    </div>
                  </div>
                  <div className="p-4">
                    // Updated text colors for light mode
                    <h4 className="text-lg font-semibold mb-2 text-gray-800 professional-subheading line-clamp-2">
                      {video.title || 'Study Video'}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2 professional-text">
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
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors duration-200 professional-button"
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