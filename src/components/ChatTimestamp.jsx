import React from 'react';
import { formatTimestamp } from '@/utils/formatTimestamp';

const ChatTimestamp = ({ timestamp }) => {
  return (
    <span className="text-xs text-muted-foreground">
      {formatTimestamp(timestamp)}
    </span>
  );
};

export default ChatTimestamp;