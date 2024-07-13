import { useState, useEffect } from 'react';

const useAIPersonality = (initialPersonality) => {
  const [personality, setPersonality] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aiPersonality');
      return saved ? JSON.parse(saved) : initialPersonality;
    }
    return initialPersonality;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aiPersonality', JSON.stringify(personality));
    }
  }, [personality]);

  const updatePersonality = (newPersonality) => {
    setPersonality(newPersonality);
  };

  return [personality, updatePersonality];
};

export default useAIPersonality;