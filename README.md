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

**Service model (live):** base services — **Interior**, **Exterior**, and **Combined**
— priced across three vehicle classes (**Sedan**, **2 Row SUV / Crossover**, and
**3 Row SUV / Van / Truck**) via `data-price` attributes in `index.html`, plus four
add-ons (Seat Shampooing, Headlight Restoration, Engine Bay Cleaning, Plastic Trim
Shine). *(Earlier notes describing a "Silver/Gold package" migration were inaccurate;
that model is not in the code.)*

**Phase 1A — Visual redesign (this change):** black-led design system in `style.css`,
sticky header with text wordmark, homepage hero, restyled estimator (cosmetic only —
markup/logic untouched), optimized WebP images, basic SEO metadata, and a shared
`nav.js` for the mobile menu.

See [roadmap.md](roadmap.md) for project state and planned next steps.
