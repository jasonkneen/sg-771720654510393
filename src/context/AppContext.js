import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

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

  const { toast } = useToast();

  const updateSettings = useCallback((newSettings) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
    toast({
      title: 'Settings Updated',
      description: 'Your settings have been successfully updated.',
    });
  }, [toast]);

  const updateAIPersonality = useCallback((newPersonality) => {
    setAIPersonality((prevPersonality) => ({ ...prevPersonality, ...newPersonality }));
    toast({
      title: 'AI Personality Updated',
      description: `The AI personality has been updated to ${newPersonality.name}.`,
    });
  }, [toast]);

  const updateColorScheme = useCallback((newColorScheme) => {
    setColorScheme((prevColorScheme) => ({ ...prevColorScheme, ...newColorScheme }));
    // Apply the new color scheme to the app
    Object.entries(newColorScheme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
    toast({
      title: 'Color Scheme Updated',
      description: 'The application color scheme has been updated.',
    });
  }, [toast]);

  const value = {
    settings,
    updateSettings,
    aiPersonality,
    updateAIPersonality,
    colorScheme,
    updateColorScheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;