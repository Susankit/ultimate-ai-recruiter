// frontend/src/context/AppContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default corporate layout light setup
  const [currentScreen, setCurrentScreen] = useState('workspace'); // 'workspace' or 'parameters'
  const [weights, setWeights] = useState({
    w_sem: 30,
    w_exp: 20,
    w_ski: 20,
    w_proj: 20,
    w_beh: 10
  });

  const toggleGlobalTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const updateWeightParameter = (param, value) => {
    setWeights(prev => ({ ...prev, [param]: parseFloat(value) }));
  };

  return (
    <AppContext.Provider value={{
      theme,
      currentScreen,
      setCurrentScreen,
      weights,
      toggleGlobalTheme,
      updateWeightParameter
    }}>
      {children}
    </AppContext.Provider>
  );
};