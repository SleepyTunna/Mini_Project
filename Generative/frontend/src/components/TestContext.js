import React, { createContext, useContext, useState } from 'react';

const TestContext = createContext();

export const TestProvider = ({ children }) => {
  const [testState, setTestState] = useState(null);

  return (
    <TestContext.Provider value={{ testState, setTestState }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTestContext = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTestContext must be used within a TestProvider');
  }
  return context;
};