import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Settings } from 'lucide-react';

const AIPersonalityCustomizer = ({ personality, onPersonalityChange }) => {
  const [localPersonality, setLocalPersonality] = useState(personality);

  const handleChange = (key, value) => {
    setLocalPersonality(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onPersonalityChange(localPersonality);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize AI Personality</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={localPersonality.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="tone">Tone</Label>
            <Slider
              id="tone"
              min={0}
              max={100}
              step={1}
              value={[localPersonality.tone]}
              onValueChange={(value) => handleChange('tone', value[0])}
            />
            <div className="flex justify-between text-sm">
              <span>Formal</span>
              <span>Casual</span>
            </div>
          </div>
          <div>
            <Label htmlFor="verbosity">Verbosity</Label>
            <Slider
              id="verbosity"
              min={0}
              max={100}
              step={1}
              value={[localPersonality.verbosity]}
              onValueChange={(value) => handleChange('verbosity', value[0])}
            />
            <div className="flex justify-between text-sm">
              <span>Concise</span>
              <span>Detailed</span>
            </div>
          </div>
          <Button onClick={handleSave}>Save Personality</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIPersonalityCustomizer;