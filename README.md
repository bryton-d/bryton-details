# bryton-details

A clean, mobile-friendly website for **Bryton's Auto Detailing**, a mobile detailing
business serving Delaware & Montgomery County, PA. The site showcases services and
pricing and streamlines customer intake through an online booking form with a built-in
price estimator.

## Stack & structure

Static site — plain HTML, CSS, and JavaScript, no build step.

- `index.html` — homepage: services/pricing copy and the booking estimator form.
- `about.html`, `testimonials.html`, `ig-posts.html` — supporting content pages.
- `thank-you.html` — confirmation page shown after a successful booking submission.
- `style.css` — shared stylesheet used across all pages.
- `script.js` — estimator logic (selection, quantity sync, subtotals/total, and the
  readable summary submitted with the form).
- `images/` — site imagery (logo and supporting photos).
- `CNAME` — custom domain configuration for GitHub Pages.

Customer intake is handled by [Formspree](https://formspree.io/); the form posts to a
Formspree endpoint and redirects to `thank-you.html` on success.

## Run locally

From the repository root, start a simple static server with Python:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000> in your browser. (Use `python3` if `python` is not
on your path.)

## Deployment

The site is hosted on **GitHub Pages** and served on the custom domain
`brytonsautodetailing.com` (configured via the root `CNAME` file). Pushing to the
deployment branch publishes the site.

## Current status

**Phase 1 — Package-model update (completed and live):**

- Migrated to **Silver / Gold Interior** and **Silver / Gold Exterior** packages.
- Pricing organized across three vehicle classes: **Sedan**, **Small SUV**, and
  **Large SUV**.
- Estimator updated to reflect the new package pricing model.
- Add-on labels and prices updated.

See [roadmap.md](roadmap.md) for project state and planned next steps.
