# AcornByte website

A complete static website for AcornByte, LLC. Open `index.html` directly to preview, or run `npm run dev` and open the printed local address. No dependency installation or build is required. The development server requires Node.js; the deployed site does not.

## Included

- Responsive layout with a custom acorn identity, self-hosted fonts, subtle motion, and reduced-motion support.
- Separate business and everyday-tech service tabs.
- Interactive examples: project tracker with add/complete/reset, workflow simulation, and home-office checklist. All are expressly illustrative; no portfolio or client claims are implied. Demo changes stay in memory and reset on page reload.
- Keyboard navigation, native accessible dialogs, FAQ disclosures, mobile navigation, and skip link.
- Guided inquiry builder with email-draft and copy-text options. This is not a contact-form backend: nothing is submitted or stored by the site. The visitor must send the resulting email in their own email app. Clipboard copying falls back to selectable text when unsupported.
- Phone and email links, privacy information, search metadata, structured data, favicon, social sharing image, sitemap, robots.txt, and Vercel configuration.

## Contact details

- Gheiath Ewais / AcornByte, LLC
- ewaisg@acornbyte.com
- 983.333.2222
- https://acornbyte.com/
- Phone and Teams consultations; in-person help by arrangement in the Erie / Denver area. Confirm the desired service radius before public launch.

## Deploy to Vercel later

1. Put the contents of this folder in a Git repository and import it into Vercel, or deploy this folder with the Vercel CLI.
2. Choose the **Other** framework preset. Leave the build command unset and use `.` for the output directory. This is a static site with no environment variables, API keys, database, or paid integrations.
3. Review the preview deployment and verify every contact link.
4. Add `acornbyte.com` (and `www.acornbyte.com` if desired) in the project's domain settings. Apply the exact DNS records Vercel supplies at GoDaddy. Preserve all Microsoft 365 email records (MX, TXT, CNAME and any existing DKIM records). Do not replace the entire DNS zone or change nameservers blindly.
5. Choose a primary domain and redirect the other hostname to it. The metadata currently uses `https://acornbyte.com/` as canonical.
6. Confirm domain verification, HTTPS, incoming/outgoing email, and the production page before sharing the address publicly.

This repository contains the AcornByte site source. Deployment status is managed in Vercel. Deploying this project does not change the existing Pineteck site or any domain/email settings.

## Updating the content

- **Copy, services, FAQs, contact details:** `index.html`.
- **Palette, typography, responsive layout, animation:** `styles.css`.
- **Examples and inquiry builder:** `app.js`.
- **Email destination:** update every reference in `index.html` and `app.js` together.
- **Future real tools/portfolio:** replace or extend the illustrative workbench after reviewing the actual tools, screenshots, and permission to share them. Do not add client names or outcomes without evidence.
- **Future booking or form backend:** add a real service only after selecting it. The current site deliberately does not pretend to book appointments or send messages.
- **Privacy:** update the visible privacy information if analytics, storage, a form processor, or integrations are added.

## Fonts

Manrope and Instrument Serif are self-hosted. Their SIL Open Font License files are included under `assets/fonts/`. No external font requests or trackers are required.

## Verification

Verified in the browser at desktop and 390-pixel phone widths: service switching, keyboard tab navigation, mobile menu, tracker completion/add/reset, workflow simulation, checklist state/reset, FAQ expansion, inquiry topic selection, inquiry text copying, native dialog Escape/close behavior, and privacy dialog. No horizontal page overflow or browser console errors were observed. Local assets and in-page anchor targets were checked.

Email draft preparation and the supplied mail/telephone destinations are included; actual message delivery, mailbox readiness, calling, Vercel deployment, HTTPS, and DNS have not been tested or changed.
