// components/ChatBot.js
import React, { useState, useEffect, useRef } from 'react';
import { careerAPI } from '../services/api';
import { useAppContext } from '../context/AppContext';

const ChatBot = ({ onClose }) => {
  const { user, updateSkills } = useAppContext();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hi ${user?.full_name || 'there'}! 👋 I'm your personal Career Guidance Assistant. I'm here to help you:
      
🎯 **Plan your career roadmap**
📚 **Identify learning opportunities** 
🚀 **Navigate your professional growth**
💡 **Answer career-related questions**

What would you like to explore today?`,
      sender: 'bot'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return;
    
    const userMessage = inputMessage.trim();
    
    // Add user message
    const newUserMessage = {
      id: Date.now(),
      text: userMessage,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      // Call the enhanced chat API
      const response = await careerAPI.chat(userMessage);
      
      setIsTyping(false);
      
      // Add bot response
      const botResponse = {
        id: Date.now() + 1,
        text: response.bot_message || response.response || "I'm here to help! Could you tell me more about what you'd like to know?",
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botResponse]);
      
      // Update skills if any were extracted
      if (response.extracted_skills && response.extracted_skills.length > 0) {
        updateSkills(response.updated_skills);
        
        // Show skills update notification
        const skillsNotification = {
          id: Date.now() + 2,
          text: `✨ Great! I've updated your skills profile with: ${response.extracted_skills.map(skill => skill.skill).join(', ')}`,
          sender: 'bot',
          type: 'notification'
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, skillsNotification]);
        }, 1000);
      }
      
    } catch (error) {
      setIsTyping(false);
      console.error('Chat error:', error);
      
      // Fallback response
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now, but I'm still here to help! Could you try asking your question again?",
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { text: "Plan my career roadmap", icon: "🗺️" },
    { text: "What skills should I learn?", icon: "📚" },
    { text: "Career opportunities for me", icon: "🚀" },
    { text: "How to switch careers?", icon: "🔄" }
  ];

  const handleQuickAction = (actionText) => {
    setInputMessage(actionText);
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-xl flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <p className="font-semibold">Career Mentor</p>
            <p className="text-xs text-indigo-100">{isTyping ? 'Typing...' : 'Online'}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white hover:text-indigo-200 transition-colors">
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0 self-start">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
            )}
            <div
              className={`max-w-[280px] p-3 rounded-2xl whitespace-pre-line ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-sm'
                  : message.type === 'notification'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-bl-sm'
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
              }`}
            >
              {message.text}
            </div>
            {message.sender === 'user' && (
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center ml-2 flex-shrink-0 self-start">
                <i className="fas fa-user text-white text-sm"></i>
              </div>
            )}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
              <i className="fas fa-robot text-white text-sm"></i>
            </div>
            <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.text)}
                className="text-xs p-2 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors duration-200 text-left"
              >
                <span className="mr-1">{action.icon}</span>
                {action.text}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl">
        <div className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about your career path..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || inputMessage.trim() === ''}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-r-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;