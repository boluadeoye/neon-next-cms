# Omolayo Blog — Operational Manual

This manual explains how to run your site without touching code. It covers the public blog, the admin CMS, and everyday tasks like publishing, updating settings, and fixing common issues.

Tip: replace YOUR-DOMAIN everywhere with your actual domain (for example: neon-next-cms.vercel.app or your custom domain).

---

## Quick links

- Home: https://YOUR-DOMAIN/
- Blog: https://YOUR-DOMAIN/blog
- Portfolio: https://YOUR-DOMAIN/portfolio
- Admin (dashboard): https://YOUR-DOMAIN/admin
- Login: https://YOUR-DOMAIN/login
- Register (admins only; limited to two): https://YOUR-DOMAIN/register
- Health (tech): https://YOUR-DOMAIN/api/health
- SEO:
  - robots.txt: https://YOUR-DOMAIN/robots.txt
  - sitemap.xml: https://YOUR-DOMAIN/sitemap.xml
  - rss.xml: https://YOUR-DOMAIN/rss.xml

---

## What this site gives you

- A refined public blog with beautiful typography, table of contents, cover images, and like/share/comments.
- A home hero that introduces you (name, role, bio) with a subtle watermark and tasteful animation.
- A portfolio page that auto‑lists posts tagged “portfolio.”
- Category chips (Essays, Life, Culture, News) and search on /blog.
- Optional “Latest News” section powered by RSS feeds you can edit in Settings.
- Built‑in SEO surfaces (sitemap, RSS, robots) to help search engines find you.

Opportunities
- Authority and trust: consistent posts make you discoverable and credible.
- Collaborations and speaking: the portfolio + essays showcase your voice and work.
- Community: comments and share icons make it easy to start conversations.
- Distribution: one‑click share to X/LinkedIn/Facebook/WhatsApp; RSS for subscribers.

---

## Onboarding (first time)

1) Go to https://YOUR-DOMAIN/register and create your admin.
   - Safety rule: Up to two admins can be created. After that, register is closed.
2) Log in at https://YOUR-DOMAIN/login (later, just use https://YOUR-DOMAIN/admin).
3) Open Admin → Settings and set:
   - Site Name and Description
   - Hero Name and Bio (one‑line promise)
   - Avatar URL (small circular photo in header)
   - Social links (X, LinkedIn, etc.)
   - Optional “Latest News” feeds (one RSS URL per line)

---

## Writing and publishing a post

1) Admin → Posts → New Post
2) Fill:
   - Title — clear and human
   - Slug (optional) — if blank, it’s made from the title
   - Excerpt — 1–2 lines for previews (optional)
   - Content — write in Markdown; use the toolbar; you can paste images or click the image icon to upload
   - Category — choose one (Essays, Life, Culture, News). The system adds this as a tag automatically
   - Extra Tags — comma separated (e.g., portfolio, featured)
   - Status — Draft or Published
3) Save:
   - Draft — only visible in Admin
   - Published — appears on /blog and the home sections
4) View your post on /blog. Open the post link to see likes, share icons, comments, and the TOC.

Edit a post later
- Admin → Posts → Edit
- Change title, excerpt, content, cover image URL
- Change category and tags
- Publish/Unpublish as needed

Images
- Use clear 16:9 images for covers
- Keep image sizes reasonable (under ~1–2 MB) to keep the site fast

---

## Pages and portfolio

Pages (About, Contact, etc.)
- Admin → Pages → New Page
- Publish to make it live at /your-slug

Portfolio page
- Any post tagged portfolio appears at https://YOUR-DOMAIN/portfolio
- Add tag “portfolio” in Extra Tags (New/Edit Post)

---

## Categories and tags (how they power the site)

- Category (Essays/Life/Culture/News) — pick one; it’s stored as a tag too
- Extra Tags — free‑form labels like portfolio, featured, interview
- Blog index uses Category for the top chips; the post page shows tags as chips that perform a search

---

## Interactions (likes, share, comments)

- Likes — one like per device/browser; the count updates instantly
- Share — clean icon buttons: X, LinkedIn, Facebook, WhatsApp; plus a native Share button (mobile)
- Comments — public comments (name + message); appear immediately

