import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatBot from '../../src/components/ChatBot';
import { careerAPI } from '../../src/services/api';

// Mock the dependencies
jest.mock('../../src/context/AppContext', () => ({
  useAppContext: () => ({
    user: {
      id: 'test-user',
      email: 'test@example.com',
      skills: 'JavaScript, React',
      expertise: 'Intermediate',
    },
    updateSkills: jest.fn(),
    triggerAnalysis: jest.fn(),
  }),
}));

jest.mock('../../src/services/api', () => ({
  careerAPI: {
    chat: jest.fn(),
    updateSkills: jest.fn(),
  },
}));

describe('ChatBot Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders chatbot interface', () => {
    render(<ChatBot />);
    
    expect(screen.getByText('Career Assistant')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message here...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  test('toggles chatbot visibility', () => {
    render(<ChatBot />);
    
    const toggleButton = screen.getByRole('button', { name: /toggle chat/i });
    
    // Initially closed
    expect(screen.queryByText('Career Assistant')).not.toBeVisible();
    
    // Click to open
    fireEvent.click(toggleButton);
    expect(screen.getByText('Career Assistant')).toBeVisible();
    
    // Click to close
    fireEvent.click(toggleButton);
    expect(screen.queryByText('Career Assistant')).not.toBeVisible();
  });

  test('sends message and receives response', async () => {
    const mockResponse = {
      response: 'That\'s great! Learning React is a valuable skill for front-end development.',
    };

    careerAPI.chat.mockResolvedValue(mockResponse);

    render(<ChatBot />);
    
    // Open chatbot
    const toggleButton = screen.getByRole('button', { name: /toggle chat/i });
    fireEvent.click(toggleButton);
    
    const messageInput = screen.getByPlaceholderText('Type your message here...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(messageInput, { target: { value: 'I just learned React' } });
    fireEvent.click(sendButton);
    
    // Check user message appears
    expect(screen.getByText('I just learned React')).toBeInTheDocument();
    
    // Wait for bot response
    await waitFor(() => {
      expect(screen.getByText(mockResponse.response)).toBeInTheDocument();
    });

    expect(careerAPI.chat).toHaveBeenCalledWith({
      message: 'I just learned React',
      context: expect.any(String),
    });
  });

  test('extracts and updates skills from message', async () => {
    const mockChatResponse = {
      response: 'Great! Learning Node.js will help you become a full-stack developer.',
    };

    const mockSkillsResponse = {
      extracted_skills: [
        { skill: 'Node.js', expertise_level: 'Beginner' },
        { skill: 'Express.js', expertise_level: 'Beginner' },
      ],
      updated_skills_list: ['JavaScript', 'React', 'Node.js', 'Express.js'],
    };

    careerAPI.chat.mockResolvedValue(mockChatResponse);
    careerAPI.updateSkills.mockResolvedValue(mockSkillsResponse);

    render(<ChatBot />);
    
    // Open chatbot
    const toggleButton = screen.getByRole('button', { name: /toggle chat/i });
    fireEvent.click(toggleButton);
    
    const messageInput = screen.getByPlaceholderText('Type your message here...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(messageInput, { 
      target: { value: 'I learned Node.js and Express.js for backend development' } 
    });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(careerAPI.updateSkills).toHaveBeenCalledWith({
        user_id: 'test-user',
        message: 'I learned Node.js and Express.js for backend development',
      });
    });
  });

  test('handles message input with Enter key', async () => {
    const mockResponse = {
      response: 'Hello! How can I help you with your career today?',
    };

    careerAPI.chat.mockResolvedValue(mockResponse);

    render(<ChatBot />);
    
    // Open chatbot
    const toggleButton = screen.getByRole('button', { name: /toggle chat/i });
    fireEvent.click(toggleButton);
    
    const messageInput = screen.getByPlaceholderText('Type your message here...');
    
    fireEvent.change(messageInput, { target: { value: 'Hello' } });
    fireEvent.keyPress(messageInput, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    expect(careerAPI.chat).toHaveBeenCalledWith({
      message: 'Hello',
      context: expect.any(String),
    });
  });

  test('prevents sending empty messages', () => {
    render(<ChatBot />);
    
    // Open chatbot
    const toggleButton = screen.getByRole('button', { name: /toggle chat/i });
    fireEvent.click(toggleButton);
    
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    // Try to send empty message
    fireEvent.click(sendButton);
    
    expect(careerAPI.chat).not.toHaveBeenCalled();
  });

  test('shows typing indicator during response', async () => {
    careerAPI.chat.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<ChatBot />);
    
    // Open chatbot
    const toggleButton = screen.getByRole('button', { name: /toggle chat/i });
    fireEvent.click(toggleButton);
    
    const messageInput = screen.getByPlaceholderText('Type your message here...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);
    
    // Check for typing indicator
    expect(screen.getByText(/typing/i)).toBeInTheDocument();
  });

  test('handles chat errors gracefully', async () => {
    careerAPI.chat.mockRejectedValue(new Error('Network error'));

    render(<ChatBot />);
    
    // Open chatbot
    const toggleButton = screen.getByRole('button', { name: /toggle chat/i });
    fireEvent.click(toggleButton);
    
    const messageInput = screen.getByPlaceholderText('Type your message here...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText(/sorry, something went wrong/i)).toBeInTheDocument();
    });
  });

  test('clears message input after sending', async () => {
    const mockResponse = {
      response: 'Message received!',
    };

    careerAPI.chat.mockResolvedValue(mockResponse);

    render(<ChatBot />);
    
    // Open chatbot
    const toggleButton = screen.getByRole('button', { name: /toggle chat/i });
    fireEvent.click(toggleButton);
    
    const messageInput = screen.getByPlaceholderText('Type your message here...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(messageInput.value).toBe('');
    });
  });
});