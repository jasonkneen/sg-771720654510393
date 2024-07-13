// src/utils/logger.js

const logLevels = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

class Logger {
  constructor() {
    this.logs = [];
  }

  log(level, message, meta = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
    };

    this.logs.push(logEntry);

    // In a production environment, you might want to send logs to a server or external logging service
    console[level](JSON.stringify(logEntry));
  }

  error(message, meta) {
    this.log(logLevels.ERROR, message, meta);
  }

  warn(message, meta) {
    this.log(logLevels.WARN, message, meta);
  }

  info(message, meta) {
    this.log(logLevels.INFO, message, meta);
  }

  debug(message, meta) {
    this.log(logLevels.DEBUG, message, meta);
  }

  getLogs() {
    return this.logs;
  }
}

export default new Logger();