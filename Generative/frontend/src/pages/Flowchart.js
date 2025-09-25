import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { careerAPI } from '../services/api';

const Flowchart = () => {
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  const navigate = useNavigate();
  const { currentSkills, currentExpertise } = useAppContext();

  // Fetch roadmap data from your API
  useEffect(() => {
    const fetchRoadmapData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if skills and expertise are available
        if (!currentSkills || !currentExpertise) {
          throw new Error('Skills and expertise are required to generate a roadmap');
        }
        
        const data = await careerAPI.analyzeCareer(currentSkills, currentExpertise);
        console.log('Received roadmap data:', data);
        
        // Validate response data
        if (!data || !data.roadmap) {
          throw new Error('Invalid response from server. Please try again.');
        }
        
        setRoadmapData(data);
      } catch (err) {
        console.error('Error fetching roadmap data:', err);
        // More user-friendly error messages
        if (err.message.includes('Network Error')) {
          setError('Unable to connect to the server. Please check your internet connection and try again.');
        } else if (err.message.includes('Server Error')) {
          setError('Server is currently unavailable. Please try again in a few minutes.');
        } else {
          setError(err.message || 'Failed to fetch roadmap data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have both skills and expertise
    if (currentSkills && currentExpertise) {
      fetchRoadmapData();
    } else {
      // Set error if skills or expertise are missing
      setError('Please provide your skills and expertise level on the home page to generate a personalized roadmap.');
      setLoading(false);
    }
  }, [currentSkills, currentExpertise]);

  // Toggle step completion
  const toggleStepCompletion = (stepIndex) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepIndex)) {
        newSet.delete(stepIndex);
      } else {
        newSet.add(stepIndex);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Flowchart</h1>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Error Loading Flowchart</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <i className="fas fa-home mr-2"></i>
                Go Back Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-white text-indigo-600 rounded-lg border border-indigo-600 hover:bg-gray-50 transition-colors"
              >
                <i className="fas fa-sync mr-2"></i>
                Retry
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
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Journey</h1>
          <p className="text-gray-600">
            Career path for <span className="font-semibold text-indigo-600">{currentSkills || 'your selected domain'}</span>
          </p>
        </div>

        {roadmapData ? (
          <div className="mb-8">
            {/* Simplified Flowchart Visualization */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Learning Path</h2>
              
              <div className="space-y-4">
                {/* Start Point */}
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-play text-white text-xs"></i>
                  </div>
                  <div className="flex-grow">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <h3 className="font-medium text-gray-900">Start Your Journey</h3>
                    </div>
                  </div>
                </div>
                
                {/* Learning Steps */}
                {(roadmapData.roadmap || []).map((step, index) => (
                  <div key={index}>
                    {/* Connection Line */}
                    <div className="flex ml-4 pl-3">
                      <div className="w-0.5 h-6 bg-gray-300"></div>
                    </div>
                    
                    {/* Step Node */}
                    <div className="flex items-start">
                      <div 
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 cursor-pointer ${
                          completedSteps.has(index) 
                            ? 'bg-green-500' 
                            : 'bg-indigo-500'
                        }`}
                        onClick={() => toggleStepCompletion(index)}
                      >
                        {completedSteps.has(index) ? (
                          <i className="fas fa-check text-white text-xs"></i>
                        ) : (
                          <span className="text-white text-xs font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div 
                          className={`p-4 rounded-lg border-l-4 ${
                            completedSteps.has(index) 
                              ? 'bg-green-50 border-green-500' 
                              : 'bg-white border-indigo-500 shadow-sm'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900">{step.title}</h3>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {step.duration}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Connection Line to End */}
                <div className="flex ml-4 pl-3">
                  <div className="w-0.5 h-6 bg-gray-300"></div>
                </div>
                
                {/* End Point */}
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-flag text-white text-xs"></i>
                  </div>
                  <div className="flex-grow">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <h3 className="font-medium text-gray-900">Career Success!</h3>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Completion Progress */}
              {roadmapData.roadmap && roadmapData.roadmap.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-gray-700">
                      {completedSteps.size} of {roadmapData.roadmap.length} steps completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completedSteps.size / roadmapData.roadmap.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Flowchart;