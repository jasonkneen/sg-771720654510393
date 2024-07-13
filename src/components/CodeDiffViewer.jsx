import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { diffLines } from 'diff';

const CodeDiffViewer = ({ oldCode, newCode, language }) => {
  const diff = diffLines(oldCode, newCode);

  return (
    <div className="code-diff-viewer">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers
        wrapLines
        customStyle={{
          margin: 0,
          padding: '1rem',
          borderRadius: '0.5rem',
        }}
      >
        {diff.map((part, index) => {
          const color = part.added ? 'bg-green-900' : part.removed ? 'bg-red-900' : '';
          return (
            <span key={index} className={`${color} block`}>
              {part.value}
            </span>
          );
        })}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeDiffViewer;