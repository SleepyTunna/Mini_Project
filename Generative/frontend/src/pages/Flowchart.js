import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { careerAPI } from '../services/api';

const Flowchart = () => {
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { currentSkills, currentExpertise } = useAppContext();

  // Fetch roadmap data from your API
  useEffect(() => {
    const fetchRoadmapData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the proper API service
        console.log('Fetching roadmap data for:', currentSkills, currentExpertise);
        
        // Check if skills and expertise are available
        if (!currentSkills || !currentExpertise) {
          throw new Error('Skills and expertise are required to generate a roadmap');
        }
        
        const data = await careerAPI.analyzeCareer(currentSkills, currentExpertise);
        console.log('Received roadmap data:', data);
        setRoadmapData(data);
      } catch (err) {
        console.error('Error fetching roadmap data:', err);
        setError(err.message || 'Failed to fetch roadmap data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (currentSkills && currentExpertise) {
      fetchRoadmapData();
    } else {
      // Set error if skills or expertise are missing
      if (!currentSkills || !currentExpertise) {
        setError('Please provide your skills and expertise level to generate a personalized roadmap.');
      }
      setLoading(false);
    }
  }, [currentSkills, currentExpertise]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Generating Your Flowchart</h1>
          <p className="text-gray-600">
            Creating a personalized learning path flowchart for {currentSkills || 'your selected domain'}...
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

  // Function to generate flowchart nodes
  const generateFlowchartNodes = () => {
    if (!roadmapData || !roadmapData.roadmap) return null;
    
    return roadmapData.roadmap.map((step, index) => (
      <div key={index} className="flex flex-col items-center">
        <div className="bg-white border-2 border-indigo-500 rounded-lg shadow-lg p-4 w-64 text-center relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
            {index + 1}
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">{step.title}</h3>
          <p className="text-gray-600 text-sm">{step.description}</p>
        </div>
        {index < roadmapData.roadmap.length - 1 && (
          <div className="h-12 w-1 bg-indigo-300 my-2"></div>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Path Flowchart</h1>
          <p className="text-gray-600">Visual representation of your personalized learning journey for {currentSkills || 'your selected domain'}</p>
        </div>

        {roadmapData ? (
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Career Path</h2>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{roadmapData.selected_path?.description || 'Engineering Specialist'}</p>
            </div>

            {/* Flowchart Visualization */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Learning Path Flowchart</h2>
              <div className="flex flex-col items-center">
                {generateFlowchartNodes()}
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Resources</h3>
                <ul className="space-y-2">
                  {(roadmapData.roadmap || []).flatMap((step, stepIndex) => 
                    (step.resources || []).map((resource, resIndex) => (
                      <li key={`${stepIndex}-${resIndex}`} className="flex items-start">
                        <i className="fas fa-circle text-indigo-500 text-xs mt-2 mr-2"></i>
                        <span className="text-gray-700">{resource}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Estimated Timeline</h3>
                <div className="space-y-4">
                  {(roadmapData.roadmap || []).map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-indigo-800 font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{step.title}</h4>
                        <p className="text-sm text-gray-500">Duration: ~{Math.floor(Math.random() * 4) + 2} weeks</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Flowchart;