const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+()\-\s]{7,20}$/;

export function validateCheckout(formData) {
  const errors = {};

  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Укажите имя (от 2 символов)';
  }

  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = 'Введите корректный email';
  }

  if (!formData.phone || !phoneRegex.test(formData.phone)) {
    errors.phone = 'Введите телефон';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function renderFieldErrors(formEl, errors) {
  const fields = ['name', 'email', 'phone'];
  fields.forEach((name) => {
    const errorEl = formEl.querySelector(`[data-error-for="${name}"]`);
    if (errorEl) {
      errorEl.textContent = errors[name] || '';
    }
  });
}
