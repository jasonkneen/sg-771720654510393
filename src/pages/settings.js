import React from 'react';
import Layout from '@/components/Layout';
import SettingsMenu from '@/components/SettingsMenu';
import AIPersonalityCustomizer from '@/components/AIPersonalityCustomizer';
import ColorSchemeCustomizer from '@/components/ColorSchemeCustomizer';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import useChatState from '@/hooks/useChatState';
import useAIPersonality from '@/hooks/useAIPersonality';
import { useToast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const router = useRouter();
  const { settings, handleSettingsChange } = useChatState();
  const [aiPersonality, updateAIPersonality] = useAIPersonality();
  const [colorScheme, setColorScheme] = React.useState({
    primary: '#3b82f6',
    secondary: '#10b981',
    background: '#ffffff',
    text: '#1f2937',
  });
  const { toast } = useToast();

  const handlePersonalityChange = (newPersonality) => {
    updateAIPersonality(newPersonality);
    toast({
      title: 'AI Personality Updated',
      description: `The AI personality has been updated to ${newPersonality.name}.`,
    });
  };

  const handleColorSchemeChange = (newColorScheme) => {
    setColorScheme(newColorScheme);
    // Apply the new color scheme to the app
    Object.entries(newColorScheme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });
    toast({
      title: 'Color Scheme Updated',
      description: 'The application color scheme has been updated.',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <div className="space-y-8">
          <SettingsMenu settings={settings} onSettingsChange={handleSettingsChange} />
          <AIPersonalityCustomizer personality={aiPersonality} onPersonalityChange={handlePersonalityChange} />
          <ColorSchemeCustomizer colorScheme={colorScheme} onColorSchemeChange={handleColorSchemeChange} />
        </div>
        <Button className="mt-8" onClick={() => router.push('/')}>
          Back to Chat
        </Button>
      </div>
    </Layout>
  );
};

export default SettingsPage;