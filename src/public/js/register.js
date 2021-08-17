async function handleRegister(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const { fullName, username, email, password } = Object.fromEntries(formData);

  if (!fullName || !username || !email || !password) return false;

  document.querySelector('.page-login-form-btn').setAttribute('disabled', true);

  const response = await fetch('/api/user/register', {
    method: 'POST',
    body: JSON.stringify({ fullName, username, email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json = await response.json();

  if (!json.success) {
    alert(json.message);
  } else {
    window.location.href = '/login';
  }

  document.querySelector('.page-login-form-btn').removeAttribute('disabled');
  return false;
}
