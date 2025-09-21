import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../src/components/Login';
import { careerAPI, tokenManager } from '../../src/services/api';

// Mock the dependencies
jest.mock('../../src/context/AppContext', () => ({
  useAppContext: () => ({
    setUser: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    loading: false,
    error: null,
  }),
}));

jest.mock('../../src/services/api', () => ({
  careerAPI: {
    login: jest.fn(),
  },
  tokenManager: {
    setToken: jest.fn(),
  },
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(<Login />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  test('updates form data on input change', () => {
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('submits form with correct data', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      full_name: 'Test User',
      skills: 'React, JavaScript',
      expertise: 'Intermediate',
    };

    const mockResponse = {
      access_token: 'fake-token',
      user: mockUser,
    };

    careerAPI.login.mockResolvedValue(mockResponse);

    const onSuccess = jest.fn();
    render(<Login onSuccess={onSuccess} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(careerAPI.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(tokenManager.setToken).toHaveBeenCalledWith('fake-token');
    expect(onSuccess).toHaveBeenCalledWith(mockUser);
  });

  test('displays error message on login failure', async () => {
    careerAPI.login.mockRejectedValue(new Error('Invalid credentials'));

    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  test('prevents submission with empty fields', () => {
    render(<Login />);
    
    const submitButton = screen.getByRole('button', { name: 'Login' });
    
    // Try to submit empty form
    fireEvent.click(submitButton);
    
    // Form should not be submitted due to HTML5 validation
    expect(careerAPI.login).not.toHaveBeenCalled();
  });

  test('shows loading state during submission', async () => {
    // Mock a delayed response
    careerAPI.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Check for loading state
    expect(screen.getByText('Logging in...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});