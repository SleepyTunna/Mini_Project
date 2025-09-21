import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
  const { user, analysisResult, isLoading } = useAppContext();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Updating Your Analysis</h1>
          <p className="text-gray-600 dark:text-gray-300">
            I'm analyzing your updated skills and refreshing your career recommendations...
          </p>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Dashboard</h1>
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
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Your Dashboard</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Here's your personalized career analysis based on your skills and experience.
          </p>
          
          {/* User Input Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Your Profile</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Your Skills</h3>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">{user.skills}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Experience Level</h3>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">{user.expertise}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
          {/* Career Paths Card */}
          <Link
            to="/career-path"
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">💼</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Career Paths</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Explore all recommended career options tailored to your skills and experience.
              </p>
              <div className="text-primary-600 dark:text-primary-400 font-medium">
                View Paths →
              </div>
            </div>
          </Link>

          {/* Roadmap Card */}
          <Link
            to="/roadmap"
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">🗺️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Roadmap</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Follow a step-by-step guide to achieve your career goals and milestones.
              </p>
              <div className="text-green-600 dark:text-green-400 font-medium">
                View Roadmap →
              </div>
            </div>
          </Link>

          {/* Courses Card */}
          <Link
            to="/courses"
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Courses</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Discover curated learning resources and courses to develop your skills.
              </p>
              <div className="text-blue-600 dark:text-blue-400 font-medium">
                Browse Courses →
              </div>
            </div>
          </Link>

          {/* Mock Test Card */}
          <Link
            to="/mock-test"
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Mock Test</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Take practice tests to assess and improve your knowledge and skills.
              </p>
              <div className="text-purple-600 dark:text-purple-400 font-medium">
                Take Test →
              </div>
            </div>
          </Link>

          {/* Settings Card */}
          <Link
            to="/settings"
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">⚙️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Manage your profile, preferences, and application settings.
              </p>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                View Settings →
              </div>
            </div>
          </Link>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Progress Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Your Progress</h2>
            {analysisResult?.progress ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Skills Mastery</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Learning Path</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Complete your first course to track progress.</p>
            )}
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h2>
            {analysisResult?.recent_activity && analysisResult.recent_activity.length > 0 ? (
              <ul className="space-y-3">
                {analysisResult.recent_activity.slice(0, 3).map((activity, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-300 text-sm">
                    • {activity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No recent activity. Get started with a course!</p>
            )}
          </div>

          {/* Recommended Courses Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recommended Courses</h2>
            {analysisResult?.courses && analysisResult.courses.length > 0 ? (
              <ul className="space-y-3">
                {analysisResult.courses.slice(0, 3).map((course, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-300 text-sm">
                    • {course.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Complete your analysis to get course recommendations.</p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        {analysisResult && (
          <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl">
            <div className="p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">Your Analysis Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Career Paths</h3>
                  <p className="text-2xl font-bold">{analysisResult.career_paths?.length || 0}</p>
                  <p className="text-primary-100 text-sm">Recommended options</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Roadmap Steps</h3>
                  <p className="text-2xl font-bold">{analysisResult.roadmap?.length || 0}</p>
                  <p className="text-primary-100 text-sm">Action items</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Courses</h3>
                  <p className="text-2xl font-bold">{analysisResult.courses?.length || 0}</p>
                  <p className="text-primary-100 text-sm">Learning resources</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;