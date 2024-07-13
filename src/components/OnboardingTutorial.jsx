import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const OnboardingTutorial = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to AI Coding Assistant',
      description: 'This tutorial will guide you through the main features of our application.',
    },
    {
      title: 'Chat with AI',
      description: 'Type your coding questions or problems in the input box at the bottom and press Enter or click Send.',
    },
    {
      title: 'Manage Chats',
      description: 'Use the sidebar to create new chats, switch between existing ones, or rename them.',
    },
    {
      title: 'Export and Share',
      description: 'You can export your chat history or share specific code snippets using the buttons provided.',
    },
    {
      title: 'Customize Settings',
      description: 'Click the settings icon to customize the app appearance and behavior.',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{steps[currentStep].title}</DialogTitle>
          <DialogDescription>{steps[currentStep].description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleSkip}>Skip Tutorial</Button>
          <Button onClick={handleNext}>
            {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTutorial;