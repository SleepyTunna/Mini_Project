// Test Google Books API integration
const testGoogleBooksAPI = async () => {
  try {
    const searchTerm = 'python programming';
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&maxResults=5`
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('Google Books API Response:', data);
      
      if (data && data.items) {
        console.log(`Found ${data.items.length} books`);
        data.items.forEach((book, index) => {
          console.log(`${index + 1}. ${book.volumeInfo.title} by ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author'}`);
        });
      } else {
        console.log('No books found');
      }
    } else {
      console.error('Error response from Google Books API:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error fetching from Google Books API:', error);
  }
};

// Run the test
testGoogleBooksAPI();