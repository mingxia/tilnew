import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown-content prose prose-lg max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // 自定义链接样式
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-current font-medium underline decoration-dashed hover:decoration-solid transition-all"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          // 自定义引用样式
          blockquote: ({ node, ...props }) => (
            <blockquote
              {...props}
              className="border-l-4 border-current/30 pl-4 my-6 italic"
            />
          ),
          // 自定义标题样式
          h1: ({ node, ...props }) => (
            <h1 {...props} className="text-3xl font-bold mt-8 mb-4" />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className="text-2xl font-bold mt-6 mb-3" />
          ),
          h3: ({ node, ...props }) => (
            <h3 {...props} className="text-xl font-bold mt-4 mb-2" />
          ),
          h4: ({ node, ...props }) => (
            <h4 {...props} className="text-lg font-bold mt-4 mb-2" />
          ),
          // 自定义列表样式
          ul: ({ node, ...props }) => (
            <ul {...props} className="list-disc list-inside my-4 space-y-2" />
          ),
          ol: ({ node, ...props }) => (
            <ol {...props} className="list-decimal list-inside my-4 space-y-2" />
          ),
          // 自定义代码块样式
          code: ({ node, className, ...props }: any) => (
            className ? (
              <code
                {...props}
                className="block bg-current/10 p-4 rounded-lg my-4 font-mono text-sm overflow-x-auto"
              />
            ) : (
              <code
                {...props}
                className="bg-current/10 px-1.5 py-0.5 rounded text-sm font-mono"
              />
            )
          ),
          // 自定义 div 样式（支持自定义类）
          div: ({ node, className, ...props }) => (
            <div
              {...props}
              className={className}
              style={{
                // 支持用户在 MD 中定义的内联样式
              }}
            />
          ),
          // 自定义 span 样式（支持 tip1, tip2 等标签）
          span: ({ node, className, ...props }) => {
            if (className === 'tip1') {
              return (
                <span
                  {...props}
                  className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-green-500/20 text-green-600 dark:text-green-400 ml-2"
                />
              );
            }
            if (className === 'tip2') {
              return (
                <span
                  {...props}
                  className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 ml-2"
                />
              );
            }
            return <span {...props} className={className} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>

      <style jsx global>{`
        .markdown-content {
          line-height: 1.8;
        }

        .markdown-content p {
          margin: 1rem 0;
        }

        .markdown-content strong {
          font-weight: 600;
        }

        .markdown-content hr {
          margin: 2rem 0;
          border: none;
          border-top: 1px solid currentColor;
          opacity: 0.2;
        }

        /* 支持用户 MD 中的 flex 布局 */
        .markdown-content .flex {
          display: flex;
        }

        .markdown-content .items-center {
          align-items: center;
        }

        .markdown-content .justify-center {
          justify-content: center;
        }
      `}</style>
    </div>
  );
}
