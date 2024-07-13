import React from 'react';
import Layout from '@/components/Layout';
import SettingsMenu from '@/components/SettingsMenu';
import AIPersonalityCustomizer from '@/components/AIPersonalityCustomizer';
import ColorSchemeCustomizer from '@/components/ColorSchemeCustomizer';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { useAppContext } from '@/context/AppContext';

const SettingsPage = () => {
  const router = useRouter();
  const { settings, updateSettings, aiPersonality, updateAIPersonality, colorScheme, updateColorScheme } = useAppContext();

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <div className="space-y-8">
          <SettingsMenu settings={settings} onSettingsChange={updateSettings} />
          <AIPersonalityCustomizer personality={aiPersonality} onPersonalityChange={updateAIPersonality} />
          <ColorSchemeCustomizer colorScheme={colorScheme} onColorSchemeChange={updateColorScheme} />
        </div>
        <Button className="mt-8" onClick={() => router.push('/')} aria-label="Back to Chat">
          Back to Chat
        </Button>
      </div>
    </Layout>
  );
};

export default SettingsPage;