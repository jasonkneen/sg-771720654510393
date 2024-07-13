import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    darkMode: false,
    autoSave: true,
    fontSize: 'medium',
    language: 'en',
  });

  const [aiPersonality, setAIPersonality] = useState({
    name: 'AI Assistant',
    tone: 50,
    verbosity: 50,
  });

  const [colorScheme, setColorScheme] = useState({
    primary: '#3b82f6',
    secondary: '#10b981',
    background: '#ffffff',
    text: '#1f2937',
  });

  const updateSettings = (newSettings) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  const updateAIPersonality = (newPersonality) => {
    setAIPersonality((prevPersonality) => ({ ...prevPersonality, ...newPersonality }));
  };

  const updateColorScheme = (newColorScheme) => {
    setColorScheme((prevColorScheme) => ({ ...prevColorScheme, ...newColorScheme }));
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        aiPersonality,
        updateAIPersonality,
        colorScheme,
        updateColorScheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;