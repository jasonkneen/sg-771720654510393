// messageProcessor.worker.js
self.addEventListener('message', async (event) => {
  const { message, type } = event.data;

  switch (type) {
    case 'process':
      // Simulate heavy processing
      await new Promise(resolve => setTimeout(resolve, 100));
      const processedMessage = {
        ...message,
        content: message.content.toUpperCase(), // Example processing
        timestamp: new Date().toISOString()
      };
      self.postMessage({ type: 'processed', message: processedMessage });
      break;
    default:
      console.error('Unknown message type:', type);
  }
});