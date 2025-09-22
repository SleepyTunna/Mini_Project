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
  const [youtubeVideos, setYoutubeVideos] = useState([]);
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
          throw new Error('Skills and expertise are required to generate a roadmap');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error Loading Roadmap</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
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
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Go Back Home
            </button>
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
        </div>

        {roadmapData ? (
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Career Path</h2>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{roadmapData.selected_path?.description || 'Engineering Specialist'}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Roadmap Steps */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Learning Steps</h2>
                <div className="space-y-4">
                  {(roadmapData.roadmap || []).map((step, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-indigo-800 font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
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
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <p className="text-gray-700 mb-4">View your learning path as an interactive flowchart for better visualization.</p>
                  <button
                    onClick={() => navigate('/flowchart')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                  >
                    <i className="fas fa-project-diagram"></i>
                    <span>View Flowchart</span>
                  </button>
                </div>

                {/* YouTube Videos Section */}
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Related YouTube Courses</h3>
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
                          <span>Find Courses</span>
                        </>
                      )}
                    </button>
                  </div>

                  {showYouTubeVideos && (
                    <div className="grid grid-cols-1 gap-4">
                      {youtubeVideos.map((video, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                          <div className="relative">
                            <img 
                              src={video.thumbnail || 'https://via.placeholder.com/320x180?text=Video'} 
                              alt={video.title}
                              className="w-full h-32 object-cover"
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
                          </div>
                        </div>
                      ))}
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