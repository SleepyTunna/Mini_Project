// Simple test to verify AI service functionality
import { careerAPI } from './services/api';

export const testAIService = async () => {
  try {
    console.log('Testing AI service...');
    
    // Test health check
    const health = await careerAPI.healthCheck();
    console.log('Health check:', health);
    
    // Test career analysis
    const analysis = await careerAPI.analyzeCareer('javascript, react, node.js', 'intermediate');
    console.log('Career analysis:', analysis);
    
    // Test chat functionality
    const chatResponse = await careerAPI.chat('What are the best career paths for a JavaScript developer?');
    console.log('Chat response:', chatResponse);
    
    return {
      success: true,
      health,
      analysis,
      chatResponse
    };
  } catch (error) {
    console.error('AI Service Test Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Run test if this file is executed directly
if (typeof window !== 'undefined' && window.location.pathname === '/test-ai') {
  testAIService().then(result => {
    console.log('Test Result:', result);
  });
}