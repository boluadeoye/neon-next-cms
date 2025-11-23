export default function HeaderBrand() {
  // Signature-style SVG with a subtle ochre flourish
  return (
    <a href="/" aria-label="Home" style={{ display:'inline-flex', alignItems:'center', textDecoration:'none', color:'var(--navy)' }}>
      <svg width="156" height="40" viewBox="0 0 156 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Boluadeoye signature">
        <defs>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- name -->
        <text x="0" y="26"
              fill="currentColor"
              style="font-family: var(--font-display), serif; font-weight:700; font-style: italic; letter-spacing:.5px; filter:url(#soft);">
          Boluadeoye
        </text>
        <!-- flourish underline -->
        <path d="M3 30 C 38 43, 92 5, 152 28"
              fill="none"
              stroke="#C28B37"
              stroke-width="2.6"
              stroke-linecap="round"
              stroke-opacity=".92"/>
      </svg>
    </a>
  );
}
