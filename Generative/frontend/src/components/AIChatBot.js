import React, { useState, useRef, useEffect } from 'react';
import { careerAPI } from '../services/api';

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 I'm your TourGuide, here to help you navigate your career journey. What would you like to explore today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]); // Track conversation context
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to search for books using Google Books API with API key
  const searchBooks = async (query) => {
    try {
      // Use the Google Books API with the API key
      const GOOGLE_BOOKS_API_KEY = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY || 'AIzaSyAytoNZiRTkprioNLhFVd9sUmAkn-RVyMg';
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query + ' course')}&maxResults=3&key=${GOOGLE_BOOKS_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.items) {
          return data.items.map(book => ({
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author',
            description: book.volumeInfo.description ? book.volumeInfo.description.substring(0, 150) + '...' : 'No description available',
            url: book.volumeInfo.infoLink || '#',
            thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/128x192?text=No+Cover',
            publishedDate: book.volumeInfo.publishedDate || 'Unknown Date'
          }));
        }
      }
      return [];
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, { role: 'user', content: inputValue }]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Check if the user is asking about books or learning resources
      const lowerInput = inputValue.toLowerCase();
      const bookRelatedKeywords = ['book', 'books', 'reading', 'learn', 'study', 'textbook', 'manual', 'guide', 'handbook', 'course', 'tutorial'];
      const isBookQuery = bookRelatedKeywords.some(keyword => lowerInput.includes(keyword));
      
      if (isBookQuery) {
        // For book-related queries, search Google Books API
        const books = await searchBooks(inputValue);
        if (books.length > 0) {
          let bookResponse = "Here are some recommended books and learning resources for your query:\n\n";
          books.forEach((book, index) => {
            bookResponse += `${index + 1}. **${book.title}** by ${book.authors}\n`;
            bookResponse += `   Published: ${book.publishedDate}\n`;
            bookResponse += `   ${book.description}\n`;
            bookResponse += `   [View Book](${book.url})\n\n`;
          });
          bookResponse += "I hope these resources help with your learning journey!";
          
          const aiMessage = {
            id: Date.now() + 1,
            text: bookResponse,
            sender: 'ai',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, aiMessage]);
          setConversationHistory(prev => [...prev, { role: 'assistant', content: bookResponse }]);
        } else {
          // Fallback to normal AI response
          let response;
          try {
            response = await careerAPI.chat(inputValue);
          } catch (apiError) {
            console.error('API error:', apiError);
            response = null;
          }
          
          const aiMessage = {
            id: Date.now() + 1,
            text: response?.bot_message || "I'm here to help guide your career journey! Based on your skills and interests, I can provide personalized advice. What specific questions do you have?",
            sender: 'ai',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, aiMessage]);
          setConversationHistory(prev => [...prev, { role: 'assistant', content: aiMessage.text }]);
        }
      } else {
        // For non-book queries, use the normal AI response
        let response;
        try {
          response = await careerAPI.chat(inputValue);
        } catch (apiError) {
          console.error('API error:', apiError);
          response = null;
        }
        
        const aiMessage = {
          id: Date.now() + 1,
          text: response?.bot_message || "I'm here to help guide your career journey! Based on your skills and interests, I can provide personalized advice. What specific questions do you have?",
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setConversationHistory(prev => [...prev, { role: 'assistant', content: aiMessage.text }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Add friendly error message
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm currently having trouble connecting. Could you try asking your question again in a moment?",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: "I'm currently having trouble connecting. Could you try asking your question again in a moment?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-all duration-300 z-50 flex items-center justify-center"
        aria-label="Toggle AI Chat"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-robot'} text-xl`}></i>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-md h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
          {/* Chat Header */}
          <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold flex items-center">
              <i className="fas fa-robot mr-2"></i>
              TourGuide - Your Career Buddy
            </h3>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white text-gray-800 border border-gray-200 rounded-lg rounded-bl-none px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <p className="text-xs mt-1 text-gray-500">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
            <div className="flex">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your career..."
                className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows="2"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className={`bg-indigo-600 text-white px-4 rounded-r-lg transition-colors duration-200 ${
                  isLoading || !inputValue.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-indigo-700'
                }`}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">I'm here to support you on your journey!</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBot;