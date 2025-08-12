

// Estimate prices
const PRICES = {
  sedan: 100,
  smallsuv: 150,
  large: 200
};

const ADDONS = {
  shampooSedan: 35,
  shampooVan: 50,
  headlight: 25,
  engine: 25,
  plastics: 10,
  wheel: 10
};

function updateEstimator() {
  // Vehicle selectors
  const sedanCheck = document.getElementById('sedan-check');
  const sedanQty = document.getElementById('sedan-qty');
  const smallsuvCheck = document.getElementById('smallsuv-check');
  const smallsuvQty = document.getElementById('smallsuv-qty');
  const largeCheck = document.getElementById('large-check');
  const largeQty = document.getElementById('large-qty');

  // Enable/disable quantity inputs based on checkbox state
  sedanQty.disabled = !sedanCheck.checked;
  sedanQty.style.background = sedanCheck.checked ? "#fff" : "#eee";
  smallsuvQty.disabled = !smallsuvCheck.checked;
  smallsuvQty.style.background = smallsuvCheck.checked ? "#fff" : "#eee";
  largeQty.disabled = !largeCheck.checked;
  largeQty.style.background = largeCheck.checked ? "#fff" : "#eee";

  // Calculate base subtotal
  let baseSubtotal = 0;
  let totalVehicles = 0;
  let summary = [];
  if (sedanCheck.checked) {
    const qty = parseInt(sedanQty.value) || 0;
    baseSubtotal += qty * PRICES.sedan;
    totalVehicles += qty;
    summary.push(`${qty} Sedan(s)`);
  }
  if (smallsuvCheck.checked) {
    const qty = parseInt(smallsuvQty.value) || 0;
    baseSubtotal += qty * PRICES.smallsuv;
    totalVehicles += qty;
    summary.push(`${qty} Small SUV(s)`);
  }
  if (largeCheck.checked) {
    const qty = parseInt(largeQty.value) || 0;
    baseSubtotal += qty * PRICES.large;
    totalVehicles += qty;
    summary.push(`${qty} Large SUV/Van/Truck(s)`);
  }

  // Add-ons section
  const addonFields = [
    { key: 'shampooSedan', check: 'addon-shampoo-sedan-check', qty: 'addon-shampoo-sedan-qty' },
    { key: 'shampooVan', check: 'addon-shampoo-van-check', qty: 'addon-shampoo-van-qty' },
    { key: 'headlight', check: 'addon-headlight-check', qty: 'addon-headlight-qty' },
    { key: 'engine', check: 'addon-engine-check', qty: 'addon-engine-qty' },
    { key: 'plastics', check: 'addon-plastics-check', qty: 'addon-plastics-qty' },
    { key: 'wheel', check: 'addon-wheel-check', qty: 'addon-wheel-qty' }
  ];
  let addonSubtotal = 0;
  let addonSummary = [];
  addonFields.forEach(({ key, check, qty }) => {
    const checkEl = document.getElementById(check);
    const qtyEl = document.getElementById(qty);
    // Default quantity to total vehicles if checked and empty
    if (checkEl.checked && (!qtyEl.value || qtyEl.value === "0")) {
      qtyEl.value = totalVehicles;
    }
    // Disable quantity if not checked, enable if checked
    qtyEl.disabled = !checkEl.checked;
    qtyEl.style.background = checkEl.checked ? "#fff" : "#eee";
    if (checkEl.checked) {
      const addonQty = parseInt(qtyEl.value) || 0;
      if (addonQty > 0) {
        addonSubtotal += addonQty * ADDONS[key];
        addonSummary.push(`${addonQty} ${key.charAt(0).toUpperCase() + key.slice(1)}(s)`);
      }
    }
  });

  // Update subtotals and total
  const total = baseSubtotal + addonSubtotal;
  document.getElementById('base-subtotal').textContent = `Base Subtotal: $${baseSubtotal}`;
  document.getElementById('addon-subtotal').textContent = `Add-On Subtotal: $${addonSubtotal}`;
  document.getElementById('estimate-result').textContent = total > 0 ? `Total: $${total}` : 'Total: $0';
  document.getElementById('estimate-hidden').value = summary.length > 0
    ? `${summary.join(', ')}${addonSummary.length ? ' | Add-ons: ' + addonSummary.join(', ') : ''} | Estimate: $${total}`
    : '';
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

  // Attach event listeners for all relevant inputs
  const ids = [
    'sedan-check', 'sedan-qty',
    'smallsuv-check', 'smallsuv-qty',
    'large-check', 'large-qty',
    'addon-shampoo-sedan-check', 'addon-shampoo-sedan-qty',
    'addon-shampoo-van-check', 'addon-shampoo-van-qty',
    'addon-headlight-check', 'addon-headlight-qty',
    'addon-engine-check', 'addon-engine-qty',
    'addon-plastics-check', 'addon-plastics-qty',
    'addon-wheel-check', 'addon-wheel-qty'
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', updateEstimator);
      el.addEventListener('input', updateEstimator);
    }
  });
});


document.getElementById('intake-form').addEventListener('submit', function (event) {
  const name = document.getElementById('name').value;
  const service = document.getElementById('service').value;

  document.getElementById('confirmation').innerText = 
    `Thanks, ${name}! We’ve received your request for a ${service}.`;
});
