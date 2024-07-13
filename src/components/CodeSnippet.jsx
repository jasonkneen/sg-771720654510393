import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { Button } from '@/components/ui/button';
import { Copy, Check, Share } from 'lucide-react';

const CodeSnippet = ({ language, content, onShare }) => {
  const codeRef = useRef(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [content, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 code-block">
      <pre className="p-6 bg-black rounded-md overflow-x-auto">
        <code ref={codeRef} className={`language-${language} text-sm`}>
          {content}
        </code>
      </pre>
      <div className="absolute top-2 right-2 space-x-2 code-block-icons">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          className="hover:bg-gray-700/50 p-1 text-gray-300"
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onShare(content)}
          className="hover:bg-gray-700/50 p-1 text-gray-300"
          aria-label="Share code snippet"
        >
          <Share className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CodeSnippet;