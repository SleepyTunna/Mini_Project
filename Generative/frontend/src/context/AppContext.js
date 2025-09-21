// context/AppContext.js
import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  user: {
    id: 'user-123',
    email: 'john.smith@example.com',
    fullName: 'John Smith',
    skills: 'Python, JavaScript, React, Node.js',
    expertise: 'Intermediate'
  },
  isDarkMode: true,
  analysisResult: {
    career_paths: [
      {
        title: 'Full Stack Developer',
        description: 'Develop both frontend and backend applications',
        match_percentage: 85,
        skills_required: ['React', 'Node.js', 'Python', 'Database Management'],
        salary_range: '₹61,66,300 - ₹1,14,51,700',
        growth_prospect: 'High - 22% job growth expected'
      },
      {
        title: 'Frontend Developer',
        description: 'Specialize in user interface development',
        match_percentage: 90,
        skills_required: ['React', 'JavaScript', 'CSS', 'UI/UX Design'],
        salary_range: '₹52,85,400 - ₹96,89,900',
        growth_prospect: 'High - 13% job growth expected'
      },
      {
        title: 'Python Developer',
        description: 'Focus on backend development and data processing',
        match_percentage: 80,
        skills_required: ['Python', 'Django', 'APIs', 'Database Design'],
        salary_range: '₹57,25,850 - ₹1,10,11,250',
        growth_prospect: 'Very High - 25% job growth expected'
      }
    ],
    roadmap: [
      {
        step: 1,
        title: 'Master React Fundamentals',
        description: 'Deepen your React knowledge with advanced patterns',
        duration: '2-3 months',
        status: 'in-progress',
        skills_required: ['React', 'JavaScript', 'JSX', 'State Management']
      },
      {
        step: 2,
        title: 'Learn TypeScript',
        description: 'Add type safety to your JavaScript applications',
        duration: '1-2 months',
        status: 'pending',
        skills_required: ['TypeScript', 'Type Definitions', 'Generics']
      },
      {
        step: 3,
        title: 'Build Portfolio Projects',
        description: 'Create 3-5 impressive full-stack projects',
        duration: '3-4 months',
        status: 'pending',
        skills_required: ['Project Management', 'Full-Stack Development', 'Version Control']
      }
    ],
    courses: [
      {
        title: 'Advanced React Patterns',
        provider: 'Tech Academy',
        duration: '40 hours',
        difficulty: 'Intermediate',
        url: 'https://example.com/react-course'
      },
      {
        title: 'TypeScript Masterclass',
        provider: 'Code Institute',
        duration: '25 hours',
        difficulty: 'Beginner',
        url: 'https://example.com/typescript-course'
      },
      {
        title: 'Node.js Backend Development',
        provider: 'Dev University',
        duration: '60 hours',
        difficulty: 'Intermediate',
        url: 'https://example.com/nodejs-course'
      }
    ],
    recent_activity: [
      'Completed React Hooks tutorial',
      'Started TypeScript basics course',
      'Updated profile skills'
    ],
    progress: {
      skills_mastery: 65,
      learning_path: 40
    }
  },
  isLoading: false
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ANALYSIS_RESULT: 'SET_ANALYSIS_RESULT',
  UPDATE_USER_SKILLS: 'UPDATE_USER_SKILLS',
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case actionTypes.SET_ANALYSIS_RESULT:
      return {
        ...state,
        analysisResult: action.payload,
        isLoading: false
      };
    case actionTypes.UPDATE_USER_SKILLS:
      return {
        ...state,
        user: {
          ...state.user,
          skills: action.payload
        }
      };
    case actionTypes.TOGGLE_DARK_MODE:
      return {
        ...state,
        isDarkMode: !state.isDarkMode
      };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const setLoading = (isLoading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: isLoading });
  };

  const setAnalysisResult = (result) => {
    dispatch({ type: actionTypes.SET_ANALYSIS_RESULT, payload: result });
  };

  const updateUserSkills = (skills) => {
    dispatch({ type: actionTypes.UPDATE_USER_SKILLS, payload: skills });
  };

  const toggleDarkMode = () => {
    dispatch({ type: actionTypes.TOGGLE_DARK_MODE });
  };

  const value = {
    ...state,
    setLoading,
    setAnalysisResult,
    updateUserSkills,
    toggleDarkMode
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};