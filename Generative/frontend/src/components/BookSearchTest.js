import React, { useState } from 'react';

const BookSearchTest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchBooks = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    setBooks([]);
    
    try {
      // Use the Google Books API with the API key from env
      const GOOGLE_BOOKS_API_KEY = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY || 'AIzaSyAytoNZiRTkprioNLhFVd9sUmAkn-RVyMg';
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&maxResults=6&key=${GOOGLE_BOOKS_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.items && data.items.length > 0) {
          // Process Google Books API response
          const processedBooks = data.items.map(book => ({
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
            description: book.volumeInfo.description ? book.volumeInfo.description.substring(0, 150) + '...' : 'No description available',
            thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x192?text=No+Cover',
            url: book.volumeInfo.infoLink || '#',
            publishedDate: book.volumeInfo.publishedDate || 'Unknown Date',
            pageCount: book.volumeInfo.pageCount || 'Unknown'
          }));
          
          setBooks(processedBooks);
        } else {
          setError('No books found for your search term.');
        }
      } else {
        setError('Failed to fetch books. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('An error occurred while fetching books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Google Books API Test</h2>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for books..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            {loading ? 'Searching...' : 'Search Books'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {books.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Search Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <div className="p-4">
                  <div className="flex justify-center mb-4">
                    <img 
                      src={book.thumbnail} 
                      alt={book.title}
                      className="h-48 object-contain"
                    />
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">{book.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{book.authors}</p>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-3">{book.description}</p>
                  <div className="flex justify-between text-xs text-gray-400 mb-3">
                    <span>{book.publishedDate}</span>
                    <span>{book.pageCount} pages</span>
                  </div>
                  <a 
                    href={book.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                  >
                    View Book
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSearchTest;