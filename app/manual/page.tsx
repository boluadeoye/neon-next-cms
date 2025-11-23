import React from 'react';
import fs from 'node:fs/promises';
import path from 'node:path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function ManualPage() {
  try {
    const filePath = path.join(process.cwd(), 'manual.md');
    const md = await fs.readFile(filePath, 'utf8');

    return (
      <section className="section container-narrow">
        <h1 className="sec-title" style={{ marginTop: 0 }}>Operational Manual</h1>
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {md}
          </ReactMarkdown>
        </div>
      </section>
    );
  } catch {
    return (
      <section className="section container-narrow">
        <h1 className="sec-title" style={{ marginTop: 0 }}>Operational Manual</h1>
        <p className="sec-sub">
          manual.md was not found in the project root. Please ensure it’s committed to the repository.
        </p>
      </section>
    );
  }
}
