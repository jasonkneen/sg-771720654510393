// Debug logging utility

const DEBUG_MODE = process.env.NODE_ENV === 'development';

const debugLogger = {
  log: (message, ...args) => {
    if (DEBUG_MODE) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  
  error: (message, ...args) => {
    if (DEBUG_MODE) {
      console.error(`[DEBUG ERROR] ${message}`, ...args);
    }
  },
  
  warn: (message, ...args) => {
    if (DEBUG_MODE) {
      console.warn(`[DEBUG WARNING] ${message}`, ...args);
    }
  },
  
  info: (message, ...args) => {
    if (DEBUG_MODE) {
      console.info(`[DEBUG INFO] ${message}`, ...args);
    }
  },
  
  group: (label) => {
    if (DEBUG_MODE) {
      console.group(`[DEBUG GROUP] ${label}`);
    }
  },
  
  groupEnd: () => {
    if (DEBUG_MODE) {
      console.groupEnd();
    }
  },
  
  time: (label) => {
    if (DEBUG_MODE) {
      console.time(`[DEBUG TIME] ${label}`);
    }
  },
  
  timeEnd: (label) => {
    if (DEBUG_MODE) {
      console.timeEnd(`[DEBUG TIME] ${label}`);
    }
  }
};

export default debugLogger;