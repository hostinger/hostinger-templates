/**
 * Client-side validation for the disclosure form. This is an enhancement
 * layer: the server re-runs the same checks on every submission, and the
 * error messages come from the same JSON copy via data attributes.
 */
(function () {
  'use strict';

  var form = document.querySelector('[data-disclosure-form]');
  if (!form) {
    return;
  }

  var email = form.querySelector('#disclosure-email');
  var category = form.querySelector('#disclosure-category');
  var description = form.querySelector('#disclosure-description');
  if (!email || !category || !description) {
    return;
  }

  // Mirrors EMAIL_PATTERN / length rules in src/utils/disclosure.ts.
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var EMAIL_MAX_LENGTH = 254;
  var minLength = parseInt(description.getAttribute('minlength') || '20', 10);
  var maxLength = parseInt(description.getAttribute('maxlength') || '4000', 10);
  var messages = form.dataset;

  // Native validation stays available without JavaScript; with it, the
  // inline messages below replace the browser bubbles.
  form.setAttribute('novalidate', 'novalidate');

  function setError(field, message) {
    var errorElement = document.getElementById(field.id + '-error');
    if (!errorElement) {
      return;
    }
    if (message) {
      errorElement.textContent = message;
      errorElement.hidden = false;
      field.setAttribute('aria-invalid', 'true');
    } else {
      errorElement.textContent = '';
      errorElement.hidden = true;
      field.removeAttribute('aria-invalid');
    }
  }

  function emailError() {
    var value = email.value.trim();
    if (value === '') {
      return '';
    }
    if (value.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(value)) {
      return messages.msgEmailInvalid || '';
    }
    return '';
  }

  function categoryError() {
    return category.value === '' ? messages.msgCategoryMissing || '' : '';
  }

  function descriptionError() {
    var value = description.value.trim();
    if (value === '') {
      return messages.msgDescriptionMissing || '';
    }
    if (value.length < minLength) {
      return messages.msgDescriptionTooShort || '';
    }
    if (value.length > maxLength) {
      return messages.msgDescriptionTooLong || '';
    }
    return '';
  }

  var validators = [
    { field: email, check: emailError },
    { field: category, check: categoryError },
    { field: description, check: descriptionError },
  ];

  validators.forEach(function (validator) {
    var eventName = validator.field.tagName === 'SELECT' ? 'change' : 'input';
    validator.field.addEventListener(eventName, function () {
      if (validator.field.getAttribute('aria-invalid') === 'true') {
        setError(validator.field, validator.check());
      }
    });
    validator.field.addEventListener('blur', function () {
      if (validator.field.value.trim() !== '') {
        setError(validator.field, validator.check());
      }
    });
  });

  form.addEventListener('submit', function (event) {
    var firstInvalid = null;
    validators.forEach(function (validator) {
      var message = validator.check();
      setError(validator.field, message);
      if (message && !firstInvalid) {
        firstInvalid = validator.field;
      }
    });
    if (firstInvalid) {
      event.preventDefault();
      firstInvalid.focus();
    }
  });
})();
