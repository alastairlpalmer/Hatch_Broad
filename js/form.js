/* ══════════════════════════════════════════════════
   Hatch — Contact Form (Formspree)
   ══════════════════════════════════════════════════ */

(function () {
  'use strict';

  function initForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        clearError(field);
        if (!field.value.trim()) {
          showError(field, 'This field is required');
          valid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
          showError(field, 'Please enter a valid email');
          valid = false;
        }
      });

      if (!valid) return;

      var submitBtn = form.querySelector('.form-submit');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      })
        .then(function (response) {
          if (response.ok) {
            form.innerHTML =
              '<div class="form-success">' +
              '<h3>Thank you!</h3>' +
              '<p>We\'ll be in touch within 24 hours to arrange your consultation.</p>' +
              '</div>';
          } else {
            submitBtn.textContent = 'Something went wrong — try again';
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            setTimeout(function () { submitBtn.textContent = originalText; }, 3000);
          }
        })
        .catch(function () {
          submitBtn.textContent = 'Network error — try again';
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          setTimeout(function () { submitBtn.textContent = originalText; }, 3000);
        });
    });

    // Clear validation on input
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () { clearError(field); });
    });
  }

  function showError(field, msg) {
    field.classList.add('invalid');
    var err = document.createElement('div');
    err.className = 'form-error';
    err.textContent = msg;
    field.parentNode.appendChild(err);
  }

  function clearError(field) {
    field.classList.remove('invalid');
    var existing = field.parentNode.querySelector('.form-error');
    if (existing) existing.remove();
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
  } else {
    initForm();
  }

})();
