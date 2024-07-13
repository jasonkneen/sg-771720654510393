import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Palette } from 'lucide-react';

const ColorSchemeCustomizer = ({ colorScheme, onColorSchemeChange }) => {
  const [localColorScheme, setLocalColorScheme] = useState(colorScheme);

  const handleChange = (key, value) => {
    setLocalColorScheme(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onColorSchemeChange(localColorScheme);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize Color Scheme</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {Object.entries(localColorScheme).map(([key, value]) => (
            <div key={key}>
              <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
              <Input
                id={key}
                type="color"
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </div>
          ))}
          <Button onClick={handleSave}>Save Color Scheme</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColorSchemeCustomizer;