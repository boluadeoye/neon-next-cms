'use client';
import React from 'react';

export default function HeaderBrand() {
  const svg = React.createElement(
    'svg',
    {
      className: 'brand-icon',
      width: 36,
      height: 36,
      viewBox: '0 0 36 36',
      xmlns: 'http://www.w3.org/2000/svg',
      role: 'img',
      'aria-label': 'Brand icon',
    },
    // defs
    React.createElement(
      'defs',
      null,
      React.createElement(
        'radialGradient',
        { id: 'g1', cx: '50%', cy: '50%', r: '70%' },
        React.createElement('stop', { offset: '0%', stopColor: '#C28B37' }),
        React.createElement('stop', { offset: '60%', stopColor: '#C28B37', stopOpacity: '.75' }),
        React.createElement('stop', { offset: '100%', stopColor: '#0D2340' })
      )
    ),
    // outer ring
    React.createElement('circle', {
      cx: 18,
      cy: 18,
      r: 16,
      fill: 'url(#g1)',
      stroke: '#0D2340',
      strokeWidth: 1.5,
    }),
    // inner motif
    React.createElement('path', {
      d: 'M10 18c4-8 12-8 16 0-4 8-12 8-16 0Z',
      fill: '#fff',
      fillOpacity: 0.9,
      stroke: '#0D2340',
      strokeWidth: 1.2,
    }),
    React.createElement('circle', { cx: 18, cy: 18, r: 3.2, fill: '#0D2340' })
  );

  return React.createElement(
    'a',
    {
      href: '/',
      'aria-label': 'Home',
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'var(--navy)',
      },
    },
    svg
  );
}
