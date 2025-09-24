import React from 'react';
import BookSearchTest from '../components/BookSearchTest';

const BookTest = () => {
  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Books Integration Test</h1>
          <p className="text-gray-600">Testing Google Books API integration</p>
        </div>
        
        <BookSearchTest />
      </div>
    </div>
  );
};

export default BookTest;