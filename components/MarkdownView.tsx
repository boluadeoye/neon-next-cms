import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { slugify } from '../lib/slug';

const schema: any = {
  ...defaultSchema,
  attributes: {
    ...(defaultSchema as any).attributes,
    h1: [['id']], h2: [['id']], h3: [['id']], h4: [['id']], h5: [['id']], h6: [['id']],
    code: [['className']]
  }
};

function heading(tag: 'h1'|'h2'|'h3') {
  return (props: any) => {
    const text = String(React.Children.toArray(props.children).map((c: any) => (typeof c === 'string' ? c : c?.props?.value || '')).join(' ')).trim();
    const id = slugify(text);
    const Tag = tag as any;
    return <Tag id={id}>{props.children}</Tag>;
  };
}

export default function MarkdownView({ content }: { content: string }) {
  return (
    <article className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, schema]]}
        components={{ h1: heading('h1'), h2: heading('h2'), h3: heading('h3') }}
      >
        {content || ''}
      </ReactMarkdown>
    </article>
  );
}
