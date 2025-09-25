import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CareerPath = () => {
  const navigate = useNavigate();
  const { currentSkills } = useAppContext();

  const handleExplorePaths = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Engineering Career Paths</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore structured learning paths in various engineering domains. 
            Start by selecting your field of interest.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
          <div className="text-5xl mb-4">🎓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Personalized Engineering Roadmap</h2>
          {currentSkills ? (
            <>
              <p className="text-gray-600 mb-6">
                You have selected <span className="font-semibold text-indigo-600">{currentSkills}</span> as your domain.
              </p>
              <button
                onClick={() => navigate('/roadmap')}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View Your Roadmap
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Select your engineering field and domain to get a personalized learning roadmap.
              </p>
              <button
                onClick={handleExplorePaths}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Explore Engineering Fields
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Structured Learning</h3>
            <p className="text-gray-600">
              Follow a step-by-step roadmap designed by industry experts for your chosen domain.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Video Courses</h3>
            <p className="text-gray-600">
              Access curated YouTube courses related to your engineering domain.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Career Growth</h3>
            <p className="text-gray-600">
              Progress from beginner to expert with guided learning paths.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPath;