document.getElementById('intake-form').addEventListener('submit', function (event) {
  const name = document.getElementById('name').value;
  const service = document.getElementById('service').value;

  document.getElementById('confirmation').innerText = 
    `Thanks, ${name}! We’ve received your request for a ${service}.`;
});
