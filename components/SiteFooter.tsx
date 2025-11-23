export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <div style={{ textAlign:'center', color:'var(--muted)' }}>
      <div style={{ fontSize: 12, marginBottom: 6 }}>© Omolayo {year}</div>
      <div style={{ fontSize: 12 }}>
        Built with powerful modern technology —{' '}
        <a href="https://boluadeoye.com.ng" target="_blank" rel="noopener noreferrer" style={{ color:'var(--navy)' }}>
          @boluadeoye.com.ng
        </a>
      </div>
    </div>
  );
}
