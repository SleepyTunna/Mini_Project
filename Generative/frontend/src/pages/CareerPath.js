import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CareerPath = () => {
  const { analysisResult, isLoading } = useAppContext();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Analyzing Your Career Paths</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Our AI is analyzing your skills and experience to find the best career paths for you...
          </p>
        </div>
      </div>
    );
  }

  // No data state
  if (!analysisResult || !analysisResult.career_paths) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Career Paths</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              No analysis data available. Please start by analyzing your career path.
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

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Career Paths</h1>
          <p className="text-gray-600 dark:text-gray-300">Explore all recommended career options for you</p>
        </div>

        {/* Selected Career Path - Featured */}
        {analysisResult.career_paths && analysisResult.career_paths[0] && (
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl mb-8">
            <div className="p-8 text-white">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Recommended Path</h2>
                  <p className="text-primary-100">Your best match</p>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4">{analysisResult.career_paths[0].title}</h3>
              <p className="text-primary-100 text-lg mb-6">{analysisResult.career_paths[0].description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysisResult.career_paths[0].skills_required || analysisResult.career_paths[0].required_skills || []).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white bg-opacity-20 rounded text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Salary Range</h4>
                  <p className="text-primary-100">{analysisResult.career_paths[0].salary_range || '₹52,85,400 - ₹1,05,70,800'}</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Growth Prospect</h4>
                  <p className="text-primary-100">{analysisResult.career_paths[0].growth_prospect || 'High'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Career Paths */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analysisResult.career_paths.map((path, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-lg">💼</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{path.title}</h3>
                    {analysisResult.career_paths[0] && path.title === analysisResult.career_paths[0].title && (
                      <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">{path.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {(path.skills_required || path.required_skills || []).map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Salary Range</h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{path.salary_range || '₹44,04,500 - ₹88,09,000'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Growth Prospect</h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{path.growth_prospect || 'Good'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/roadmap"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <span className="mr-2">🗺️</span>
              View Roadmap
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
            >
              <span className="mr-2">📚</span>
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPath;