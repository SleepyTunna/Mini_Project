import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Courses = () => {
  const { analysisResult, isLoading } = useAppContext();

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
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Recommended Courses</h1>
          <p className="text-gray-600 dark:text-gray-300">Curated learning resources to develop your skills</p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analysisResult.courses.map((course, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-shadow">
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