Moderation note
- Current version auto‑approves comments. If you want moderation tools (approve, hide, delete), ask your developer to add an Admin comments screen.

---

## Settings (Admin → Settings)

- Site name and description
- Hero (Home)
  - Name (e.g., Omolayo)
  - Title/Role (e.g., Writer)
  - Bio (one‑line promise that shows under the hero title)
  - Avatar URL (header photo)
  - Social links: X/Twitter, LinkedIn, etc.
- News feeds (optional)
  - Put one RSS URL per line
  - Examples:
    - https://feeds.foxnews.com/foxnews/latest
    - https://dailypost.ng/feed/
    - https://www.theguardian.com/world/rss
  - To disable the section, leave the list blank

Footer copy (already built)
- © Omolayo {current year}
- Built with powerful modern technology — @boluadeoye.com.ng (live link)

---

## Admin & access

- Admin dashboard: https://YOUR-DOMAIN/admin
- Login: https://YOUR-DOMAIN/login
- Register: https://YOUR-DOMAIN/register (only open until there are two admins)
- Safety rule: up to two admin accounts total
- Optional: editors/authors can be added later (role support exists in the database)

---

## Content style guide (what works best)

Headlines
- Promise value in under 12 words; avoid clever but vague titles

Excerpt
- 1–2 lines that tease the topic

Body
- Short paragraphs (2–4 sentences)
- Sub‑headings for structure
- Use bold, lists, and quotation blocks sparingly
- A strong cover image + 1–2 inline images is enough

Voice
- Clear, helpful, specific
- Avoid abstract statements; prefer facts and stories

---

## SEO & discovery

- https://YOUR-DOMAIN/sitemap.xml helps search engines crawl
- https://YOUR-DOMAIN/rss.xml lets readers subscribe and lets you syndicate elsewhere
- Use descriptive titles and excerpts; post consistently
- Share each published post to at least one channel (X/LinkedIn)

---

## Maintenance & troubleshooting

I can’t log in
- Use /login (not /admin). If you forget your password, ask your developer to reset it (no “forgot password” email flow is built in yet)

My post isn’t on /blog
- Status must be Published
- Refresh /blog after publishing

Images don’t upload
- Check your connection. If it persists, your developer should verify the site has an active Vercel Blob token

Likes don’t update
- They should update immediately; if not, refresh. If still not updating, try a different browser (device might be blocking cookies)

Comments problem
- Current version auto‑approves; ask your developer to add moderation tools if needed

Performance tips
- Resize large images before upload
- Avoid extremely long pages (split into parts if needed)

---

## Owner checklist (repeatable)

Weekly
- Draft and publish one post
- Share to one channel (X/LinkedIn/WhatsApp)
- Reply to any comments

Monthly
- Add one portfolio item (tag “portfolio”)
- Review hero bio in Settings
- Update News feeds if needed

---

## Technical appendix (for reference only)

Environment variables (already set by your developer)
- DATABASE_URL — Neon Postgres connection string
- JWT_SECRET — secret used for login cookies
- NEXT_PUBLIC_SITE_NAME — branding
- BLOB_READ_WRITE_TOKEN — uploads (Vercel Blob)
- NEXT_PUBLIC_SITE_URL — absolute URLs for share links (optional but recommended)

Data model (simplified)
- posts, pages — content
- users — accounts (admin/editor/author — you’re using admin)
- tags, post_tags — labeling + portfolio
- comments — public comments
- post_likes — anonymous like counts
- settings — site/hero/news configuration

Backups (developer task)
- Neon provides a dashboard for backups/exports

---

## Change log (brief)
- Comments restored; likes update immediately on click
- Tag chips and Prev/Next rebuilt as filled chips
- Two‑admin gate for registration (safety)
- Header upgraded to dynamic icon; hero smaller and centered; watermark visible
- Footer refined with © Omolayo {year} and a live link @boluadeoye.com.ng
- Global fonts: Lato (body/UI), Merriweather (headings)
- Blog sections use subtle reveal animations

---

## Support

- If you want new features (newsletter, comment moderation, scheduled publishing, advanced search), ask your developer. The system is ready to grow with you.

