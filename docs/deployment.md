# Deployment

## Netlify

Connect the repository to Netlify and use the included `netlify.toml` settings:

- Build command: `npm run build`
- Publish directory: `dist`

The build is dependency-free. Use Node.js 24, selected by `.nvmrc` for Netlify and GitHub Actions. Run `npm ci --ignore-scripts`, then `npm run build` for a local preflight; the build validates both source pages and production output. Confirm the published deploy serves `/`, `/about.html`, `/404.html`, `/robots.txt`, and `/sitemap.xml` before attaching the production domain.

The GitHub Actions workflow performs validation only; Netlify handles deployment when the repository is connected. No environment variables or secrets are required for the static build. The included Netlify configuration sets content-type protection, referrer and permissions policies alongside cache headers.

## Other static hosts

Run `npm run build` and publish the contents of `dist/` as the site root. Configure the host to serve `404.html` for missing paths, preserve correct static MIME types, and redirect HTTP and noncanonical host variants to `https://www.dhisclock.com`. The `/about` convenience redirect is included in the Netlify config; the canonical page is `/about.html`.

## Search Console

Once production DNS and HTTPS are live, verify `dhisclock.com` as a domain property in Google Search Console using a DNS TXT record. Then submit `https://www.dhisclock.com/sitemap.xml` from that property. This requires access to the domain DNS and Search Console account and must be performed by an authorized owner. No verification record or claim of submission is included in this repository.
