import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const AIPersonalityDisplay = ({ personality }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>AI Personality: {personality.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span>Tone</span>
              <span>{personality.tone}%</span>
            </div>
            <Progress value={personality.tone} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>Formal</span>
              <span>Casual</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span>Verbosity</span>
              <span>{personality.verbosity}%</span>
            </div>
            <Progress value={personality.verbosity} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>Concise</span>
              <span>Detailed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIPersonalityDisplay;