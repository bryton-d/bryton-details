

// Price maps used by estimator; prefer data-price attribute on elements if present.
const BASE_PRICES = {
  sedan: { interior: 75, exterior: 50, interiorexterior: 100 },
  smallsuv: { interior: 100, exterior: 75, interiorexterior: 150 },
  // NOTE: If you want a different bundle price, update here or add data-price on the checkbox.
  large: { interior: 125, exterior: 100, interiorexterior: 200 }
};

// Add-on prices keyed by the id middle segment after `addon-` in the HTML.
// These correspond to the current rows in index.html.
const ADDON_PRICES = {
  'shampoo-sedan': 50,     // Seat Shampooing ($50)
  'headlight': 25,         // Headlight Polish ($25)
  'engine': 25,            // Engine Bay Cleaning ($25)
  'plastics': 25           // Plastic Trim Shine ($25)
};

function formatCurrency(n) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  } catch {
    // minimal fallback
    return `$${(n || 0).toLocaleString()}`;
  }
}

function getQtyFromInput(el) {
  if (!el || el.disabled) return 0;
  const v = parseInt(el.value, 10);
  return Number.isFinite(v) && v > 0 ? v : 0;
}

function getServicePrice(type, service) {
  // Prefer data-price on checkbox or number input
  const cb = document.getElementById(`${type}-${service}-check`);
  const input = document.getElementById(`${type}-${service}`);
  const dataVal = (cb && cb.dataset && cb.dataset.price) || (input && input.dataset && input.dataset.price);
  const parsed = dataVal ? parseFloat(dataVal) : NaN;
  if (!Number.isNaN(parsed)) return parsed;
  // Fallback to map
  return BASE_PRICES?.[type]?.[service] ?? 0;
}

function getAddonPrice(key) {
  // key corresponds to the id fragment after `addon-` (e.g., 'headlight')
  // Prefer data-price on checkbox if present
  const cb = document.getElementById(`addon-${key}-check`);
  const input = document.getElementById(`addon-${key}-qty`);
  const dataVal = (cb && cb.dataset && cb.dataset.price) || (input && input.dataset && input.dataset.price);
  const parsed = dataVal ? parseFloat(dataVal) : NaN;
  if (!Number.isNaN(parsed)) return parsed;
  // Fallback
  return ADDON_PRICES?.[key] ?? 0;
}

function toggleServices(type) {
  const checked = document.getElementById(`${type}-check`).checked;
  const qty = document.getElementById(`${type}-qty`);
  qty.disabled = !checked;
  if (!checked) qty.value = 0;

  document.querySelectorAll(`.${type}-service`).forEach(row => {
    row.style.display = checked ? 'table-row' : 'none';
    const input = row.querySelector('input[type="number"]');
    if (!checked && input) input.value = 0;
    const cb = row.querySelector('input[type="checkbox"]');
    if (!checked && cb) cb.checked = false;
  });

  if (checked) {
    syncServiceQty(type);
  }
}

function syncServiceQty(type) {
  // Read vehicle total quantity (as number)
  const qty = parseInt(document.getElementById(`${type}-qty`).value) || 0;
  // For each service row: if its checkbox is checked, enable the number input and set it to vehicle qty.
  document.querySelectorAll(`.${type}-service`).forEach(row => {
    const cb = row.querySelector('input[type="checkbox"]');
    const input = row.querySelector('input[type="number"]');
    if (!input || !cb) return;
    if (cb.checked && qty > 0) {
      input.disabled = false;
      input.value = qty;
    } else if (cb.checked && qty === 0) {
      // checked but vehicle qty 0: enable input but keep value 0 so user can adjust
      input.disabled = false;
      input.value = 0;
    } else {
      input.disabled = true;
      input.value = 0;
    }
  });
}

function toggleServiceItem(type, service) {
  const check = document.getElementById(`${type}-${service}-check`);
  const input = document.getElementById(`${type}-${service}`);
  const qty = document.getElementById(`${type}-qty`).value;
  if (!input || !check) return;
  const vehicleQty = parseInt(qty) || 0;
  if (check.checked) {
    input.disabled = false;
    // if vehicle has a positive qty, initialize service qty to match it
    input.value = vehicleQty > 0 ? vehicleQty : 0;
  } else {
    input.disabled = true;
    input.value = 0;
  }
  updateEstimator();
}


