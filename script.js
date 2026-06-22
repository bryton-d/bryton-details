// Estimator logic — single full-detail price per vehicle class.
// The data-price attribute on each vehicle checkbox in index.html is the source
// of truth; this map is only a fallback if a data-price attribute is missing.
const VEHICLE_PRICES = {
  sedan: 150,
  smallsuv: 200,
  large: 250
};

// Add-on prices keyed by the id middle segment after `addon-` in the HTML.
// data-price in the HTML is the source of truth; this map is a fallback.
const ADDON_PRICES = {
  'shampoo-sedan': 75,     // Seat Shampooing
  'headlight': 50,         // Headlight Restoration
  'engine': 25,            // Engine Bay Cleaning
  'plastics': 25           // Plastic Trim Shine
};

// Human-friendly labels for the summary.
const VEHICLE_LABEL = {
  sedan: 'Sedan',
  smallsuv: '2 Row SUV / Crossover',
  large: '3 Row SUV / Van / Truck'
};

const ADDON_LABEL = {
  'shampoo-sedan': 'Seat Shampooing',
  headlight: 'Headlight Restoration',
  engine: 'Engine Bay Cleaning',
  plastics: 'Plastic Trim Shine'
};

const VEHICLE_TYPES = ['sedan', 'smallsuv', 'large'];
const ADDON_KEYS = ['shampoo-sedan', 'headlight', 'engine', 'plastics'];

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

function getVehiclePrice(type) {
  // Prefer data-price on the vehicle checkbox, fall back to the map.
  const cb = document.getElementById(`${type}-check`);
  const dataVal = cb && cb.dataset ? cb.dataset.price : null;
  const parsed = dataVal ? parseFloat(dataVal) : NaN;
  if (!Number.isNaN(parsed)) return parsed;
  return VEHICLE_PRICES?.[type] ?? 0;
}

function getAddonPrice(key) {
  const cb = document.getElementById(`addon-${key}-check`);
  const input = document.getElementById(`addon-${key}-qty`);
  const dataVal = (cb && cb.dataset && cb.dataset.price) || (input && input.dataset && input.dataset.price);
  const parsed = dataVal ? parseFloat(dataVal) : NaN;
  if (!Number.isNaN(parsed)) return parsed;
  return ADDON_PRICES?.[key] ?? 0;
}

// Enable/disable a vehicle's quantity input based on its checkbox, and default
// the quantity to 1 the moment a vehicle is selected.
function toggleVehicle(type) {
  const cb = document.getElementById(`${type}-check`);
  const qty = document.getElementById(`${type}-qty`);
  if (!cb || !qty) return;
  qty.disabled = !cb.checked;
  qty.style.background = cb.checked ? '#fff' : '#eee';
  if (!cb.checked) {
    qty.value = 0;
  } else if (getQtyFromInput(qty) === 0) {
    qty.value = 1;
  }
  updateEstimator();
}

function buildEstimateSummary(vehicleSelections, addonSelections, totals) {
  const parts = [];
  if (vehicleSelections.length) {
    parts.push('--- Full Detail ---');
    vehicleSelections.forEach(v => {
      const label = VEHICLE_LABEL[v.type] || v.type;
      parts.push(`  • ${label} (${v.qty} @ ${formatCurrency(v.price)} = ${formatCurrency(v.line)})`);
    });
    parts.push('');
  }
  if (addonSelections.length) {
    parts.push('--- Add-Ons ---');
    addonSelections.forEach(a => {
      const name = ADDON_LABEL[a.key] || a.key;
      parts.push(`  • ${name} (${a.qty} @ ${formatCurrency(a.price)} = ${formatCurrency(a.line)})`);
    });
    parts.push('');
  }
  parts.push(`Detail Total: ${formatCurrency(totals.base)}`);
  parts.push(`Add-On Total: ${formatCurrency(totals.addons)}`);
  parts.push(`Overall Estimate: ${formatCurrency(totals.total)}`);
  return parts.join('\n');
}

