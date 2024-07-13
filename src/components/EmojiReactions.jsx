import React from 'react';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';

const EmojiReactions = ({ reactions, onAddReaction, onRemoveReaction }) => {
  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  return (
    <div className="flex items-center space-x-2 mt-2">
      {reactions.map((reaction, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          onClick={() => onRemoveReaction(index)}
          className="p-1"
        >
          {reaction.emoji} {reaction.count}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onAddReaction('👍')}
        className="p-1"
      >
        <Smile className="w-4 h-4 mr-1" />
        React
      </Button>
    </div>
  );
};

export default EmojiReactions;