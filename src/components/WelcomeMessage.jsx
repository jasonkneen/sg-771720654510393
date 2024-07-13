import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Code } from 'lucide-react';

const WelcomeMessage = () => {
  return (
    <Card className="mx-auto my-8 max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Code className="mr-2" /> AI Coding Assistant
        </CardTitle>
        <CardDescription>Your personal coding companion</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Welcome! How can I assist you with your coding tasks today?</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Ask coding questions</li>
          <li>Get help with debugging</li>
          <li>Discuss best practices</li>
          <li>Explore new technologies</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default WelcomeMessage;