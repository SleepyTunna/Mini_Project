import React from 'react';
import Logo from './Logo';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 animate-gradient-x"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
      <div className="absolute top-32 right-20 w-16 h-16 bg-white/5 rounded-full animate-float-delayed"></div>
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Enhanced Logo Display */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Logo size="hero" showText={true} animated={true} />
            
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-xl scale-150 animate-pulse"></div>
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-6">
          Accelerate Your Career with AI-Powered Guidance
        </h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Get personalized career recommendations, skill assessments, and learning paths 
          tailored to your goals and experience level.
        </p>
        <div className="space-x-4">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
            Get Started
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;