# Deployment

## Netlify

Connect the repository to Netlify and use the included `netlify.toml` settings:

- Build command: `npm run build`
- Publish directory: `dist`

When Netlify connects the parent workspace repository, set its base directory to `dhis-clock`; when the repository root is this project, leave base directory empty. The configuration pins Node.js 24 and disables Pretty URLs because the canonical About URL is `/about.html`.

### Production domain

In Netlify Domain management, attach `dhisclock.com` and `www.dhisclock.com`, and select `dhisclock.com` as the primary domain. Apply the DNS records shown by Netlify for this specific site at the domain's DNS provider. Wait for DNS verification and the HTTPS certificate, then enable Force HTTPS. The repository redirects HTTP and www requests to `https://dhisclock.com/`, preserving paths; `/index.html` redirects to `/`.

Publish through the connected repository using this `netlify.toml`. A manual upload of only `dist/` does not include the repository's TOML redirect/header configuration; configure those separately if using drag-and-drop deployment.

After deployment, check `/`, `/about.html`, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/site.webmanifest`, an unknown URL (must return 404), and video playback/seeking. Verify www and HTTP redirects, the certificate, and tracking reception using Tag Assistant and Clarity. Both Google IDs are GTM containers; GA4 configuration must be published inside the intended container.

DNS, certificate issuance, the Netlify primary-domain setting and publishing are external account steps; changing repository files does not complete them.

The build uses React and React DOM for static media components; install the locked dependencies before building. Use Node.js 24, selected by `.nvmrc` for Netlify and GitHub Actions. Run `npm ci --ignore-scripts`, then `npm run build` for a local preflight; the build validates both source pages and production output. Confirm the published deploy serves `/`, `/about.html`, `/404.html`, `/robots.txt`, and `/sitemap.xml` before attaching the production domain.

The GitHub Actions workflow performs validation only; Netlify handles deployment when the repository is connected. No environment variables or secrets are required for the static build. The included Netlify configuration sets content-type protection, referrer and permissions policies alongside cache headers.

## Other static hosts

Run `npm run build` and publish the contents of `dist/` as the site root. Configure the host to serve `404.html` for missing paths, preserve correct static MIME types, and redirect HTTP and noncanonical host variants to `https://dhisclock.com`. The `/about` convenience redirect is included in the Netlify config; the canonical page is `/about.html`.

## Search Console

Once production DNS and HTTPS are live, verify `dhisclock.com` as a domain property in Google Search Console using a DNS TXT record. Then submit `https://dhisclock.com/sitemap.xml` from that property. This requires access to the domain DNS and Search Console account and must be performed by an authorized owner. No verification record or claim of submission is included in this repository.
