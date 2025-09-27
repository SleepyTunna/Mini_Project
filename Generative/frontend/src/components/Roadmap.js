import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { careerAPI } from '../services/api';
import TourGuide from './TourGuide';

const Roadmap = () => {
  const [showYouTubeVideos, setShowYouTubeVideos] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [showBooks, setShowBooks] = useState(false);
  const [books, setBooks] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('programming');
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

  // Function to search books using Google Books API
  const searchBooks = async (category = 'programming', userSkills = '') => {
    setLoadingBooks(true);
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
    
    console.log('Searching Books for:', searchTerm);
    
    try {
      // Use the Google Books API
      const GOOGLE_BOOKS_API_KEY = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY || 'AIzaSyAytoNZiRTkprioNLhFVd9sUmAkn-RVyMg';
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm + ' course')}&maxResults=9&key=${GOOGLE_BOOKS_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.items && data.items.length > 0) {
          // Process Google Books API response
          const processedBooks = data.items
            .filter(book => book.volumeInfo.title && book.volumeInfo.title.length > 5) // Filter out short titles
            .map(book => ({
              title: book.volumeInfo.title,
              authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
              description: book.volumeInfo.description ? book.volumeInfo.description.substring(0, 200) + '...' : 'No description available',
              thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x192?text=No+Cover',
              url: book.volumeInfo.infoLink || '#',
              publishedDate: book.volumeInfo.publishedDate || 'Unknown Date',
              pageCount: book.volumeInfo.pageCount || 'Unknown'
            }))
            .slice(0, 9); // Get up to 9 books
          
          console.log('Found books:', processedBooks.length);
          setBooks(processedBooks);
          setShowBooks(true);
          setShowYouTubeVideos(false); // Hide videos when showing books
          return;
        }
      }
      
      // Enhanced fallback to category-specific demo data
      console.log(`Books API unavailable for ${category}, using demo data`);
      setBooks(getDemoBooks(category));
      setShowBooks(true);
      setShowYouTubeVideos(false); // Hide videos when showing books
      
    } catch (error) {
      console.error('Error fetching books:', error);
      // Show category-specific demo books on error
      setBooks(getDemoBooks(category));
      setShowBooks(true);
      setShowYouTubeVideos(false); // Hide videos when showing books
    } finally {
      setLoadingBooks(false);
    }
  };

  // Enhanced demo data for books
  const getDemoBooks = (category) => {
    const demoData = {
      programming: [
        {
          title: "Clean Code: A Handbook of Agile Software Craftsmanship",
          authors: "Robert C. Martin",
          description: "Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees.",
          thumbnail: "https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=Clean+Code",
          url: "https://books.google.com",
          publishedDate: "2008",
          pageCount: "464"
        },
        {
          title: "You Don't Know JS",
          authors: "Kyle Simpson",
          description: "This is a series of books diving deep into the core mechanisms of the JavaScript language.",
          thumbnail: "https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=You+Dont+Know+JS",
          url: "https://books.google.com",
          publishedDate: "2019",
          pageCount: "278"
        },
        {
          title: "Design Patterns: Elements of Reusable Object-Oriented Software",
          authors: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
          description: "Capturing a wealth of experience about the design of object-oriented software.",
          thumbnail: "https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=Design+Patterns",
          url: "https://books.google.com",
          publishedDate: "1994",
          pageCount: "416"
        }
      ],
      frontend: [
        {
          title: "Learning React: A Hands-On Guide to Building Web Applications",
          authors: "Kirupa Chinnathambi",
          description: "Learn React with this hands-on guide that teaches you how to build React applications.",
          thumbnail: "https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=Learning+React",
          url: "https://books.google.com",
          publishedDate: "2019",
          pageCount: "400"
        },
        {
          title: "CSS Secrets: Better Solutions to Everyday Web Design Problems",
          authors: "Lea Verou",
          description: "In this practical guide, CSS expert Lea Verou provides 47 undocumented techniques.",
          thumbnail: "https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=CSS+Secrets",
          url: "https://books.google.com",
          publishedDate: "2014",
          pageCount: "352"
        },
        {
          title: "JavaScript: The Definitive Guide",
          authors: "David Flanagan",
          description: "This is a book about JavaScript, the programming language of the Web.",
          thumbnail: "https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=JavaScript+Guide",
          url: "https://books.google.com",
          publishedDate: "2020",
          pageCount: "700"
        }
      ],
      backend: [
        {
          title: "Node.js Design Patterns",
          authors: "Mario Casciaro, Luciano Mammino",
          description: "Learn how to build scalable and maintainable Node.js applications.",
          thumbnail: "https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=Node.js+Patterns",
          url: "https://books.google.com",
          publishedDate: "2020",
          pageCount: "700"
        },
        {
          title: "Building Microservices",
          authors: "Sam Newman",
          description: "Learn how to build and evolve microservices effectively.",
          thumbnail: "https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=Microservices",
          url: "https://books.google.com",
          publishedDate: "2021",
          pageCount: "320"
        },
        {
          title: "Database Design for Mere Mortals",
          authors: "Michael J. Hernandez",
          description: "A straightforward, platform-independent tutorial on the basic principles.",
          thumbnail: "https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=Database+Design",
          url: "https://books.google.com",
          publishedDate: "2019",
          pageCount: "650"
        }
      ],
      datascience: [
        {
          title: "Python for Data Analysis",
          authors: "Wes McKinney",
          description: "Learn how to manipulate, process, clean, and crunch datasets in Python.",
          thumbnail: "https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=Python+Data",
          url: "https://books.google.com",
          publishedDate: "2022",
          pageCount: "500"
        },
        {
          title: "Hands-On Machine Learning",
          authors: "Aurélien Géron",
          description: "Concepts, tools, and techniques to build intelligent systems.",
          thumbnail: "https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=ML+Book",
          url: "https://books.google.com",
          publishedDate: "2019",
          pageCount: "850"
        },
        {
          title: "The Elements of Statistical Learning",
          authors: "Trevor Hastie, Robert Tibshirani, Jerome Friedman",
          description: "A valuable resource for statisticians and anyone working in data mining.",
          thumbnail: "https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=Statistical+Learning",
          url: "https://books.google.com",
          publishedDate: "2017",
          pageCount: "768"
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
        if (result.roadmap) {
          setRoadmap(result.roadmap);
        }
        
        if (result.courses) {
          setCourses(result.courses);
        }
      } catch (err) {
        console.error('Error fetching career analysis:', err);
        setError('Failed to load career analysis. Using demo data.');
        
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
      title: "Learning Resources",
      description: "Discover curated YouTube videos and books for your learning path.",
      icon: "📚",
      status: "upcoming",
      isResource: true
    },
    {
      id: 4,
      title: "Learning Plan",
      description: "Get a personalized learning roadmap with courses and resources.",
      icon: "📖",
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
            <p className="mt-4 text-gray-600">Analyzing your career path with AI...</p>
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
                <p className="text-sm text-yellow-700 mt-2">Showing static career guidance while we resolve the issue.</p>
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
                    <div className="ml-6 flex-grow bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
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
        
        {/* Tour Guide Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 professional-heading">Personalized Tour Guide</h3>
          <TourGuide />
        </div>
        
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
              
              {/* Enhanced Resource Integration with User Skills */}
              {step.isResource && (
                <div className="mb-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => searchYouTubeVideos('programming', analysisResult?.skills || user?.skills)}
                      disabled={loadingVideos}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors duration-200 text-sm professional-button"
                    >
                      <i className="fab fa-youtube"></i>
                      <span>{loadingVideos ? 'Loading...' : 'Videos'}</span>
                    </button>
                    
                    <button
                      onClick={() => searchBooks('programming', analysisResult?.skills || user?.skills)}
                      disabled={loadingBooks}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors duration-200 text-sm professional-button"
                    >
                      <i className="fas fa-book"></i>
                      <span>{loadingBooks ? 'Loading...' : 'Books'}</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => searchYouTubeVideos('frontend', analysisResult?.skills || user?.skills)}
                      disabled={loadingVideos}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors duration-200 text-sm professional-button"
                    >
                      <i className="fab fa-youtube"></i>
                      <span>Frontend</span>
                    </button>
                    
                    <button
                      onClick={() => searchBooks('frontend', analysisResult?.skills || user?.skills)}
                      disabled={loadingBooks}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors duration-200 text-sm professional-button"
                    >
                      <i className="fas fa-book"></i>
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
                      onClick={() => searchBooks('backend', analysisResult?.skills || user?.skills)}
                      disabled={loadingBooks}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors duration-200 text-sm professional-button"
                    >
                      <i className="fas fa-book"></i>
                      <span>Backend</span>
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
        
        {/* Books Section */}
        {showBooks && (
          <div className="mt-12">
            <div className="text-center mb-8">
              // Updated text colors for light mode
              <h3 className="text-3xl font-bold mb-4 text-gray-800 professional-heading">📚 Recommended Books - {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h3>
              <p className="text-lg text-gray-600 professional-text">Curated book recommendations to deepen your knowledge</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book, index) => (
                // Updated card styling for light mode
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 professional-card border border-gray-200">
                  <div className="relative">
                    <img 
                      src={book.thumbnail || 'https://via.placeholder.com/128x192?text=Book'} 
                      alt={book.title}
                      className="w-full h-48 object-contain p-4"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <a 
                        href={book.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 professional-button"
                      >
                        <i className="fas fa-book-open"></i>
                        <span>View Book</span>
                      </a>
                    </div>
                  </div>
                  <div className="p-4">
                    // Updated text colors for light mode
                    <h4 className="text-lg font-semibold mb-2 text-gray-800 professional-subheading line-clamp-2">
                      {book.title || 'Book Title'}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2 professional-text">
                      {book.authors || 'Unknown Author'}
                    </p>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-3">
                      {book.description || 'No description available'}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{book.publishedDate || 'Unknown Date'}</span>
                      <span>{book.pageCount || 'Unknown'} pages</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <button
                onClick={() => setShowBooks(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors duration-200 professional-button"
              >
                Hide Books
              </button>
            </div>
          </div>
        )}
        
        {/* Certifications Section */}
        {!loading && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 professional-heading">Recommended Certifications</h3>
            {courses && courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-semibold text-gray-800">{course.title}</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {course.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Provider: {course.provider}</p>
                    <p className="text-gray-500 text-xs mb-4">Duration: {course.duration}</p>
                    <a 
                      href={course.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-sm"
                    >
                      View Certification
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-600">No certifications available at the moment.</p>
                <button 
                  onClick={() => window.open('https://www.coursera.org/search?query=' + (currentSkills || 'certification'), '_blank')}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Search Certifications
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Roadmap;