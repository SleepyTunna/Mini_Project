import React, { useState } from 'react';

const Roadmap = () => {
  const [showYouTubeVideos, setShowYouTubeVideos] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);

  // Function to search YouTube videos
  const searchYouTubeVideos = async (searchTerm) => {
    setLoadingVideos(true);
    try {
      const response = await fetch(`https://abhi-api.vercel.app/api/search/yts?text=${encodeURIComponent(searchTerm)}`, {
        timeout: 15000 // 15 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.results) {
          setYoutubeVideos(data.results.slice(0, 6)); // Get first 6 videos
          setShowYouTubeVideos(true);
          return;
        }
      }
      
      // Fallback to demo data if API fails
      console.log('YouTube API unavailable, using demo data');
      setYoutubeVideos([
        {
          title: "Complete Web Development Bootcamp 2024",
          channel: "CodeWithMosh",
          duration: "12:45:30",
          views: "2.5M views",
          thumbnail: "https://via.placeholder.com/320x180/FF0000/FFFFFF?text=YouTube+Video",
          url: "https://youtube.com/watch?v=demo1"
        },
        {
          title: "Python Programming Full Course",
          channel: "FreeCodeCamp",
          duration: "4:26:52",
          views: "8.9M views",
          thumbnail: "https://via.placeholder.com/320x180/FF0000/FFFFFF?text=Python+Course",
          url: "https://youtube.com/watch?v=demo2"
        },
        {
          title: "JavaScript Crash Course for Beginners",
          channel: "Traversy Media",
          duration: "1:40:17",
          views: "3.2M views",
          thumbnail: "https://via.placeholder.com/320x180/FF0000/FFFFFF?text=JavaScript",
          url: "https://youtube.com/watch?v=demo3"
        },
        {
          title: "React.js Tutorial for Beginners",
          channel: "Programming with Mosh",
          duration: "2:25:43",
          views: "1.8M views",
          thumbnail: "https://via.placeholder.com/320x180/FF0000/FFFFFF?text=React+Tutorial",
          url: "https://youtube.com/watch?v=demo4"
        },
        {
          title: "Data Structures and Algorithms",
          channel: "CS Dojo",
          duration: "3:15:20",
          views: "5.1M views",
          thumbnail: "https://via.placeholder.com/320x180/FF0000/FFFFFF?text=Data+Structures",
          url: "https://youtube.com/watch?v=demo5"
        },
        {
          title: "Full Stack Development with MERN",
          channel: "Tech With Tim",
          duration: "6:30:45",
          views: "900K views",
          thumbnail: "https://via.placeholder.com/320x180/FF0000/FFFFFF?text=MERN+Stack",
          url: "https://youtube.com/watch?v=demo6"
        }
      ]);
      setShowYouTubeVideos(true);
      
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      // Show demo videos on error
      setYoutubeVideos([
        {
          title: "Programming Tutorial - API Error Demo",
          channel: "Demo Channel",
          duration: "10:00",
          views: "Demo views",
          thumbnail: "https://via.placeholder.com/320x180/FF0000/FFFFFF?text=Demo+Video",
          url: "#"
        }
      ]);
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
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Your Career Journey</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Follow our proven roadmap to accelerate your career growth
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roadmapSteps.map((step, index) => (
            <div 
              key={step.id}
              className={`bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-600 ${
                step.status === 'completed' ? 'border-l-4 border-green-500' : 
                step.status === 'current' ? 'border-l-4 border-blue-500' : 
                'border-l-4 border-gray-300 dark:border-gray-500'
              }`}
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{step.description}</p>
              
              {/* YouTube Integration Button */}
              {step.isYouTube && (
                <button
                  onClick={() => searchYouTubeVideos('programming tutorials web development')}
                  disabled={loadingVideos}
                  className="mb-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>{loadingVideos ? 'Loading...' : 'Find Study Videos'}</span>
                </button>
              )}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                step.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                step.status === 'current' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
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
              <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">📺 Recommended Study Videos</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">Curated YouTube content to accelerate your learning</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {youtubeVideos.map((video, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                    <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">
                      {video.title || 'Study Video'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {video.channel || 'Educational Channel'}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
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