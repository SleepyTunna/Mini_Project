import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from '../../src/components/Register';
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
    register: jest.fn(),
  },
  tokenManager: {
    setToken: jest.fn(),
  },
}));

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders registration form', () => {
    render(<Register />);
    
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
  });

  test('updates form data on input change', () => {
    render(<Register />);
    
    const nameInput = screen.getByPlaceholderText('Enter your full name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('submits registration form with correct data', async () => {
    const mockUser = {
      id: '1',
      email: 'john@example.com',
      full_name: 'John Doe',
      skills: 'JavaScript, React',
      expertise: 'Beginner',
    };

    const mockResponse = {
      access_token: 'fake-token',
      user: mockUser,
    };

    careerAPI.register.mockResolvedValue(mockResponse);

    const onSuccess = jest.fn();
    render(<Register onSuccess={onSuccess} />);
    
    const nameInput = screen.getByPlaceholderText('Enter your full name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const skillsInput = screen.getByPlaceholderText('e.g., JavaScript, Python, React');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(skillsInput, { target: { value: 'JavaScript, React' } });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(careerAPI.register).toHaveBeenCalledWith({
        full_name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        skills: 'JavaScript, React',
        expertise: 'Beginner', // Default value
      });
    });

    expect(tokenManager.setToken).toHaveBeenCalledWith('fake-token');
    expect(onSuccess).toHaveBeenCalledWith(mockUser);
  });

  test('displays error message on registration failure', async () => {
    careerAPI.register.mockRejectedValue(new Error('Email already exists'));

    render(<Register />);
    
    const nameInput = screen.getByPlaceholderText('Enter your full name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  test('shows loading state during submission', async () => {
    careerAPI.register.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<Register />);
    
    const nameInput = screen.getByPlaceholderText('Enter your full name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: 'Create Account' });
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Creating Account...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test('handles expertise level selection', () => {
    render(<Register />);
    
    const expertiseSelect = screen.getByDisplayValue('Beginner');
    
    fireEvent.change(expertiseSelect, { target: { value: 'Advanced' } });
    
    expect(expertiseSelect.value).toBe('Advanced');
  });
});