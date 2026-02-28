'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PostImage({ src, alt, fill, className, style }: any) {
  const [error, setError] = useState(false);
  
  // Default fallback image (A nice notebook/writing aesthetic)
  const fallbackSrc = "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80";

  if (error || !src) {
    return (
      <Image
        src={fallbackSrc}
        alt={alt || "Fallback"}
        fill={fill}
        width={!fill ? 800 : undefined}
        height={!fill ? 600 : undefined}
        className={className}
        style={{ ...style, objectFit: 'cover' }}
        unoptimized
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt || ""}
      fill={fill}
      width={!fill ? 800 : undefined}
      height={!fill ? 600 : undefined}
      className={className}
      style={style}
      onError={() => setError(true)}
      unoptimized
    />
  );
}