function updateEstimator() {
  // Base (full-detail) subtotal: one price per vehicle, times quantity.
  let baseSubtotal = 0;
  const vehicleSelections = [];
  VEHICLE_TYPES.forEach(type => {
    const cb = document.getElementById(`${type}-check`);
    const qtyEl = document.getElementById(`${type}-qty`);
    if (!cb || !qtyEl) return;
    qtyEl.disabled = !cb.checked;
    qtyEl.style.background = cb.checked ? '#fff' : '#eee';
    if (!cb.checked) return;
    const qty = getQtyFromInput(qtyEl);
    if (qty <= 0) return;
    const price = getVehiclePrice(type);
    const line = qty * price;
    baseSubtotal += line;
    vehicleSelections.push({ type, qty, price, line });
  });

  // Add-on subtotal.
  let addonSubtotal = 0;
  const addonSelections = [];
  ADDON_KEYS.forEach(key => {
    const cb = document.getElementById(`addon-${key}-check`);
    const qtyEl = document.getElementById(`addon-${key}-qty`);
    if (!cb || !qtyEl) return;
    qtyEl.disabled = !cb.checked;
    qtyEl.style.background = cb.checked ? '#fff' : '#eee';
    if (!cb.checked) return;
    const qty = getQtyFromInput(qtyEl);
    if (qty <= 0) return;
    const price = getAddonPrice(key);
    const line = qty * price;
    addonSubtotal += line;
    addonSelections.push({ key, qty, price, line });
  });

  // Totals and on-screen outputs.
  const total = baseSubtotal + addonSubtotal;
  const baseEl = document.getElementById('base-subtotal');
  const addonEl = document.getElementById('addon-subtotal');
  const totalEl = document.getElementById('estimate-result');
  if (baseEl) baseEl.textContent = `Detail Subtotal: ${formatCurrency(baseSubtotal)}`;
  if (addonEl) addonEl.textContent = `Add-On Subtotal: ${formatCurrency(addonSubtotal)}`;
  if (totalEl) totalEl.textContent = `Total: ${formatCurrency(total)}`;

  // Short, single-line summary for display/debugging.
  const parts = [];
  vehicleSelections.forEach(v => {
    const label = VEHICLE_LABEL[v.type] || v.type;
    const plural = v.qty > 1 ? 's' : '';
    parts.push(`${v.qty} ${label}${plural} (Full Detail)`);
  });
  if (addonSelections.length) {
    const addonNames = addonSelections.map(a => ADDON_LABEL[a.key] || a.key).join(', ');
    if (addonNames) parts.push(`Add-ons: ${addonNames}`);
  }
  parts.push(`Estimate ${formatCurrency(total)}`);

  // Hidden, readable multi-line summary submitted to Formspree.
  const hidden = document.getElementById('estimate-hidden');
  const full = buildEstimateSummary(vehicleSelections, addonSelections, { base: baseSubtotal, addons: addonSubtotal, total });
  if (hidden) hidden.value = (vehicleSelections.length || addonSelections.length) ? full : '';
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

// Initialize estimator and wire up listeners.
window.addEventListener('DOMContentLoaded', function () {
  updateEstimator();

  VEHICLE_TYPES.forEach(type => {
    const cb = document.getElementById(`${type}-check`);
    const qty = document.getElementById(`${type}-qty`);
    if (cb) cb.addEventListener('change', () => toggleVehicle(type));
    if (qty) {
      qty.addEventListener('input', updateEstimator);
      qty.addEventListener('change', updateEstimator);
    }
  });

  ADDON_KEYS.forEach(key => {
    const cb = document.getElementById(`addon-${key}-check`);
    const qty = document.getElementById(`addon-${key}-qty`);
    if (cb) cb.addEventListener('change', updateEstimator);
    if (qty) qty.addEventListener('input', updateEstimator);
  });
});
