import { sql } from '../lib/db';

function val(v:any, fallback=''){ return typeof v === 'string' ? v : (v?.value ?? fallback); }

export default async function HeroCard(){
  const rows = (await sql`
    SELECT key, value FROM settings
    WHERE key = ANY(${[
      'hero_name','hero_title','hero_bio','hero_avatar_url',
      'hero_birthday','hero_phone','hero_email','hero_location',
      'site_name'
    ]})
  `) as { key:string; value:any }[];

  const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
  const name = val(map.hero_name, 'DONALD MCKINNEY');
  const title = val(map.hero_title, 'JUNIOR UI/UX DEVELOPER');
  const bio = val(map.hero_bio, 'You will begin to realise why this exercise is called the Dickens Pattern...');
  const avatar = val(map.hero_avatar_url, 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=1080&auto=format&fit=crop');
  const birthday = val(map.hero_birthday, '31st December, 1992');
  const phone = val(map.hero_phone, '+1 (012) 6954 783');
  const email = val(map.hero_email, 'businessplan@donald');
  const location = val(map.hero_location, 'Santa Monica boulevard');

  return (
    <>
      <section className="gradient-hero">
        <div className="container" style={{ padding:'28px 16px' }}>
          <div className="brand" style={{ color:'#fff' }}>{val(map.site_name,'MEETME')}</div>
        </div>
      </section>

      <section className="container floating-wrap">
        <div className="floating-card" style={{ willChange:'transform' }}>
          <div className="card-grid">
            <div className="reveal">
              <img src={avatar} alt="" className="avatar" />
            </div>
            <div>
              <div className="eyebrow reveal">HELLO EVERYBODY, I AM</div>
              <div className="name reveal" style={{ textTransform:'uppercase' }}>{name}</div>
              <div className="role reveal" style={{ textTransform:'uppercase', fontSize:14 }}>{title}</div>
              <p className="bio reveal">{bio}</p>

              <div className="info reveal">
                <div className="info-row"><i>📅</i><span>{birthday}</span></div>
                <div className="info-row"><i>📞</i><span>{phone}</span></div>
                <div className="info-row"><i>✉️</i><span>{email}</span></div>
                <div className="info-row"><i>📍</i><span>{location}</span></div>
              </div>

              <div className="social reveal">
                <a href="#" aria-label="Twitter">🐦</a>
                <a href="#" aria-label="Dribbble">📘</a>
                <a href="#" aria-label="LinkedIn">💼</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
