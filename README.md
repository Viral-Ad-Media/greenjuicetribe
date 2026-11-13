# Green Juice Tribe

The greenjuicetribe.com site, rebuilt from WordPress with **Next.js 16, Tailwind CSS 4, Neon Postgres (Drizzle ORM) and Better Auth**.

- Public site: home, blog, posts and pages at `/<slug>/`, category pages (`/juicers/`, `/blenders/single-serve-blenders/` and so on), sitemap and robots.
- Admin at `/admin/`: create, edit, publish and delete posts and pages in Markdown. Only emails listed in `ADMIN_EMAILS` can create an account.
- Old WordPress URLs and slugs are kept, so existing links and search rankings carry over.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, BETTER_AUTH_SECRET, ADMIN_EMAILS
npm run db:push              # create the tables in Neon
npm run db:seed              # load the articles from content/ into the database
npm run dev
```

Then open http://localhost:3000/sign-in/, choose **Create the admin account** with an email from `ADMIN_EMAILS`, and you'll land in `/admin/`.

### Environment variables

| Variable | What it is |
|---|---|
| `DATABASE_URL` | Neon connection string. A `localhost` URL uses plain node-postgres for local development. |
| `BETTER_AUTH_SECRET` | Long random string, for example from `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Public URL of the site, for example `https://greenjuicetribe.com` |
| `ADMIN_EMAILS` | Comma-separated emails allowed to sign up and use `/admin/` |
| `NEXT_PUBLIC_AMAZON_TAG` | Optional Amazon Associates tag added to every "Check price" link |
| `NEXT_PUBLIC_SITE_URL` | Used for the sitemap, robots and canonical URLs |

### Deploying (Vercel)

1. Import this repo in Vercel. The Neon integration can create the database and set `DATABASE_URL` for you.
2. Add the other environment variables.
3. Run `npm run db:push && npm run db:seed` once against the production database, from your machine with the production `DATABASE_URL`.
4. Point the domain at Vercel.

## Content

- `content/posts/*.md` and `content/pages/*.md` hold the starting articles. The file name is the URL slug. Frontmatter gives `title`, `excerpt`, `categories` (comma-separated category slugs), `date` and `image`.
- After seeding, **the database is the source of truth**. Edit in `/admin/`. `npm run db:seed` only inserts missing items. `npm run db:seed -- --force` overwrites the database with the files.
- Product buttons: write `[Check price on Amazon](amazon:Product Name)`. It becomes an Amazon search link with your tag.
- Images live in `public/uploads/`, with the same paths as WordPress. They were copied from the 2026-10-19 backup.

## About the old site (security)

The WordPress backup this was rebuilt from was **compromised**. It contained a login backdoor, a hidden admin user, doorway pages that served content from a third-party domain, and rogue Google verification files. **None of that code or those files were carried over.** Only images were copied, and the articles were rewritten from scratch.

The attacker's doorway URLs now redirect to the real articles (see `next.config.ts`). After switching the domain:

- In Google Search Console, remove any verified owners you don't recognize, and submit the new `/sitemap.xml`.
- Change the old hosting, database and WordPress passwords, or shut that hosting down.
