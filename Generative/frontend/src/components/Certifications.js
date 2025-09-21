import React from 'react';

const Certifications = () => {
  const certifications = [
    {
      id: 1,
      name: "AWS Certified Solutions Architect",
      provider: "Amazon Web Services",
      level: "Professional",
      duration: "3-6 months",
      icon: "☁️",
      popularity: 95,
      salaryBoost: "₹13,21,350"
    },
    {
      id: 2,
      name: "Google Cloud Professional Data Engineer",
      provider: "Google Cloud",
      level: "Professional",
      duration: "4-6 months",
      icon: "📊",
      popularity: 88,
      salaryBoost: "₹10,57,080"
    },
    {
      id: 3,
      name: "Certified Kubernetes Administrator",
      provider: "CNCF",
      level: "Professional",
      duration: "2-4 months",
      icon: "🚢",
      popularity: 82,
      salaryBoost: "₹8,80,900"
    },
    {
      id: 4,
      name: "PMP - Project Management Professional",
      provider: "PMI",
      level: "Professional",
      duration: "3-5 months",
      icon: "📋",
      popularity: 90,
      salaryBoost: "₹7,04,720"
    },
    {
      id: 5,
      name: "Certified Ethical Hacker",
      provider: "EC-Council",
      level: "Intermediate",
      duration: "2-3 months",
      icon: "🔒",
      popularity: 75,
      salaryBoost: "₹11,45,170"
    },
    {
      id: 6,
      name: "Azure Solutions Architect Expert",
      provider: "Microsoft",
      level: "Expert",
      duration: "4-7 months",
      icon: "💙",
      popularity: 87,
      salaryBoost: "₹12,33,260"
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Recommended Certifications</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Boost your career with industry-recognized certifications tailored to your career path
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert) => (
            <div 
              key={cert.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{cert.icon}</div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    +{cert.salaryBoost}
                  </div>
                  <div className="text-xs text-gray-500">avg. salary boost</div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-2 line-clamp-2">{cert.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">{cert.provider}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Level:</span>
                  <span className="font-medium">{cert.level}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{cert.duration}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Popularity</span>
                  <span className="font-medium">{cert.popularity}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${cert.popularity}%` }}
                  ></div>
                </div>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 font-medium">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;