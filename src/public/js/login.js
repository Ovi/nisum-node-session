async function handleLogin(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const { username, password } = Object.fromEntries(formData);

  if (!username || !password) return false;

  document.querySelector('.page-login-form-btn').setAttribute('disabled', true);

  const response = await fetch('/api/user/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json = await response.json();

  if (!json.token) {
    document.querySelector('.page-login-form-btn').removeAttribute('disabled');
    alert(json.message);
    return;
  }

  localStorage.setItem('token', json.token);
  localStorage.setItem('user', JSON.stringify(json));

  window.location.href = '/';

  return false;
}
