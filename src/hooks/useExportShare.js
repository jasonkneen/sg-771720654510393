import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

const useExportShare = () => {
  const { toast } = useToast();

  const exportConversation = useCallback((conversation) => {
    const content = conversation.messages.map(msg => `${msg.sender}: ${msg.content}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.name || 'conversation'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Conversation Exported',
      description: 'Your conversation has been successfully exported.',
    });
  }, [toast]);

  const shareCodeSnippet = useCallback((snippet) => {
    // This is a placeholder implementation. In a real-world scenario,
    // you might want to send this snippet to a server and generate a shareable link.
    navigator.clipboard.writeText(snippet);

    toast({
      title: 'Code Snippet Copied',
      description: 'The code snippet has been copied to your clipboard.',
    });
  }, [toast]);

  return { exportConversation, shareCodeSnippet };
};

export default useExportShare;