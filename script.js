// Estimator + service rendering. Services, prices, order, and visibility come
// from services.js (loaded first); this file only turns that config into the
// pricing copy and estimator rows, and does the math.

const BASE_SERVICES = SERVICES.filter(s => s.type === 'base' && s.visible);
const ADDON_SERVICES = SERVICES.filter(s => s.type === 'addon' && s.visible);

// One entry per estimator row; filled in by renderEstimator().
const estimatorRows = [];

function formatCurrency(n) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${(n || 0).toLocaleString()}`;
  }
}

function getQtyFromInput(el) {
  if (!el || el.disabled) return 0;
  const v = parseInt(el.value, 10);
  return Number.isFinite(v) && v > 0 ? v : 0;
}

function el(tag, attrs, text) {
  const node = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v));
  if (text) node.textContent = text;
  return node;
}

function featuredTag() {
  return el('span', { class: 'featured-tag' }, 'Featured');
}

// ---- Pricing & Services copy (homepage, outside the form) -----------------

function renderPricingCopy() {
  const base = document.getElementById('pricing-base');
  if (base) {
    BASE_SERVICES.forEach(svc => {
      const h3 = el('h3', {}, `${svc.name} Pricing`);
      if (svc.featured) h3.append(' ', featuredTag());
      const ul = el('ul');
      VEHICLES.forEach(v => {
        if (svc.prices[v.id] == null) return;
        ul.appendChild(el('li', {}, `${v.label} — ${formatCurrency(svc.prices[v.id])}`));
      });
      base.append(h3, ul);
    });
  }

  const addons = document.getElementById('pricing-addons');
  if (addons && ADDON_SERVICES.length) {
    addons.appendChild(el('h3', {}, 'Add-Ons'));
    addons.appendChild(el('p', {}, 'Enhance your detail with optional add-on services to give your vehicle an extra touch of care.'));
    const ul = el('ul');
    ADDON_SERVICES.forEach(svc => {
      const li = el('li', {}, `${svc.name} — ${formatCurrency(svc.price)}`);
      if (svc.featured) li.append(' ', featuredTag());
      ul.appendChild(li);
    });
    addons.appendChild(ul);
  }

  // The "What's Included" copy describes Full Detail, so it follows that service.
  const includes = document.getElementById('pricing-full-includes');
  if (includes) includes.hidden = !BASE_SERVICES.some(s => s.id === 'full');

  // Hero "from $X": cheapest visible base price.
  const heroFrom = document.getElementById('hero-from');
  const prices = BASE_SERVICES.flatMap(s => Object.values(s.prices));
  if (heroFrom) heroFrom.textContent = prices.length ? `Details from ${formatCurrency(Math.min(...prices))}` : '';
}

// ---- Estimator rows --------------------------------------------------------

function makeRow(row, cells) {
  const tr = el('tr', row.kind === 'base' ? { class: 'vehicle-row' } : {});
  cells.forEach(c => tr.appendChild(c));
  return tr;
}

function renderEstimator() {
  const baseTable = document.getElementById('service-table');
  if (baseTable) {
    BASE_SERVICES.forEach(svc => {
      const head = el('th', { colspan: '3', style: 'text-align:left; padding-top: 8px;' }, svc.name);
      if (svc.featured) head.append(' ', featuredTag());
      baseTable.appendChild(el('tr')).appendChild(head);

      VEHICLES.forEach(v => {
        const price = svc.prices[v.id];
        if (price == null) return;
        const id = `${svc.id}-${v.id}`;
        const row = { kind: 'base', svc, label: v.label, price, cb: null, qty: null };

        const cb = el('input', { type: 'checkbox', id: `${id}-check`, name: `${id}-check` });
        const label = el('label', { for: `${id}-check` }, `${v.label} — ${formatCurrency(price)}`);
        const qty = el('input', { type: 'number', id: `${id}-qty`, name: `${id}-qty`, value: '0', placeholder: 'Qty', min: '0', disabled: '' });
        row.cb = cb; row.qty = qty;

        const td1 = el('td'); td1.appendChild(cb);
        const td2 = el('td'); td2.appendChild(label);
        const td3 = el('td', { style: 'text-align:center;' }); td3.appendChild(qty);
        baseTable.appendChild(makeRow(row, [td1, td2, td3]));
        estimatorRows.push(row);
      });
    });
  }

  const addonTable = document.getElementById('addon-table');
  if (addonTable) {
    if (!ADDON_SERVICES.length) addonTable.hidden = true;
    ADDON_SERVICES.forEach(svc => {
      const id = `addon-${svc.id}`;
      const row = { kind: 'addon', svc, label: svc.name, price: svc.price, cb: null, qty: null };

      const cb = el('input', { type: 'checkbox', id: `${id}-check`, name: `${id}-check` });
      const label = el('label', { for: `${id}-check` }, `${svc.name} (${formatCurrency(svc.price)})`);
      if (svc.featured) label.append(' ', featuredTag());
      const qty = el('input', { type: 'number', id: `${id}-qty`, name: `${id}-qty`, value: '0', min: '0', disabled: '' });
      row.cb = cb; row.qty = qty;

      const td1 = el('td'); td1.appendChild(cb);
      const td2 = el('td'); td2.appendChild(label);
      const td3 = el('td'); td3.appendChild(qty);
      addonTable.appendChild(makeRow(row, [td1, td2, td3]));
      estimatorRows.push(row);
    });
  }
}

// Enable/disable a row's quantity input based on its checkbox, defaulting the
// quantity to 1 the moment it is selected.
function toggleRow(row) {
  row.qty.disabled = !row.cb.checked;
  row.qty.style.background = row.cb.checked ? '#fff' : '#eee';
  if (!row.cb.checked) {
    row.qty.value = 0;
  } else if (getQtyFromInput(row.qty) === 0) {
    row.qty.value = 1;
  }
  updateEstimator();
}

function buildEstimateSummary(selections, totals) {
  const parts = [];
  const sections = [
    ...BASE_SERVICES.map(s => ({ title: s.name, svc: s })),
    { title: 'Add-Ons', addons: true }
  ];
  sections.forEach(sec => {
    const lines = selections.filter(s => sec.addons ? s.kind === 'addon' : s.svc === sec.svc);
    if (!lines.length) return;
    parts.push(`--- ${sec.title} ---`);
    lines.forEach(s => parts.push(`  • ${s.label} (${s.qty} @ ${formatCurrency(s.price)} = ${formatCurrency(s.line)})`));
    parts.push('');
  });
  parts.push(`Detail Total: ${formatCurrency(totals.base)}`);
  parts.push(`Add-On Total: ${formatCurrency(totals.addons)}`);
  parts.push(`Overall Estimate: ${formatCurrency(totals.total)}`);
  return parts.join('\n');
}

function updateEstimator() {
  let baseSubtotal = 0;
  let addonSubtotal = 0;
  const selections = [];

  estimatorRows.forEach(row => {
    row.qty.disabled = !row.cb.checked;
    row.qty.style.background = row.cb.checked ? '#fff' : '#eee';
    if (!row.cb.checked) { row.qty.value = 0; return; }
    const qty = getQtyFromInput(row.qty);
    if (qty <= 0) return;
    const line = qty * row.price;
    if (row.kind === 'base') baseSubtotal += line; else addonSubtotal += line;
    selections.push({ kind: row.kind, svc: row.svc, label: row.label, qty, price: row.price, line });
  });

  const total = baseSubtotal + addonSubtotal;
  const baseEl = document.getElementById('base-subtotal');
  const addonEl = document.getElementById('addon-subtotal');
  const totalEl = document.getElementById('estimate-result');
  if (baseEl) baseEl.textContent = `Detail Subtotal: ${formatCurrency(baseSubtotal)}`;
  if (addonEl) addonEl.textContent = `Add-On Subtotal: ${formatCurrency(addonSubtotal)}`;
  if (totalEl) totalEl.textContent = `Total: ${formatCurrency(total)}`;

  // Hidden, readable multi-line summary submitted to Formspree.
  const hidden = document.getElementById('estimate-hidden');
  if (hidden) hidden.value = selections.length ? buildEstimateSummary(selections, { base: baseSubtotal, addons: addonSubtotal, total }) : '';
}

// Confirmation message + concise Formspree payload on submit.
const intakeForm = document.getElementById('intake-form');
if (intakeForm) {
  intakeForm.addEventListener('submit', function () {
    try { updateEstimator(); } catch {}
    try {
      const allow = new Set(['name', 'email', 'estimate', 'message', '_redirect']);
      Array.from(intakeForm.elements).forEach(el => {
        if (el.name && !allow.has(el.name)) el.removeAttribute('name');
      });
    } catch {}
    const nameEl = document.getElementById('name');
    const confirmation = document.getElementById('confirmation');
    if (confirmation) confirmation.innerText = `Thanks, ${nameEl ? nameEl.value : ''}! We’ve received your request.`;
  });
}

// Build everything from services.js, then wire up listeners.
window.addEventListener('DOMContentLoaded', function () {
  renderPricingCopy();
  renderEstimator();
  estimatorRows.forEach(row => {
    row.cb.addEventListener('change', () => toggleRow(row));
    row.qty.addEventListener('input', updateEstimator);
    row.qty.addEventListener('change', updateEstimator);
  });
  updateEstimator();
});
