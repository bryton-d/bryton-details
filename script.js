
document.addEventListener('DOMContentLoaded', function() {
  // Pricing
  const PRICES = { sedan: 100, small_suv: 150, large_suv: 200 };
  function updateEstimate() {
    let total = 0;
    if (document.getElementById('vehicle_sedan').checked) {
      total += PRICES.sedan * parseInt(document.getElementById('qty_sedan').value || 0);
    }
    if (document.getElementById('vehicle_small_suv').checked) {
      total += PRICES.small_suv * parseInt(document.getElementById('qty_small_suv').value || 0);
    }
    if (document.getElementById('vehicle_large_suv').checked) {
      total += PRICES.large_suv * parseInt(document.getElementById('qty_large_suv').value || 0);
    }
    document.getElementById('estimate').textContent = total;
  }
  document.getElementById('vehicle_sedan').addEventListener('change', updateEstimate);
  document.getElementById('vehicle_small_suv').addEventListener('change', updateEstimate);
  document.getElementById('vehicle_large_suv').addEventListener('change', updateEstimate);
  document.getElementById('qty_sedan').addEventListener('input', updateEstimate);
  document.getElementById('qty_small_suv').addEventListener('input', updateEstimate);
  document.getElementById('qty_large_suv').addEventListener('input', updateEstimate);
  updateEstimate();
});
