import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Courses = () => {
  const { analysisResult, isLoading, currentSkills, currentExpertise } = useAppContext();
  
  // YouTube Video States
  const [showYouTubeVideos, setShowYouTubeVideos] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  
  // YouTube Video Search Function
  const searchYouTubeVideos = async (searchTerm = '') => {
    setLoadingVideos(true);
    
    // Use current skills or fallback to generic search
    let finalSearchTerm = searchTerm;
    if (!finalSearchTerm && currentSkills) {
      finalSearchTerm = currentSkills.split(',').slice(0, 3).join(' ').trim();
    }
    if (!finalSearchTerm) {
      finalSearchTerm = 'programming tutorial';
    }
    
    console.log('Searching YouTube for:', finalSearchTerm);
    
    try {
      const response = await fetch(`https://abhi-api.vercel.app/api/search/yts?text=${encodeURIComponent(finalSearchTerm + ' tutorial course')}`, {
        timeout: 10000
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.results && data.results.length > 0) {
          const filteredVideos = data.results
            .filter(video => video.title && video.title.length > 10)
            .slice(0, 6);
          
          console.log('Found YouTube videos:', filteredVideos.length);
          setYoutubeVideos(filteredVideos);
          setShowYouTubeVideos(true);
          return;
        }
      }
      
      // Fallback to demo data if API fails
      console.log('YouTube API unavailable, using demo data');
      setYoutubeVideos(getDemoVideos(finalSearchTerm));
      setShowYouTubeVideos(true);
      
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      setYoutubeVideos(getDemoVideos(finalSearchTerm));
      setShowYouTubeVideos(true);
    } finally {
      setLoadingVideos(false);
    }
  };
  
  // Demo videos based on search term
  const getDemoVideos = (searchTerm) => {
    const baseVideos = [
      {
        title: `${searchTerm} Complete Tutorial - Learn from Scratch`,
        channel: "Tech Learning Hub",
        duration: "4:35:20",
        views: "2.8M views",
        thumbnail: `https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=${encodeURIComponent(searchTerm)}`,
        url: "https://youtube.com/watch?v=demo1"
      },
      {
        title: `${searchTerm} Crash Course - Build Real Projects`,
        channel: "Code Academy",
        duration: "2:15:30",
        views: "1.5M views",
        thumbnail: "https://via.placeholder.com/320x180/7C3AED/FFFFFF?text=Projects",
        url: "https://youtube.com/watch?v=demo2"
      },
      {
        title: `Advanced ${searchTerm} Techniques and Best Practices`,
        channel: "Programming Pro",
        duration: "3:22:45",
        views: "980K views",
        thumbnail: "https://via.placeholder.com/320x180/EC4899/FFFFFF?text=Advanced",
        url: "https://youtube.com/watch?v=demo3"
      }
    ];
    return baseVideos;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Finding Your Courses</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Our AI is curating the best learning resources for your career path...
          </p>
        </div>
      </div>
    );
  }

  // No data state
  if (!analysisResult || !analysisResult.courses) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Recommended Courses</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              No course data available. Please start by analyzing your career path.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Start Analysis
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 wavy-background">
      <div className="floating-elements">
        <div className="float-1"></div>
        <div className="float-2"></div>
        <div className="float-3"></div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Recommended Courses</h1>
          <p className="text-gray-600 dark:text-gray-300">Curated learning resources for <span className="font-semibold text-indigo-600">{currentSkills || 'your skills'}</span></p>
          {currentExpertise && (
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Tailored for {currentExpertise} level</p>
          )}
        </div>

        {/* YouTube Video Section */}
        <div className="mb-8">
          <div className="enhanced-card rounded-lg p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">📺 Study Videos</h2>
                  <p className="text-gray-600 dark:text-gray-300">Watch tutorials based on your skills</p>
                </div>
              </div>
              <button
                onClick={() => searchYouTubeVideos()}
                disabled={loadingVideos}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <span>{loadingVideos ? 'Searching...' : 'Find Videos'}</span>
              </button>
            </div>
            
            {currentSkills && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                💡 Will search for videos related to: <span className="font-semibold">{currentSkills.split(',').slice(0, 3).join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Course Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">📚 Recommended Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysisResult.courses.map((course, index) => (
              <div key={index} className="enhanced-card rounded-lg shadow hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-2xl">📚</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{course.provider}</p>
                      </div>
                    </div>
                  </div>
                
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{course.duration}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Difficulty</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-center block"
                    >
                      Open in new tab
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* YouTube Videos Section */}
        {showYouTubeVideos && (
          <div className="mt-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">📺 Related Study Videos</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">Video tutorials to complement your learning</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {youtubeVideos.map((video, index) => (
                <div key={index} className="enhanced-card rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src={video.thumbnail || 'https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Video'} 
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
                    <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2">
                      {video.title || 'Study Video'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {video.channel || 'Educational Channel'}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500">
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

        {/* Action Buttons */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/roadmap"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <span className="mr-2">🗺️</span>
              View Learning Roadmap
            </Link>
            <Link
              to="/career-path"
              className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
            >
              <span className="mr-2">💼</span>
              Explore Career Paths
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;