// Marketing site: demo-request form submission.
'use strict';
const form = document.getElementById('demoForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const msg = document.getElementById('demoMsg');
    const data = Object.fromEntries(new FormData(form));
    data.source = new URLSearchParams(location.search).get('utm_source') || 'website';
    btn.disabled = true;
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong.');
      form.reset();
      msg.style.color = 'var(--ok)';
      msg.textContent = 'Thank you — we will call you within one working day to schedule your demo.';
    } catch (err) {
      msg.style.color = 'var(--bad)';
      msg.textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  });
}
