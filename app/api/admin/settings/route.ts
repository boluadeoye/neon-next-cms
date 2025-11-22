import { NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';
import { getSession } from '../../../../lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function unauthorized(){ return NextResponse.json({ ok:false, error:'Unauthorized' }, { status:401 }); }

export async function GET(){
  const session = await getSession();
  if(!session || session.role !== 'admin') return unauthorized();
  const rows = (await sql`SELECT key, value FROM settings`) as any[];
  const data: Record<string, any> = {};
  for(const r of rows) data[r.key] = r.value;
  return NextResponse.json({ ok:true, settings:data });
}

export async function PUT(req: Request){
  const session = await getSession();
  if(!session || session.role !== 'admin') return unauthorized();
  try{
    const body = await req.json();
    const allowed = [
      'site_name','site_description','site_og_image','site_twitter',
      'hero_name','hero_title','hero_bio','hero_avatar_url','hero_portrait_url',
      'hero_birthday','hero_phone','hero_email','hero_location',
      'hero_social_twitter','hero_social_linkedin','hero_social_github',
      'hero_bullets','news_feeds'
    ];
    for(const key of allowed){
      if(key in body){
        await sql`INSERT INTO settings (key, value)
                  VALUES (${key}, ${JSON.stringify(body[key])}::jsonb)
                  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
      }
    }
    return NextResponse.json({ ok:true });
  }catch(e:any){
    return NextResponse.json({ ok:false, error:e?.message ?? 'Error' }, { status:500 });
  }
}
