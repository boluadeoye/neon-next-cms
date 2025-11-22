'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// the CSS is global; we also import it in layout, but this is harmless if duplicated.
import 'easymde/dist/easymde.min.css';

const SimpleMdeReact = dynamic(() => import('react-simplemde-editor'), { ssr: false });

export default function MarkdownEditor({
  value,
  onChange,
  uniqueId = 'content'
}: {
  value: string;
  onChange: (v: string) => void;
  uniqueId?: string;
}) {
  const options = React.useMemo(() => ({
    spellChecker: false,
    autosave: { enabled: true, uniqueId: `mde-${uniqueId}`, delay: 1000 },
    status: ['lines', 'words', 'cursor'],
    placeholder: 'Write in Markdown…',
    toolbar: [
      'bold', 'italic', 'heading', '|',
      'quote', 'code', 'table', 'horizontal-rule', '|',
      'unordered-list', 'ordered-list', '|',
      'link', 'image', '|',
      'preview', 'side-by-side', 'fullscreen', '|',
      'guide'
    ],
    uploadImage: true,
    imageAccept: 'image/png,image/jpeg,image/webp,image/gif',
    imageMaxSize: 10 * 1024 * 1024, // 10MB
    imageUploadFunction: async (file: File, onSuccess: (url: string) => void, onError: (msg: string) => void) => {
      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok || !data?.url) throw new Error(data?.error || 'Upload failed');
        onSuccess(String(data.url));
      } catch (err: any) {
        onError(err?.message || 'Upload failed');
      }
    }
  }), [uniqueId]);

  return (
    <SimpleMdeReact
      value={value}
      onChange={(v) => onChange(v || '')}
      options={options as any}
    />
  );
}
