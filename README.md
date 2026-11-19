# AcornByte website

Static business website for AcornByte, LLC. Run `npm run dev` and open the printed local address. No dependency installation or build is required. The preview server uses Node.js; production serves HTML, CSS, JavaScript and local assets.

## Content and identity

- Business services lead: custom business apps and dashboards, document and approval workflows, practical AI integrations, websites and mobile tools.
- Local technology help is a separate service tab; the homepage local-help link opens that track.
- Three anonymous portfolio examples describe actual development categories. Interface graphics use fictional data; the page does not claim paid client engagements, measured outcomes, or publicly released products.
- The logo is One Bit: an acorn whose stem is a single pixel, with a lowercase Manrope wordmark. On-dark and on-light SVG masters, stacked and one-color versions, the mark and the favicon are in `assets/`. See `BRAND.md`.
- Self-hosted Manrope and Instrument Serif fonts; license files are in `assets/fonts/`.
- Interactive scenes (`assets/scenes.js`): the hero shows one of five canvas scenes (Flow, Terrain, Byte Field, Constellation, Orbit), a different one each visit; visitors can pick one (remembered in their browser) or pause motion. The About panel shows Seed, particles that form the acorn. Scenes pause off-screen and in background tabs, follow the theme, and render a still frame for reduced-motion users.
- Interactive fictional tracker, workflow simulation and home-office checklist. Changes live only in the browser tab and reset on reload.
- Accessible service tabs, mobile navigation, native dialogs, FAQ disclosures, keyboard support and reduced-motion styles.

## Inquiries

The contact form and the project-brief dialog post to `api/contact.js`, a Vercel serverless function that emails each inquiry to AcornByte through [Resend](https://resend.com). Nothing is stored. The email's reply-to is the visitor's address.

Required Vercel environment variable: `RESEND_API_KEY` (a Resend key with sending access; acornbyte.com must be verified in Resend). Optional: `CONTACT_TO` (default `ewaisg@acornbyte.com`) and `CONTACT_FROM` (default `AcornByte Website <website@acornbyte.com>`). Without the key, the form shows "temporarily unavailable".

Spam protection: hidden honeypot field, minimum fill time, same-origin check, per-IP rate limit and server-side validation. `npm run dev` serves the static site only; the form needs a Vercel deployment (or `vercel dev`) to send.

The site lists a mailing address (2525 Arapahoe Ave, Ste E4 #1380, Boulder, CO 80302) instead of an email address or phone number.

Contact: `ewaisg@acornbyte.com`, `983.333.2222`. Phone and Teams consultations. No walk-in office.

## Deployment

Repository: `ewaisg/AcornByte`, production branch `main`. Vercel project `acornbyte`; framework preset Other, output directory `.`, no install or build command. No environment variables, paid integrations, database or API are needed.

Primary URL and canonical metadata: `https://www.acornbyte.com/`. The apex domain redirects to `www` through the existing Vercel domain configuration. Website releases do not modify DNS, Microsoft 365 email records or the Pineteck site.

Before a release, run `npm run check`, check asset and anchor references, and verify desktop and phone layouts, service switching, mobile navigation, inquiry categories, validation/copying, dialogs and workbench actions. Confirm the production deployment matches the pushed commit and check the live domain.

## Editing

- Copy, portfolio, services, FAQs and metadata: `index.html`.
- Base design and interactive workbench styles: `styles.css`.
- Signature identity, new workspace art and portfolio layouts: `brand.css`.
- Navigation, interactive examples and inquiry builder: `app.js`.
- Update contact destinations in both HTML and JavaScript when changing email.
- Keep service button topics identical to inquiry options.
- Do not publish private repository names, client identities, real customer documents or unverified results. Replace concept graphics with reviewed public samples only when appropriate.
- Update the privacy notice if analytics, storage or a form processor is later added.

Actual email delivery and calls are outside the website's automated checks. This static site has no application-server runtime to monitor; the hosting provider serves and protects its files.
