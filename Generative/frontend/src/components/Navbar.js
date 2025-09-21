// components/Navbar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Logo from './Logo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useAppContext();

  const navItems = [
    { path: '/', label: 'Home', icon: 'fa-home' },
    { path: '/dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { path: '/career-path', label: 'Career Paths', icon: 'fa-road' },
    { path: '/roadmap', label: 'Roadmap', icon: 'fa-map' },
    { path: '/courses', label: 'Courses', icon: 'fa-graduation-cap' },
    { path: '/settings', label: 'Settings', icon: 'fa-cog' },
  ];

  return (
    <nav className={`shadow-lg border-b transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Enhanced Logo */}
          <Logo size="default" showText={true} animated={true} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md flex items-center space-x-1 transition-colors duration-200 ${
                  location.pathname === item.path
                    ? isDarkMode
                      ? 'bg-indigo-900 text-indigo-300'
                      : 'bg-indigo-100 text-indigo-700'
                    : isDarkMode
                      ? 'text-gray-300 hover:text-indigo-400 hover:bg-indigo-900/30'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <i className={`fas ${item.icon}`}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode
                  ? 'text-yellow-400 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            <button className={`px-4 py-2 transition-colors duration-200 ${
              isDarkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'
            }`}>
              <i className="fas fa-bell"></i>
            </button>
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
              JS
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden focus:outline-none transition-colors duration-200 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 border-t transition-colors duration-200 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors duration-200 ${
                    location.pathname === item.path
                      ? isDarkMode
                        ? 'bg-indigo-900 text-indigo-300'
                        : 'bg-indigo-100 text-indigo-700'
                      : isDarkMode
                        ? 'text-gray-300 hover:text-indigo-400 hover:bg-indigo-900/30'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className={`fas ${item.icon} w-5`}></i>
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors duration-200 ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-indigo-400 hover:bg-indigo-900/30'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {isDarkMode ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;