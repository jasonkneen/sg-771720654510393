import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';

const SettingsMenu = ({ settings, onSettingsChange }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch
              id="dark-mode"
              checked={settings.darkMode}
              onCheckedChange={(checked) => onSettingsChange({ ...settings, darkMode: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-save">Auto Save</Label>
            <Switch
              id="auto-save"
              checked={settings.autoSave}
              onCheckedChange={(checked) => onSettingsChange({ ...settings, autoSave: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="debug-mode">Debug Mode</Label>
            <Switch
              id="debug-mode"
              checked={settings.debugMode}
              onCheckedChange={(checked) => onSettingsChange({ ...settings, debugMode: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="font-size">Font Size</Label>
            <Select
              id="font-size"
              value={settings.fontSize}
              onValueChange={(value) => onSettingsChange({ ...settings, fontSize: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="language">Language</Label>
            <Select
              id="language"
              value={settings.language}
              onValueChange={(value) => onSettingsChange({ ...settings, language: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsMenu;