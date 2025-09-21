// pages/Landing.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Landing = () => {
  const [skills, setSkills] = useState('');
  const [expertise, setExpertise] = useState('Beginner');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { isDarkMode } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 2000);
  };

  const expertiseLevels = [
    'Beginner', 'Intermediate', 'Advanced', 'Expert'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Discover Your Perfect <span className="text-indigo-600">Career Path</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          AI-powered career analysis to help you find the best career paths based on your skills and expertise
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-robot text-indigo-600 dark:text-indigo-400"></i>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">AI Analysis</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Gemini AI</p>
            </div>
          </div>
          
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-road text-green-600 dark:text-green-400"></i>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Personalized Roadmap</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Step-by-step guidance</p>
            </div>
          </div>
          
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 border border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
              <i className="fas fa-book-open text-purple-600 dark:text-purple-400"></i>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">Course Recommendations</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Curated learning resources</p>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Form */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-12 border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Analyze Your Skills</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Skills <span className="text-indigo-600">*</span>
            </label>
            <textarea
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Enter your skills separated by commas (e.g., Python, JavaScript, React, Data Analysis)"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              rows="3"
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">List all your technical and soft skills</p>
          </div>
          
          <div className="mb-8">
            <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expertise Level <span className="text-indigo-600">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {expertiseLevels.map((level) => (
                <div key={level} className="relative">
                  <input
                    type="radio"
                    id={level}
                    name="expertise"
                    value={level}
                    checked={expertise === level}
                    onChange={() => setExpertise(level)}
                    className="hidden peer"
                  />
                  <label
                    htmlFor={level}
                    className="block p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer transition-all duration-200 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/30 peer-checked:text-indigo-700 dark:peer-checked:text-indigo-300 peer-checked:font-medium hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {level}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Analyzing your skills...
              </>
            ) : (
              <>
                <i className="fas fa-search mr-2"></i>
                Find My Career Path
              </>
            )}
          </button>
        </form>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-12 text-center">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
              <i className="fas fa-analytics text-blue-600 dark:text-blue-400 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Skill Analysis</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our AI analyzes your skills and expertise to identify your strengths and areas for development.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
              <i className="fas fa-route text-purple-600 dark:text-purple-400 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Career Matching</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We match you with the top 3 career paths that align with your skills and aspirations.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
              <i className="fas fa-graduation-cap text-green-600 dark:text-green-400 text-xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Learning Path</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get a personalized roadmap and course recommendations to achieve your career goals.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">What Users Say</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white bg-opacity-10 p-5 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-user text-white"></i>
              </div>
              <div>
                <p className="font-semibold">Sarah Johnson</p>
                <p className="text-indigo-200">Software Developer</p>
              </div>
            </div>
            <p className="italic">
              "MARGDARSHAK helped me transition from frontend development to full-stack. The personalized roadmap was incredibly accurate!"
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-5 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-user text-white"></i>
              </div>
              <div>
                <p className="font-semibold">Michael Chen</p>
                <p className="text-indigo-200">Data Analyst</p>
              </div>
            </div>
            <p className="italic">
              "The AI accurately identified my skill gaps and recommended courses that actually helped me advance in my career."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;