function updateEstimator() {
  // Vehicle selectors
  const vehicleTypes = ['sedan', 'smallsuv', 'large'];
  const services = ['interior', 'exterior', 'interiorexterior'];

  // Enable/disable quantity inputs based on checkbox state (visual only)
  const sedanCheck = document.getElementById('sedan-check');
  const sedanQty = document.getElementById('sedan-qty');
  const smallsuvCheck = document.getElementById('smallsuv-check');
  const smallsuvQty = document.getElementById('smallsuv-qty');
  const largeCheck = document.getElementById('large-check');
  const largeQty = document.getElementById('large-qty');
  if (sedanQty && sedanCheck) { sedanQty.disabled = !sedanCheck.checked; sedanQty.style.background = sedanCheck.checked ? '#fff' : '#eee'; }
  if (smallsuvQty && smallsuvCheck) { smallsuvQty.disabled = !smallsuvCheck.checked; smallsuvQty.style.background = smallsuvCheck.checked ? '#fff' : '#eee'; }
  if (largeQty && largeCheck) { largeQty.disabled = !largeCheck.checked; largeQty.style.background = largeCheck.checked ? '#fff' : '#eee'; }

  // Calculate base subtotal by summing checked sub-items only
  let baseSubtotal = 0;
  const baseSelections = [];
  vehicleTypes.forEach(type => {
    // Only consider services if vehicle type is active (checked)
    const vcb = document.getElementById(`${type}-check`);
    if (!vcb || !vcb.checked) return;
    services.forEach(service => {
      const cb = document.getElementById(`${type}-${service}-check`);
      const qtyEl = document.getElementById(`${type}-${service}`);
      if (!cb || !qtyEl) return;
      if (!cb.checked || qtyEl.disabled) return;
      const qty = getQtyFromInput(qtyEl);
      if (qty <= 0) return;
      const price = getServicePrice(type, service);
      const line = qty * price;
      baseSubtotal += line;
      baseSelections.push({ type, service, qty, price, line });
    });
  });

  // Add-ons: compute from the add-on rows present in the DOM
  const addonKeys = ['shampoo-sedan', 'headlight', 'engine', 'plastics'];
  let addonSubtotal = 0;
  const addonSelections = [];
  addonKeys.forEach(key => {
    const cb = document.getElementById(`addon-${key}-check`);
    const qtyEl = document.getElementById(`addon-${key}-qty`);
    if (!cb || !qtyEl) return;
    qtyEl.disabled = !cb.checked; // keep UI state consistent
    qtyEl.style.background = cb.checked ? '#fff' : '#eee';
    if (!cb.checked || qtyEl.disabled) return;
    const qty = getQtyFromInput(qtyEl);
    if (qty <= 0) return;
    const price = getAddonPrice(key);
    const line = qty * price;
    addonSubtotal += line;
    addonSelections.push({ key, qty, price, line });
  });

  // Totals and outputs
  const total = baseSubtotal + addonSubtotal;
  const baseEl = document.getElementById('base-subtotal');
  const addonEl = document.getElementById('addon-subtotal');
  const totalEl = document.getElementById('estimate-result');
  if (baseEl) baseEl.textContent = `Base Subtotal: ${formatCurrency(baseSubtotal)}`;
  if (addonEl) addonEl.textContent = `Add-On Subtotal: ${formatCurrency(addonSubtotal)}`;
  if (totalEl) totalEl.textContent = `Total: ${formatCurrency(total)}`;

  // Hidden summary (compact JSON string)
  const hidden = document.getElementById('estimate-hidden');
  const summary = {
    base: baseSelections,
    addons: addonSelections,
    totals: { base: baseSubtotal, addons: addonSubtotal, total }
  };
  if (hidden) hidden.value = (baseSelections.length || addonSelections.length) ? JSON.stringify(summary) : '';
}

// Display confirmation message after form submit
document.getElementById('intake-form').addEventListener('submit', function (event) {
  const name = document.getElementById('name').value;
  document.getElementById('confirmation').innerText =
    `Thanks, ${name}! We’ve received your request.`;
});

// Initialize event listeners and estimator
window.addEventListener('DOMContentLoaded', function () {
  updateEstimator();

  // Attach listeners per vehicle type and their services so syncing works
  const vehicleTypes = ['sedan', 'smallsuv', 'large'];
  const services = ['interior', 'exterior', 'interiorexterior'];

  vehicleTypes.forEach(type => {
    const typeCheck = document.getElementById(`${type}-check`);
    const typeQty = document.getElementById(`${type}-qty`);
    if (typeCheck) typeCheck.addEventListener('change', () => { toggleServices(type); updateEstimator(); });
    if (typeQty) {
      typeQty.addEventListener('input', () => { syncServiceQty(type); updateEstimator(); });
      typeQty.addEventListener('change', () => { syncServiceQty(type); updateEstimator(); });
    }

    // attach service checkbox listeners and number input listeners
    services.forEach(service => {
      const sid = `${type}-${service}-check`;
      const cid = document.getElementById(sid);
      if (cid) cid.addEventListener('change', () => { toggleServiceItem(type, service); });

      const nid = `${type}-${service}`;
      const nEl = document.getElementById(nid);
      if (nEl) {
        nEl.addEventListener('input', updateEstimator);
      }
    });
  });

  // Attach listeners for addon fields
  const addonIds = [
    'addon-shampoo-sedan-check','addon-shampoo-sedan-qty',
    'addon-shampoo-van-check','addon-shampoo-van-qty',
    'addon-headlight-check','addon-headlight-qty',
    'addon-engine-check','addon-engine-qty',
    'addon-plastics-check','addon-plastics-qty',
    'addon-wheel-check','addon-wheel-qty'
  ];
  addonIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', updateEstimator);
      el.addEventListener('input', updateEstimator);
    }
  });
});

