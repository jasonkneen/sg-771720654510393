import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from './Sidebar';

const CollapsibleSidebar = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.div
      className="relative"
      animate={{ width: isCollapsed ? '60px' : '256px' }}
      transition={{ duration: 0.3 }}
    >
      {isCollapsed ? (
        <div className="h-full bg-muted/50 flex flex-col items-center py-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Sidebar {...props} />
      )}
      {!isCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={toggleSidebar}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
    </motion.div>
  );
};

export default CollapsibleSidebar;