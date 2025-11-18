'use client';

import 'highlight.js/styles/atom-one-dark.css';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-white mb-6 mt-8 first:mt-0 border-b border-white/10 pb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-white mb-4 mt-6 border-b border-white/10 pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-white/90 mb-3 mt-5">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-white/70 leading-relaxed mb-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-white/70 mb-4 space-y-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="ml-4">
              {children}
            </li>
          ),
          code: ({ inline, children }: any) => {
            if (inline) {
              return (
                <code className="px-1.5 py-0.5 bg-[#00d4ff]/10 text-[#00d4ff] rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return <code>{children}</code>;
          },
          pre: ({ children }) => (
            <pre className="bg-[#1e1e1e] rounded-lg p-4 overflow-x-auto mb-4 border border-white/10">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#00d4ff] pl-4 py-2 bg-[#00d4ff]/5 my-4 text-white/70 italic">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00d4ff] hover:text-[#00b8ff] underline transition-colors"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="max-w-full h-auto rounded-lg my-4 border border-white/10"
            />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-white/10">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 bg-white/5 border border-white/10 text-left text-white font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 border border-white/10 text-white/70">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

