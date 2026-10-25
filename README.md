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

## Managing services and prices

Everything the client changes lives in **`services.js`**. The pricing section, the
estimator rows, the emailed summary, and the hero "Details from $X" line are all
generated from it. Edit only that file:

- **Hide / reopen:** set `visible: false` / `true` on the service.
- **Reorder:** move the service's entry up or down in the `SERVICES` array.
- **Feature:** set `featured: true` to show a small "Featured" tag.
- **Change a price:** edit `prices` (per vehicle size) or `price` (add-ons).
- **Add a service:** copy an existing entry and give it a new unique `id`.

The "What's Included in Every Full Detail" text in `index.html` is static and is
hidden automatically when the `full` service is hidden.
