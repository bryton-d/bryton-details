

// Estimate prices
const PRICES = {
  sedan: 100,
  smallsuv: 150,
  large: 200
};

const ADDONS = {
  shampoo: 35,
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

  // Add-on selectors for each vehicle type
  const sedanAddons = {
    shampoo: document.getElementById('sedan-shampoo'),
    headlight: document.getElementById('sedan-headlight'),
    engine: document.getElementById('sedan-engine'),
    plastics: document.getElementById('sedan-plastics'),
    wheel: document.getElementById('sedan-wheel')
  };
  const smallsuvAddons = {
    shampoo: document.getElementById('smallsuv-shampoo'),
    headlight: document.getElementById('smallsuv-headlight'),
    engine: document.getElementById('smallsuv-engine'),
    plastics: document.getElementById('smallsuv-plastics'),
    wheel: document.getElementById('smallsuv-wheel')
  };
  const largeAddons = {
    shampoo: document.getElementById('large-shampoo'),
    headlight: document.getElementById('large-headlight'),
    engine: document.getElementById('large-engine'),
    plastics: document.getElementById('large-plastics'),
    wheel: document.getElementById('large-wheel')
  };

  // Enable/disable quantity and add-on inputs based on checkbox state
  function setVehicleInputs(enabled, qtyInput, addons) {
    qtyInput.disabled = !enabled;
    qtyInput.style.background = enabled ? "#fff" : "#eee";
    Object.values(addons).forEach(input => {
      input.disabled = !enabled;
      input.style.background = enabled ? "#fff" : "#eee";
    });
  }
  setVehicleInputs(sedanCheck.checked, sedanQty, sedanAddons);
  setVehicleInputs(smallsuvCheck.checked, smallsuvQty, smallsuvAddons);
  setVehicleInputs(largeCheck.checked, largeQty, largeAddons);

  // Calculate estimate
  let total = 0;
  let summary = [];

  function calcVehicle(type, check, qtyInput, addons) {
    if (!check.checked) return;
    const qty = parseInt(qtyInput.value) || 0;
    let vehicleTotal = qty * PRICES[type];
    let addonSummary = [];
    Object.keys(addons).forEach(key => {
      const addonQty = parseInt(addons[key].value) || 0;
      if (addonQty > 0) {
        vehicleTotal += addonQty * ADDONS[key];
        addonSummary.push(`${addonQty} ${key.charAt(0).toUpperCase() + key.slice(1)}(s)`);
      }
    });
    if (qty > 0) {
      summary.push(`${qty} ${type.charAt(0).toUpperCase() + type.slice(1)}(s)` + (addonSummary.length ? ` with ${addonSummary.join(', ')}` : ''));
    }
    total += vehicleTotal;
  }

  calcVehicle('sedan', sedanCheck, sedanQty, sedanAddons);
  calcVehicle('smallsuv', smallsuvCheck, smallsuvQty, smallsuvAddons);
  calcVehicle('large', largeCheck, largeQty, largeAddons);

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

  // Attach event listeners for all relevant inputs
  const ids = [
    'sedan-check', 'sedan-qty',
    'sedan-shampoo', 'sedan-headlight', 'sedan-engine', 'sedan-plastics', 'sedan-wheel',
    'smallsuv-check', 'smallsuv-qty',
    'smallsuv-shampoo', 'smallsuv-headlight', 'smallsuv-engine', 'smallsuv-plastics', 'smallsuv-wheel',
    'large-check', 'large-qty',
    'large-shampoo', 'large-headlight', 'large-engine', 'large-plastics', 'large-wheel'
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
