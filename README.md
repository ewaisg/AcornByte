# AcornByte website

Static business website for AcornByte, LLC. Run `npm run dev` and open the printed local address. No dependency installation or build is required. The preview server uses Node.js; production serves HTML, CSS, JavaScript and local assets.

## Content and identity

- Business services lead: custom business apps and dashboards, document and approval workflows, practical AI integrations, websites and mobile tools.
- Local technology help is a separate service tab; the homepage local-help link opens that track.
- Three anonymous portfolio examples describe actual development categories. Interface graphics use fictional data; the page does not claim paid client engagements, measured outcomes, or publicly released products.
- The signature wordmark comes from the owner's supplied `acornByte.svg`. Original letter shapes are retained, with the empty canvas cropped. Green, light and black SVG masters are in `assets/brand/`. See `BRAND.md`.
- Self-hosted Manrope and Instrument Serif fonts; license files are in `assets/fonts/`.
- Interactive fictional tracker, workflow simulation and home-office checklist. Changes live only in the browser tab and reset on reload.
- Accessible service tabs, mobile navigation, native dialogs, FAQ disclosures, keyboard support and reduced-motion styles.

## Inquiries

The inquiry builder prepares an email draft or copies text. It does not send messages or store submissions. The visitor reviews and sends the email in their own app. The page explains this and provides a selectable-text fallback if clipboard access is unavailable.

Contact: Gheiath Ewais, `ewaisg@acornbyte.com`, `983.333.2222`. Phone and Teams consultations; in-person help around Erie and Denver by arrangement. No walk-in office.

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
