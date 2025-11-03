const urls = {
  frontend: 'http://localhost:5173/',
  events: 'http://localhost:3000/api/event',
  login: 'http://localhost:3000/api/user/login'
};

(async () => {
  // Frontend probe
  try {
    const r = await fetch(urls.frontend, { method: 'GET' });
    console.log('FRONTEND', r.status);
  } catch (e) {
    console.log('FRONTEND_ERR', e.message);
  }

  // Events
  try {
    const r = await fetch(urls.events, { method: 'GET' });
    const text = await r.text();
    console.log('EVENTS', r.status);
    console.log(text);
  } catch (e) {
    console.log('EVENTS_ERR', e.message);
  }

  // Login
  try {
    const r = await fetch(urls.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@admin', password: '1234' })
    });
    const text = await r.text();
    console.log('LOGIN', r.status);
    console.log(text);
  } catch (e) {
    console.log('LOGIN_ERR', e.message);
  }
})();
