import { sql } from './db';
import { XMLParser } from 'fast-xml-parser';

export type NewsItem = {
  source: string;
  title: string;
  url: string;
  publishedAt: string | null;
  image?: string | null;
};

const DEFAULT_FEEDS = [
  { source: 'Fox News', url: 'https://feeds.foxnews.com/foxnews/latest' },
  { source: 'Daily Post', url: 'https://dailypost.ng/feed/' },
  { source: 'The Guardian', url: 'https://www.theguardian.com/world/rss' }
];

function pick<T=any>(obj:any, path:string): T | undefined {
  return path.split('.').reduce((o,k)=>o?.[k], obj);
}

function extractItems(feed: any): any[] {
  // RSS 2.0: rss.channel.item | Atom: feed.entry
  const items = pick<any[]>(feed, 'rss.channel.item') || pick<any[]>(feed, 'feed.entry') || [];
  return Array.isArray(items) ? items : [items].filter(Boolean);
}

function getLink(entry:any): string | null {
  if (!entry) return null;
  if (typeof entry.link === 'string') return entry.link;
  if (Array.isArray(entry.link)) {
    const alt = entry.link.find((l:any)=> l['@_href'])?.['@_href'];
    return alt || null;
  }
  if (entry.link?.['@_href']) return entry.link['@_href'];
  if (entry.link?.href) return entry.link.href;
  return null;
}

function getImage(entry:any): string | null {
  // Try media:content, enclosure, media:thumbnail, or og:image (rare in feeds)
  const media = entry['media:content'];
  if (Array.isArray(media)) return media[0]?.['@_url'] || null;
  if (media?.['@_url']) return media['@_url'];
  const enc = entry.enclosure;
  if (enc?.['@_url']) return enc['@_url'];
  const thumb = entry['media:thumbnail'];
  if (thumb?.['@_url']) return thumb['@_url'];
  return null;
}

function getDate(entry:any): string | null {
  return entry.pubDate || entry.published || entry.updated || null;
}

async function fetchFeed(source: string, url: string, limit = 5): Promise<NewsItem[]> {
  const res = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; neon-next-cms/1.0)' },
    next: { revalidate: 600 }
  });
  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
  const data = parser.parse(xml);
  const entries = extractItems(data).slice(0, limit);
  return entries.map((e:any) => ({
    source,
    title: (e.title && (typeof e.title === 'string' ? e.title : e.title['#text'])) || 'Untitled',
    url: getLink(e) || '#',
    publishedAt: getDate(e),
    image: getImage(e)
  }));
}

async function getFeedList(): Promise<{source:string; url:string}[]> {
  const rows = (await sql`SELECT value FROM settings WHERE key='news_feeds' LIMIT 1`) as any[];
  const v = rows[0]?.value;
  if (!v) return DEFAULT_FEEDS;
  if (Array.isArray(v)) {
    // allow array of urls or objects
    if (v.length && typeof v[0] === 'string') {
      return (v as string[]).map((u) => ({ source: new URL(u).host, url: u }));
    }
    return v as any[];
  }
  // newline string
  const list = String(v).split('\n').map(s=>s.trim()).filter(Boolean);
  if (list.length) return list.map(u => ({ source: new URL(u).host, url: u }));
  return DEFAULT_FEEDS;
}

export async function getTopNews(limitPerFeed = 4, overallLimit = 12): Promise<NewsItem[]> {
  const feeds = await getFeedList();
  const all = (await Promise.all(
    feeds.map(f => fetchFeed(f.source, f.url, limitPerFeed).catch(()=>[]))
  )).flat();
  return all
    .sort((a,b)=> new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
    .slice(0, overallLimit);
}
