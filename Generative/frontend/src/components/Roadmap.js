import React from 'react';

const Roadmap = () => {
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
      title: "Learning Plan",
      description: "Get a personalized learning roadmap with courses and resources.",
      icon: "📚",
      status: "upcoming"
    },
    {
      id: 4,
      title: "Skill Development",
      description: "Complete courses and hands-on projects to build required skills.",
      icon: "💪",
      status: "upcoming"
    },
    {
      id: 5,
      title: "Mock Interviews",
      description: "Practice with AI-powered mock interviews and get feedback.",
      icon: "🎤",
      status: "upcoming"
    },
    {
      id: 6,
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
      </div>
    </section>
  );
};

export default Roadmap;