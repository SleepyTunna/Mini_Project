import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CompassLogo from './CompassLogo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: 'fa-home' },
    { path: '/career-path', label: 'Career Paths', icon: 'fa-road' },
    { path: '/roadmap', label: 'Roadmap', icon: 'fa-map' },
    { path: '/flowchart', label: 'Flowchart', icon: 'fa-project-diagram' },
    { path: '/book-test', label: 'Books', icon: 'fa-book' }
  ];

  return (
    <nav className="border-b transition-colors duration-200 bg-white border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="mr-3">
              <CompassLogo className="w-12 h-12 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 professional-heading">Student Compass</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md flex items-center space-x-1 transition-colors duration-200 professional-button ${
                  location.pathname === item.path
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <i className={`fas ${item.icon}`}></i>
                <span className="font-bold">{item.label}</span>
              </Link>
            ))}
          </div>

          <button
            className="md:hidden focus:outline-none transition-colors duration-200 text-gray-600 hover:text-gray-800 professional-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t transition-colors duration-200 border-gray-200 bg-gray-50">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors duration-200 professional-button ${
                    location.pathname === item.path
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className={`fas ${item.icon} w-5`}></i>
                  <span className="font-bold">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;