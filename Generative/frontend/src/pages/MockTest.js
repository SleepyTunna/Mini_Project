import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const MockTest = () => {
  const { user } = useAppContext();
  const [topic, setTopic] = useState('');
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [mockTest, setMockTest] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use user profile data if available
  const effectiveSkills = user?.skills;
  const effectiveExpertise = user?.expertise;

  const handleGenerateTest = async () => {
    if (!effectiveSkills || !effectiveExpertise) {
      setError('Please complete your profile with skills and expertise first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Generate a mock test with sample data
      const testData = {
        test_id: `test_${Date.now()}`,
        created_at: new Date().toISOString(),
        questions: [
          {
            question: `What are the key principles of ${effectiveSkills.split(',')[0]?.trim() || 'software development'}?`,
            answer: 'Key principles include modularity, reusability, maintainability, and following best practices specific to the technology stack.'
          },
          {
            question: `How would you optimize performance in a ${effectiveSkills.split(',')[1]?.trim() || 'web'} application?`,
            answer: 'Performance optimization includes code splitting, lazy loading, caching strategies, minimizing bundle size, and efficient algorithm implementation.'
          },
          {
            question: `What debugging techniques do you use for ${effectiveSkills.split(',')[0]?.trim() || 'programming'} projects?`,
            answer: 'Effective debugging includes using browser dev tools, console logging, breakpoints, unit testing, and systematic problem isolation.'
          },
          {
            question: topic ? `Explain advanced concepts in ${topic}` : 'What are the latest industry trends in your field?',
            answer: topic ? `Advanced ${topic} concepts include architecture patterns, performance optimization, and best practices for scalable solutions.` : 'Current trends include cloud computing, AI integration, microservices architecture, and DevOps practices.'
          }
        ]
      };
      setMockTest(testData);
    } catch (err) {
      setError(err.message || 'Failed to generate mock test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswer = (questionIndex) => {
    setExpandedAnswers(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));
  };

  if (error) {
    return (
      <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error</h3>
                <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Mock Test Generator</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Generate personalized practice questions based on your skills and expertise.
          </p>
        </div>

        {/* Test Generation Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Generate New Test</h2>
          
          {/* User Profile Summary */}
          {(effectiveSkills && effectiveExpertise) && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Your Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Skills:</span>
                  <p className="text-gray-700 dark:text-gray-300">{effectiveSkills}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Expertise:</span>
                  <p className="text-gray-700 dark:text-gray-300">{effectiveExpertise}</p>
                </div>
              </div>
            </div>
          )}

          {/* Topic Input */}
          <div className="mb-6">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Specific Topic (Optional)
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Data Structures, Machine Learning, Web Development..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Leave empty for general questions based on your skills and expertise.
            </p>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateTest}
            disabled={loading || !effectiveSkills || !effectiveExpertise}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              loading || !effectiveSkills || !effectiveExpertise
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Test...
              </div>
            ) : (
              'Generate Mock Test'
            )}
          </button>

          {!effectiveSkills || !effectiveExpertise ? (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">
              Please complete your profile with skills and expertise before generating a test.
            </p>
          ) : null}
        </div>

        {/* Mock Test Results */}
        {mockTest && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Your Mock Test</h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Test ID: {mockTest.test_id}
              </div>
            </div>

            {/* Test Info */}
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">📝</span>
                <h3 className="text-lg font-medium text-primary-900 dark:text-primary-200">Test Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-primary-700 dark:text-primary-300">Questions:</span>
                  <span className="ml-2 text-primary-600 dark:text-primary-400">{mockTest.questions.length}</span>
                </div>
                <div>
                  <span className="font-medium text-primary-700 dark:text-primary-300">Created:</span>
                  <span className="ml-2 text-primary-600 dark:text-primary-400">
                    {new Date(mockTest.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {mockTest.questions.map((question, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Question Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex-1 leading-relaxed">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full text-sm font-bold mr-3 flex-shrink-0">
                          {index + 1}
                        </span>
                        {question.question}
                      </h3>
                    </div>

                    {/* Toggle Answer Button */}
                    <button
                      onClick={() => toggleAnswer(index)}
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                        expandedAnswers[index]
                          ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span className="mr-2">
                        {expandedAnswers[index] ? '👁️' : '💡'}
                      </span>
                      {expandedAnswers[index] ? 'Hide Answer' : 'Show Answer'}
                      <svg 
                        className={`ml-2 w-4 h-4 transition-transform duration-200 ${
                          expandedAnswers[index] ? 'transform rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Collapsible Answer Section */}
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      expandedAnswers[index] 
                        ? 'max-h-96 opacity-100' 
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 shadow-inner">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                            </svg>
                          </div>
                          <h4 className="text-sm font-semibold text-green-800 dark:text-green-300">Answer:</h4>
                        </div>
                        <p className="text-green-700 dark:text-green-300 leading-relaxed ml-11">{question.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGenerateTest}
                disabled={loading}
                className="flex-1 py-3 px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Generate New Test
              </button>
              <button
                onClick={() => {
                  const allExpanded = mockTest.questions.every((_, index) => expandedAnswers[index]);
                  const newState = {};
                  mockTest.questions.forEach((_, index) => {
                    newState[index] = !allExpanded;
                  });
                  setExpandedAnswers(newState);
                }}
                className="flex-1 py-3 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                {mockTest.questions.every((_, index) => expandedAnswers[index]) ? 'Hide All Answers' : 'Show All Answers'}
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!mockTest && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Mock Test Generated Yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Click the "Generate Mock Test" button above to create your personalized practice questions.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Your test will include challenging questions tailored to your skills and expertise level.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockTest;