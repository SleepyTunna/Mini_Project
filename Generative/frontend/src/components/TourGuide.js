import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { careerAPI } from '../services/api';

const TourGuide = () => {
  const [tourData, setTourData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  const { currentSkills, currentExpertise } = useAppContext();

  // Fetch tour guide data from API
  const fetchTourGuide = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!currentSkills || !currentExpertise) {
        throw new Error('Skills and expertise are required to generate a tour guide');
      }
      
      const data = await careerAPI.analyzeCareer(currentSkills, currentExpertise);
      console.log('Received tour guide data:', data);
      
      if (!data || !data.roadmap) {
        throw new Error('Invalid response from server. Please try again.');
      }
      
      setTourData(data);
      setActiveStep(0);
      
      // Add initial chat message
      setChatMessages([
        {
          id: 1,
          text: `Hello! 👋 I'm your TourGuide for ${currentSkills}. I'm here to answer any questions you have about your learning journey. What would you like to know?`,
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      console.error('Error fetching tour guide data:', err);
      setError(err.message || 'Failed to fetch tour guide data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentSkills && currentExpertise) {
      fetchTourGuide();
    }
  }, [currentSkills, currentExpertise]);

  const nextStep = () => {
    if (tourData && activeStep < tourData.roadmap.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: chatInput,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const userInput = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    try {
      // Send message to AI chat API
      const response = await careerAPI.chat(userInput);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response?.bot_message || "I'm here to help guide your career journey! What specific questions do you have?",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm currently having trouble connecting. Could you try asking your question again in a moment?",
        sender: 'ai',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Generating Your Personalized Tour Guide</h3>
        <p className="text-gray-600 mt-2">Creating a step-by-step guide for your {currentSkills || 'selected domain'} journey...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-red-500 mb-4">
          <i className="fas fa-exclamation-circle text-3xl"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Error Loading Tour Guide</h3>
        <p className="text-gray-600 mt-2">{error}</p>
        <button
          onClick={fetchTourGuide}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!tourData) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-gray-400 mb-4">
          <i className="fas fa-route text-3xl"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Personalized Tour Guide</h3>
        <p className="text-gray-600 mt-2">Provide your skills and expertise to get a personalized tour guide for your career journey.</p>
      </div>
    );
  }

  const currentStep = tourData.roadmap[activeStep];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Your Career Tour Guide</h2>
          <span className="text-sm font-medium text-indigo-600">
            Step {activeStep + 1} of {tourData.roadmap.length}
          </span>
        </div>
      </div>

      <div className="p-6">
        {currentStep && (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-indigo-800 font-bold">{activeStep + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{currentStep.title}</h3>
            </div>
            
            <p className="text-gray-600 mb-4">{currentStep.description}</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Duration: {currentStep.duration}</h4>
              {currentStep.resources && currentStep.resources.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Resources:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {currentStep.resources.map((resource, index) => (
                      <li key={index}>{resource}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={prevStep}
            disabled={activeStep === 0}
            className={`px-4 py-2 rounded-lg ${
              activeStep === 0 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          
          {activeStep < tourData.roadmap.length - 1 ? (
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={() => alert('Congratulations! You\'ve completed your career tour guide.')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Complete Tour
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((activeStep + 1) / tourData.roadmap.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="border-t border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ask Your TourGuide</h3>
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="text-indigo-600 hover:text-indigo-800"
          >
            {isChatOpen ? 'Hide Chat' : 'Show Chat'}
          </button>
        </div>
        
        {isChatOpen && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="h-40 overflow-y-auto mb-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block px-3 py-2 rounded-lg max-w-xs ${
                      message.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="text-left">
                  <div className="inline-block px-3 py-2 rounded-lg bg-white text-gray-800 border border-gray-200">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleChatKeyPress}
                placeholder="Ask a question about this step..."
                className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={isChatLoading}
              />
              <button
                onClick={handleChatSend}
                disabled={isChatLoading || !chatInput.trim()}
                className={`bg-indigo-600 text-white px-4 rounded-r-lg transition-colors duration-200 ${
                  isChatLoading || !chatInput.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-indigo-700'
                }`}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourGuide;