import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { careerAPI } from '../services/api';
import AIChatBot from '../components/AIChatBot';

const Roadmap = () => {
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showYouTubeVideos, setShowYouTubeVideos] = useState(false);
  const [showBooks, setShowBooks] = useState(false);
  const [showCertifications, setShowCertifications] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [books, setBooks] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  
  const navigate = useNavigate();
  const { currentSkills, currentExpertise } = useAppContext();
  
  // Log context values for debugging
  useEffect(() => {
    console.log('Context values updated:', { currentSkills, currentExpertise });
  }, [currentSkills, currentExpertise]);

  // Fetch roadmap data from your API
  useEffect(() => {
    console.log('Roadmap useEffect triggered with:', { currentSkills, currentExpertise });
    
    const fetchRoadmapData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the proper API service
        console.log('Fetching roadmap data for:', currentSkills, currentExpertise);
        
        // Check if skills and expertise are available
        if (!currentSkills || !currentExpertise) {
          console.log('Missing skills or expertise:', { currentSkills, currentExpertise });
          throw new Error('Skills and expertise are required to generate a personalized roadmap');
        }
        
        const data = await careerAPI.analyzeCareer(currentSkills, currentExpertise);
        console.log('Received roadmap data:', data);
        setRoadmapData(data);
      } catch (err) {
        console.error('Error fetching roadmap data:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response,
          request: err.request
        });
        setError(err.message || 'Failed to fetch roadmap data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data if both skills and expertise are available
    if (currentSkills && currentExpertise) {
      // Add a small delay to ensure context is properly set
      const timer = setTimeout(() => {
        fetchRoadmapData();
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      // Set error if skills or expertise are missing
      if (!currentSkills || !currentExpertise) {
        console.log('Setting error due to missing skills or expertise');
        setError('Please provide your skills and expertise level to generate a personalized roadmap.');
      }
      setLoading(false);
    }
  }, [currentSkills, currentExpertise]);

  // Search YouTube videos based on current skills using custom API
  const searchYouTubeVideos = async () => {
    setLoadingVideos(true);
    setShowBooks(false);
    setShowCertifications(false);
    
    try {
      const searchTerm = currentSkills || 'engineering';
      // Using the official YouTube Data API v3
      const YOUTUBE_API_KEY = 'AIzaSyAytoNZiRTkprioNLhFVd9sUmAkn-RVyMg'; // This should be moved to env variables
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchTerm + ' course')}&type=video&maxResults=6&key=${YOUTUBE_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.items && data.items.length > 0) {
          // Process official YouTube API response
          const processedVideos = data.items.map(video => ({
            title: video.snippet.title,
            channel: video.snippet.channelTitle,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails.medium.url,
            url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            publishedAt: video.snippet.publishedAt
          }));
          
          setYoutubeVideos(processedVideos);
          setShowYouTubeVideos(true);
        } else {
          // Fallback to demo videos
          setYoutubeVideos(getDemoVideos());
          setShowYouTubeVideos(true);
        }
      } else {
        // Fallback to demo videos
        setYoutubeVideos(getDemoVideos());
        setShowYouTubeVideos(true);
      }
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      // Fallback to demo videos
      setYoutubeVideos(getDemoVideos());
      setShowYouTubeVideos(true);
    } finally {
      setLoadingVideos(false);
    }
  };

  // Search books based on current skills using Google Books API
  const searchBooks = async () => {
    setLoadingVideos(true);
    setShowYouTubeVideos(false);
    setShowCertifications(false);
    
    try {
      const searchTerm = currentSkills || 'engineering';
      // Using the Google Books API
      const GOOGLE_BOOKS_API_KEY = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY || 'AIzaSyAytoNZiRTkprioNLhFVd9sUmAkn-RVyMg';
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm + ' course')}&maxResults=6&key=${GOOGLE_BOOKS_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.items && data.items.length > 0) {
          // Process Google Books API response
          const processedBooks = data.items.map(book => ({
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
            description: book.volumeInfo.description ? book.volumeInfo.description.substring(0, 150) + '...' : 'No description available',
            thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x192?text=No+Cover',
            url: book.volumeInfo.infoLink || '#',
            publishedDate: book.volumeInfo.publishedDate || 'Unknown Date',
            pageCount: book.volumeInfo.pageCount || 'Unknown'
          }));
          
          setBooks(processedBooks);
          setShowBooks(true);
        } else {
          // Fallback to demo books
          setBooks(getDemoBooks());
          setShowBooks(true);
        }
      } else {
        // Fallback to demo books
        setBooks(getDemoBooks());
        setShowBooks(true);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      // Fallback to demo books
      setBooks(getDemoBooks());
      setShowBooks(true);
    } finally {
      setLoadingVideos(false);
    }
  };

  // Search certifications based on current skills
  const searchCertifications = async () => {
    setLoadingVideos(true);
    setShowYouTubeVideos(false);
    setShowBooks(false);
    setShowCourses(false);
    
    try {
      // Use actual certifications from the roadmap data if available
      if (roadmapData && roadmapData.certifications && roadmapData.certifications.length > 0) {
        // Transform backend certifications to match frontend format
        const transformedCertifications = roadmapData.certifications.map(cert => ({
          title: cert.name || cert.title,
          provider: cert.provider,
          type: cert.type || 'Paid', // Use type from backend or default to Paid
          description: cert.description,
          url: cert.url,
          difficulty: cert.difficulty,
          duration: cert.duration
        }));
        
        setCertifications(transformedCertifications);
        setShowCertifications(true);
      } else {
        // Fallback to demo certifications if no data from backend
        const demoCertifications = getDemoCertifications();
        setCertifications(demoCertifications);
        setShowCertifications(true);
      }
    } catch (error) {
      console.error('Error fetching certifications:', error);
      // Fallback to demo certifications
      setCertifications(getDemoCertifications());
      setShowCertifications(true);
    } finally {
      setLoadingVideos(false);
    }
  };

  // Search courses based on current skills
  const searchCourses = async () => {
    setLoadingVideos(true);
    setShowYouTubeVideos(false);
    setShowBooks(false);
    setShowCertifications(false);
    
    try {
      // Use actual courses from the roadmap data if available
      if (roadmapData && roadmapData.courses && roadmapData.courses.length > 0) {
        setCourses(roadmapData.courses);
        setShowCourses(true);
      } else {
        // Fallback to empty array if no data from backend
        setCourses([]);
        setShowCourses(true);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Fallback to empty array
      setCourses([]);
      setShowCourses(true);
    } finally {
      setLoadingVideos(false);
    }
  };

  // Demo videos as fallback
  const getDemoVideos = () => {
    return [
      {
        title: "Complete Course on " + (currentSkills || "Engineering"),
        channel: "Educational Channel",
        description: "Learn " + (currentSkills || "Engineering") + " from basics to advanced level",
        thumbnail: "https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Course+" + (currentSkills || "Engineering"),
        url: "https://youtube.com/watch?v=demo1"
      },
      {
        title: "Beginner's Guide to " + (currentSkills || "Engineering"),
        channel: "Learning Academy",
        description: "Perfect for beginners to start their " + (currentSkills || "Engineering") + " journey",
        thumbnail: "https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Beginner+" + (currentSkills || "Engineering"),
        url: "https://youtube.com/watch?v=demo2"
      },
      {
        title: "Advanced " + (currentSkills || "Engineering") + " Techniques",
        channel: "Expert Tutorials",
        description: "Master advanced concepts in " + (currentSkills || "Engineering"),
        thumbnail: "https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Advanced+" + (currentSkills || "Engineering"),
        url: "https://youtube.com/watch?v=demo3"
      }
    ];
  };

  // Demo books as fallback
  const getDemoBooks = () => {
    return [
      {
        title: "Complete Guide to " + (currentSkills || "Engineering"),
        authors: "Expert Author",
        description: "Comprehensive guide covering all aspects of " + (currentSkills || "Engineering"),
        thumbnail: "https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=Book+" + (currentSkills || "Engineering"),
        url: "#",
        publishedDate: "2023",
        pageCount: "300"
      },
      {
        title: "Mastering " + (currentSkills || "Engineering") + " Skills",
        authors: "Professional Developer",
        description: "Practical approach to mastering " + (currentSkills || "Engineering") + " skills",
        thumbnail: "https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=Master+" + (currentSkills || "Engineering"),
        url: "#",
        publishedDate: "2022",
        pageCount: "250"
      },
      {
        title: "Career Path in " + (currentSkills || "Engineering"),
        authors: "Industry Expert",
        description: "Step-by-step guide to building a successful career in " + (currentSkills || "Engineering"),
        thumbnail: "https://via.placeholder.com/128x192/4F46E5/FFFFFF?text=Career+" + (currentSkills || "Engineering"),
        url: "#",
        publishedDate: "2023",
        pageCount: "200"
      }
    ];
  };

  // Demo certifications as fallback
  const getDemoCertifications = () => {
    return [
      {
        title: currentSkills + " Professional Certification",
        provider: "Certification Institute",
        type: "Paid",
        description: "Industry-recognized certification for " + (currentSkills || "Engineering") + " professionals",
        url: "https://example.com/certification1",
        difficulty: "Intermediate",
        duration: "3-6 months"
      },
      {
        title: "Advanced " + (currentSkills || "Engineering") + " Certificate",
        provider: "Online Learning Platform",
        type: "Free",
        description: "Free certification course for advanced " + (currentSkills || "Engineering") + " concepts",
        url: "https://example.com/certification2",
        difficulty: "Advanced",
        duration: "2-4 months"
      },
      {
        title: "Beginner's " + (currentSkills || "Engineering") + " Certification",
        provider: "Educational Organization",
        type: "Paid",
        description: "Entry-level certification for beginners in " + (currentSkills || "Engineering"),
        url: "https://example.com/certification3",
        difficulty: "Beginner",
        duration: "1-3 months"
      },
      {
        title: currentSkills + " Specialization Certificate",
        provider: "Tech Academy",
        type: "Free",
        description: "Free specialization course with certificate in " + (currentSkills || "Engineering"),
        url: "https://example.com/certification4",
        difficulty: "Intermediate",
        duration: "2-3 months"
      }
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Generating Your Roadmap</h1>
          <p className="text-gray-600">
            Creating a personalized learning path for {currentSkills || 'your selected domain'}...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Career Roadmap Setup</h1>
            <p className="text-gray-600 mb-8">
              {currentSkills && currentExpertise 
                ? error 
                : "To generate a personalized roadmap, please select your skills and expertise level."}
            </p>
            
            {!currentSkills || !currentExpertise ? (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 max-w-2xl mx-auto">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-info-circle text-blue-400"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>How to get started:</strong> Visit the home page to select your field of interest, 
                      specialization, and expertise level. This will generate a personalized learning roadmap just for you!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 max-w-2xl mx-auto">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-triangle text-yellow-400"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Fallback Mode:</strong> Showing static career guidance while we resolve the issue.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Static Career Guidance in Fallback Mode */}
            {currentSkills && currentExpertise && (
              <div className="mt-8 bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Path for {currentSkills}</h2>
                
                {/* Learning Roadmap */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Suggested Learning Roadmap</h3>
                  <div className="space-y-4">
                    {[
                      {
                        step: 1,
                        title: "Foundational Skills",
                        description: "Start with the basics of " + currentSkills + " to build a strong foundation.",
                        duration: "2-3 months",
                        resources: ["Online tutorials", "Documentation", "Practice exercises"]
                      },
                      {
                        step: 2,
                        title: "Intermediate Concepts",
                        description: "Deepen your understanding with more complex topics and real-world applications.",
                        duration: "3-6 months",
                        resources: ["Courses", "Projects", "Community forums"]
                      },
                      {
                        step: 3,
                        title: "Advanced Techniques",
                        description: "Master advanced skills and stay updated with the latest trends.",
                        duration: "6+ months",
                        resources: ["Specialized courses", "Certifications", "Networking"]
                      }
                    ].map((step, index) => (
                      <div key={index} className="flex items-start p-4 bg-white rounded-lg border-l-4 border-indigo-500">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-indigo-800 font-bold">{step.step}</span>
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-900">{step.title}</h4>
                            <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                              {step.duration}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{step.description}</p>
                          <div className="mt-2">
                            <span className="text-sm font-medium text-gray-700">Resources: </span>
                            <span className="text-sm text-gray-600">{step.resources.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Recommended Resources */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">📚 Recommended Books</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <i className="fas fa-book text-indigo-500 mt-1 mr-2"></i>
                        <span className="text-gray-700">"Complete Guide to " + {currentSkills}</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-book text-indigo-500 mt-1 mr-2"></i>
                        <span className="text-gray-700">"Mastering " + {currentSkills} + " Skills"</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-book text-indigo-500 mt-1 mr-2"></i>
                        <span className="text-gray-700">"Career Path in " + {currentSkills}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">📺 Recommended Videos</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <i className="fab fa-youtube text-red-500 mt-1 mr-2"></i>
                        <span className="text-gray-700">"Complete Course on " + {currentSkills}</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fab fa-youtube text-red-500 mt-1 mr-2"></i>
                        <span className="text-gray-700">"Beginner's Guide to " + {currentSkills}</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fab fa-youtube text-red-500 mt-1 mr-2"></i>
                        <span className="text-gray-700">"Advanced " + {currentSkills} + " Techniques"</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* YouTube Videos and Books Section */}
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Learning Resources</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={searchYouTubeVideos}
                        disabled={loadingVideos}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                      >
                        {loadingVideos ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <i className="fab fa-youtube"></i>
                            <span>Find Videos</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={searchBooks}
                        disabled={loadingVideos}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                      >
                        {loadingVideos ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-book"></i>
                            <span>Find Books</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={searchCertifications}
                        disabled={loadingVideos}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                      >
                        {loadingVideos ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-certificate"></i>
                            <span>Find Certifications</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* YouTube Videos Section */}
                  {showYouTubeVideos && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">📺 Recommended Videos</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {youtubeVideos.map((video, index) => (
                          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                            <div className="relative">
                              <img 
                                src={video.thumbnail || 'https://via.placeholder.com/320x180?text=Video'} 
                                alt={video.title}
                                className="w-full h-32 object-contain p-2"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <a 
                                  href={video.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                                >
                                  <i className="fab fa-youtube"></i>
                                  <span>Watch</span>
                                </a>
                              </div>
                            </div>
                            <div className="p-3">
                              <h4 className="text-md font-semibold mb-1 text-gray-900 line-clamp-2">
                                {video.title || 'Study Video'}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {video.channel || 'Educational Channel'}
                              </p>
                              {video.description && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {video.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-center mt-4">
                        <button
                          onClick={() => setShowYouTubeVideos(false)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Hide Videos
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Books Section */}
                  {showBooks && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">📚 Recommended Books</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {books.map((book, index) => (
                          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                            <div className="relative">
                              <img 
                                src={book.thumbnail || 'https://via.placeholder.com/128x192?text=Book'} 
                                alt={book.title}
                                className="w-full h-32 object-contain p-2"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <a 
                                  href={book.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                                >
                                  <i className="fas fa-book-open"></i>
                                  <span>View Book</span>
                                </a>
                              </div>
                            </div>
                            <div className="p-3">
                              <h4 className="text-md font-semibold mb-1 text-gray-900 line-clamp-2">
                                {book.title || 'Book Title'}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {book.authors || 'Unknown Author'}
                              </p>
                              {book.description && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {book.description}
                                </p>
                              )}
                              <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>{book.publishedDate || 'Unknown Date'}</span>
                                <span>{book.pageCount || 'Unknown'} pages</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-center mt-4">
                        <button
                          onClick={() => setShowBooks(false)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Hide Books
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Certifications Section */}
                  {showCertifications && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">📜 Recommended Certifications</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {certifications.map((cert, index) => (
                          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-md font-semibold text-gray-900 line-clamp-2">
                                  {cert.title || cert.name || 'Certification Title'}
                                </h4>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  cert.type === 'Free' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {cert.type || 'Paid'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                Provider: {cert.provider || 'Unknown Provider'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {cert.description || 'No description available'}
                              </p>
                              <div className="flex justify-between text-xs text-gray-400 mt-2">
                                <span>Difficulty: {cert.difficulty || 'Intermediate'}</span>
                                <span>Duration: {cert.duration || '3-6 months'}</span>
                              </div>
                              <div className="mt-3">
                                <a 
                                  href={cert.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  <i className="fas fa-external-link-alt mr-1"></i>
                                  View Certification
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-center mt-4">
                        <button
                          onClick={() => setShowCertifications(false)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Hide Certifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <i className="fas fa-home mr-2"></i>
                Select Your Skills
              </button>
              
              {currentSkills && currentExpertise && (
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <i className="fas fa-sync mr-2"></i>
                  Retry Loading
                </button>
              )}
              
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Go Back Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Roadmap</h1>
            <p className="text-gray-600">Personalized path for {currentSkills || 'your selected domain'}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            <i className="fas fa-edit mr-2"></i>
            Change Skills
          </button>
        </div>

        {roadmapData ? (
          <div className="mb-12">
            {/* Removed Career Path section as requested */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Roadmap Steps */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">Learning Steps</h2>
                  <span className="text-sm text-gray-500">{roadmapData.roadmap?.length || 0} steps</span>
                </div>
                <div className="space-y-4">
                  {(roadmapData.roadmap || []).map((step, index) => (
                    <div 
                      key={index} 
                      className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500 hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-indigo-800 font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                            <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                              {step.duration}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{step.description}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(step.resources || []).map((resource, resIndex) => (
                              <span key={resIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                {resource}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation to Flowchart */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Visual Learning Path</h2>
                <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl shadow-lg p-6 mb-6 border border-indigo-200 transform transition-transform duration-300 hover:shadow-xl">
                  <div className="text-center mb-5">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                      <i className="fas fa-project-diagram text-indigo-600 text-2xl"></i>
                    </div>
                    <p className="text-gray-700 mb-4 text-lg">View your learning path as an interactive flowchart for better visualization.</p>
                  </div>
                  <button
                    onClick={() => navigate('/flowchart')}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg font-semibold"
                  >
                    <i className="fas fa-project-diagram"></i>
                    <span>View Interactive Flowchart</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>

                {/* YouTube Videos and Books Section */}
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Related Learning Resources</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={searchYouTubeVideos}
                        disabled={loadingVideos}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-red-400 disabled:to-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        {loadingVideos ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <i className="fab fa-youtube"></i>
                            <span>Find Videos</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={searchBooks}
                        disabled={loadingVideos}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-green-400 disabled:to-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        {loadingVideos ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-book"></i>
                            <span>Find Books</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={searchCourses}
                        disabled={loadingVideos}
                        className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-indigo-400 disabled:to-indigo-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        {loadingVideos ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-graduation-cap"></i>
                            <span>Find Courses</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={searchCertifications}
                        disabled={loadingVideos}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        {loadingVideos ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-certificate"></i>
                            <span>Find Certifications</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* YouTube Videos Section */}
                  {showYouTubeVideos && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">📺 Recommended Videos</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {youtubeVideos.map((video, index) => (
                          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                            <div className="relative">
                              <img 
                                src={video.thumbnail || 'https://via.placeholder.com/320x180?text=Video'} 
                                alt={video.title}
                                className="w-full h-32 object-contain p-2"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <a 
                                  href={video.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                                >
                                  <i className="fab fa-youtube"></i>
                                  <span>Watch</span>
                                </a>
                              </div>
                            </div>
                            <div className="p-3">
                              <h4 className="text-md font-semibold mb-1 text-gray-900 line-clamp-2">
                                {video.title || 'Study Video'}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {video.channel || 'Educational Channel'}
                              </p>
                              {video.description && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {video.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-center mt-4">
                        <button
                          onClick={() => setShowYouTubeVideos(false)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Hide Videos
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Books Section */}
                  {showBooks && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">📚 Recommended Books</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {books.map((book, index) => (
                          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                            <div className="relative">
                              <img 
                                src={book.thumbnail || 'https://via.placeholder.com/128x192?text=Book'} 
                                alt={book.title}
                                className="w-full h-32 object-contain p-2"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                <a 
                                  href={book.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                                >
                                  <i className="fas fa-book-open"></i>
                                  <span>View Book</span>
                                </a>
                              </div>
                            </div>
                            <div className="p-3">
                              <h4 className="text-md font-semibold mb-1 text-gray-900 line-clamp-2">
                                {book.title || 'Book Title'}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {book.authors || 'Unknown Author'}
                              </p>
                              {book.description && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {book.description}
                                </p>
                              )}
                              <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>{book.publishedDate || 'Unknown Date'}</span>
                                <span>{book.pageCount || 'Unknown'} pages</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-center mt-4">
                        <button
                          onClick={() => setShowBooks(false)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Hide Books
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Certifications Section */}
                  {showCertifications && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">📜 Recommended Certifications</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {certifications.map((cert, index) => (
                          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-md font-semibold text-gray-900 line-clamp-2">
                                  {cert.title || cert.name || 'Certification Title'}
                                </h4>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  cert.type === 'Free' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {cert.type || 'Paid'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                Provider: {cert.provider || 'Unknown Provider'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {cert.description || 'No description available'}
                              </p>
                              <div className="flex justify-between text-xs text-gray-400 mt-2">
                                <span>Difficulty: {cert.difficulty || 'Intermediate'}</span>
                                <span>Duration: {cert.duration || '3-6 months'}</span>
                              </div>
                              <div className="mt-3">
                                <a 
                                  href={cert.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  <i className="fas fa-external-link-alt mr-1"></i>
                                  View Certification
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-center mt-4">
                        <button
                          onClick={() => setShowCertifications(false)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Hide Certifications
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Courses Section */}
                  {showCourses && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">📖 Recommended Courses</h4>
                      <div className="grid grid-cols-1 gap-4">
                        {courses.map((course, index) => (
                          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="text-md font-semibold text-gray-900 line-clamp-2">
                                  {course.title || 'Course Title'}
                                </h4>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  course.type === 'Free' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {course.type || 'Paid'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                Provider: {course.provider || 'Unknown Provider'}
                              </p>
                              <div className="flex justify-between text-xs text-gray-400 mt-2">
                                <span>Difficulty: {course.difficulty || 'Intermediate'}</span>
                                <span>Duration: {course.duration || '3-6 months'}</span>
                              </div>
                              <div className="mt-3">
                                <a 
                                  href={course.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  <i className="fas fa-external-link-alt mr-1"></i>
                                  View Course
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-center mt-4">
                        <button
                          onClick={() => setShowCourses(false)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Hide Courses
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      
      {/* AI Chat Bot */}
      {showChatBot && <AIChatBot />}
    </div>
  );
};

export default Roadmap;
