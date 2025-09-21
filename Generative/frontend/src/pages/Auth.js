import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSuccess = (user) => {
    // Redirect to dashboard after successful authentication
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isLogin ? 'Sign in to continue your journey' : 'Join us to start your career development'}
          </p>
        </div>

        {/* Toggle between Login and Register */}
        <div className="flex justify-center">
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                isLogin
                  ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                !isLogin
                  ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Render Login or Register component */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {isLogin ? (
            <Login onSuccess={handleSuccess} />
          ) : (
            <Register onSuccess={handleSuccess} />
          )}
        </div>

        {/* Switch form link */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;