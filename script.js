

// Estimate prices
const PRICES = {
  sedan: 100,
  smallsuv: 150,
  large: 200
};

function updateEstimator() {
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

  // Calculate estimate
  let total = 0;
  let summary = [];

  if (sedanCheck.checked) {
    const qty = parseInt(sedanQty.value) || 0;
    total += qty * PRICES.sedan;
    summary.push(`${qty} Sedan(s)`);
  }

  if (smallsuvCheck.checked) {
    const qty = parseInt(smallsuvQty.value) || 0;
    total += qty * PRICES.smallsuv;
    summary.push(`${qty} Small SUV(s)`);
  }

  if (largeCheck.checked) {
    const qty = parseInt(largeQty.value) || 0;
    total += qty * PRICES.large;
    summary.push(`${qty} Large SUV/Van/Truck(s)`);
  }

  const resultText = total > 0 ? `Estimated Total: $${total}` : '';
  document.getElementById('estimate-result').textContent = resultText;
  document.getElementById('estimate-hidden').value = summary.length > 0
    ? `${summary.join(', ')} | Estimate: $${total}`
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

  // Optional: Attach JS event listeners (redundant if using inline handlers in HTML)
  const inputs = [
    'sedan-check', 'sedan-qty',
    'smallsuv-check', 'smallsuv-qty',
    'large-check', 'large-qty'
  ];

  inputs.forEach(id => {
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
