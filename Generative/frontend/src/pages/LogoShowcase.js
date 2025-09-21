import React, { useState } from 'react';
import Logo from '../components/Logo';

const LogoShowcase = () => {
  const [animationEnabled, setAnimationEnabled] = useState(true);

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Enhanced MARGDARSHAK Logo Showcase
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience our new interactive MARGDARSHAK logo with multiple sizes, animations, and effects.
          </p>
        </div>

        <div className="flex justify-center mb-12 space-x-4">
          <button
            onClick={() => setAnimationEnabled(!animationEnabled)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              animationEnabled
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            Animations: {animationEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="space-y-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Hero Size</h2>
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x opacity-50"></div>
              <div className="absolute top-4 left-4 w-16 h-16 bg-white/10 rounded-full animate-float"></div>
              <div className="absolute top-8 right-8 w-12 h-12 bg-white/5 rounded-full animate-float-delayed"></div>
              <div className="absolute bottom-6 left-1/3 w-8 h-8 bg-white/10 rounded-full animate-bounce"></div>
              
              <div className="relative z-10 flex justify-center">
                <Logo size="hero" showText={true} animated={animationEnabled} />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Perfect for landing pages and hero sections with floating particles and glow effects.
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Default Size (Navbar)</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex justify-center">
                <Logo size="default" showText={true} animated={animationEnabled} />
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              The standard navigation bar size with perfect balance of visibility and space efficiency.
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Enhanced Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-indigo-600 dark:text-indigo-400 text-2xl mb-4">
                  <i className="fas fa-magic"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Interactive Animations</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Hover effects, loading states, and periodic glow animations
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-purple-600 dark:text-purple-400 text-2xl mb-4">
                  <i className="fas fa-palette"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Dynamic Theming</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Seamless dark/light mode transitions with gradient variations
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-pink-600 dark:text-pink-400 text-2xl mb-4">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Responsive Design</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Multiple sizes optimized for different screen sizes and contexts
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-green-600 dark:text-green-400 text-2xl mb-4">
                  <i className="fas fa-rocket"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Performance Optimized</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Smooth animations with minimal performance impact
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-blue-600 dark:text-blue-400 text-2xl mb-4">
                  <i className="fas fa-cogs"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Highly Configurable</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Size, text display, and animation options can be customized
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-indigo-600 dark:text-indigo-400 text-2xl mb-4">
                  <i className="fas fa-sparkles"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Special Effects</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Glow effects, shine animations, and floating particles
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoShowcase;