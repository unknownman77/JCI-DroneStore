document.addEventListener('DOMContentLoaded', () => {
  // set footer years
  const years = document.querySelectorAll('#year, #year2, #year3, #year4, #year5');
  const y = new Date().getFullYear();
  years.forEach(el => { if (el) el.textContent = y; });

  // mobile menu toggle
  const toggles = document.querySelectorAll('.menu-toggle');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const mobile = document.getElementById('mobileMenu');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (mobile) {
        if (mobile.hidden) {
          mobile.hidden = false;
        } else {
          mobile.hidden = true;
        }
      }
    });
  });

  // keyboard accessible focus styles for links
  document.body.addEventListener('keyup', (e) => {
    if (e.key === 'Tab') {
      document.documentElement.classList.add('user-is-tabbing');
    }
  });

  // contact form validation attachment
  attachContactValidation();
});

// contact form validation (no regex)
function attachContactValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = form.querySelector('#fullName');
  const phoneInput = form.querySelector('#phone');
  const emailInput = form.querySelector('#email');
  const productSelect = form.querySelector('#product');
  const messageInput = form.querySelector('#message');
  const tosCheckbox = form.querySelector('#tos');

  function showError(el, msg) {
    let hint = el.parentElement.querySelector('.hint');
    if (!hint) {
      hint = document.createElement('div');
      hint.className = 'hint';
      el.parentElement.appendChild(hint);
    }
    hint.textContent = msg;
    el.classList.add('invalid');
  }
  function clearError(el) {
    const hint = el.parentElement.querySelector('.hint');
    if (hint) hint.textContent = '';
    el.classList.remove('invalid');
  }

  function validateName() {
    const v = nameInput.value.trim();
    if (v.length < 3) {
      showError(nameInput, 'Please enter your full name (at least 3 characters).');
      return false;
    }
    clearError(nameInput);
    return true;
  }

  function validatePhone() {
    const v = phoneInput.value.trim();
    if (v.length < 8) {
      showError(phoneInput, 'Phone number is too short.');
      return false;
    }
    // ensure characters are digits or leading +
    for (let i = 0; i < v.length; i++) {
      const ch = v[i];
      if (i === 0 && ch === '+') continue;
      if (ch < '0' || ch > '9') {
        showError(phoneInput, 'Phone number must contain only digits and optional leading +.');
        return false;
      }
    }
    clearError(phoneInput);
    return true;
  }

  function validateEmail() {
    const v = emailInput.value.trim();
    const at = v.indexOf('@');
    const dot = v.lastIndexOf('.');
    if (at <= 0 || dot <= at + 1 || dot === v.length - 1) {
      showError(emailInput, 'Please enter a valid email address.');
      return false;
    }
    clearError(emailInput);
    return true;
  }

  function validateProduct() {
    if (!productSelect.value) {
      showError(productSelect, 'Please select a product of interest.');
      return false;
    }
    clearError(productSelect);
    return true;
  }

  function validateMessage() {
    const v = messageInput.value.trim();
    if (v.length < 10) {
      showError(messageInput, 'Message must be at least 10 characters.');
      return false;
    }
    const lower = v.toLowerCase();
    const prohibited = ['spam', 'test', 'hack'];
    for (let i = 0; i < prohibited.length; i++) {
      if (lower.includes(prohibited[i])) {
        showError(messageInput, 'Message contains prohibited content.');
        return false;
      }
    }
    clearError(messageInput);
    return true;
  }

  function validateTOS() {
    if (!tosCheckbox.checked) {
      showError(tosCheckbox, 'You must agree to the terms of service.');
      return false;
    }
    clearError(tosCheckbox);
    return true;
  }

  // Real-time validation
  nameInput.addEventListener('input', validateName);
  phoneInput.addEventListener('input', validatePhone);
  emailInput.addEventListener('input', validateEmail);
  productSelect.addEventListener('change', validateProduct);
  messageInput.addEventListener('input', validateMessage);
  tosCheckbox.addEventListener('change', validateTOS);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = [validateName(), validatePhone(), validateEmail(), validateProduct(), validateMessage(), validateTOS()].every(Boolean);
    if (!ok) {
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // simulate sending data (replace with real endpoint)
    const payload = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      product: productSelect.value,
      message: messageInput.value.trim()
    };

    // use fetch to a demo endpoint (this will fail locally unless you provide an endpoint)
    fetch('/api/contact', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    }).then(res => {
      if (res.ok) {
        alert('Message sent. Our support team will contact you shortly.');
        form.reset();
      } else {
        // fallback success message for demo
        alert('Message queued (demo). Thank you.');
        form.reset();
      }
    }).catch(() => {
      // network fallback for demo
      alert('Message queued (offline demo). Thank you.');
      form.reset();
    });
  });
}

