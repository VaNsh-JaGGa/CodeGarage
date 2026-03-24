export const validateField = (name, value, formData) => {
  let errors = {};

  // Full Name
  if (name === "fullNameValue") {
    const regex = /^[A-Za-z]+(?: [A-Za-z]+)?$/;

    if (value.length === 0 || !regex.test(value) || value.endsWith(" ")) {
      errors.fullNameValue = true;
    } else {
      errors.fullNameValue = false;
    }
  }

  // Contact
  if (name === "contactNumberValue") {
    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(value)) {
      errors.contactNumberValue = true;
    } else {
      errors.contactNumberValue = false;
    }
  }

  // Email
  if (name === "emailValue") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      errors.emailValue = true;
    } else {
      errors.emailValue = false;
    }
  }

  // Password
  if (name === "passwordValue") {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(value)) {
      errors.passwordValue = true;
    } else {
      errors.passwordValue = false;
    }
  }

  // Confirm Password
  if (name === "confirmPasswordValue") {
    if (value !== formData.passwordValue || value.length < 8) {
      errors.confirmPasswordValue = true;
    } else {
      errors.confirmPasswordValue = false;
    }
  }

  return errors;
};