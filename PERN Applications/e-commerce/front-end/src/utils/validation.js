export const validateField = (name, value) => {
  let error = "";

  if (name === "name") {
    if (!value || value.trim().length < 3) {
      error = "Name must be at least 3 characters long.";
    }
  } else if (name === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailRegex.test(value)) {
      error = "Please enter a valid email address.";
    }
  } else if (name === "password") {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!value || !passwordRegex.test(value)) {
      error = "Password must be at least 8 characters long and include one lowercase letter, one uppercase letter, one number, and one special symbol.";
    }
  } else if (name === "role") {
    const validRoles = ["buyer", "seller", "admin"];
    if (!value || !validRoles.includes(value.trim().toLowerCase())) {
      error = "Role must be 'buyer', 'seller', or 'admin'.";
    }
  }

  return error;
};

export const validateSignupForm = (formData) => {
  const errors = {};
  Object.keys(formData).forEach((key) => {
    const error = validateField(key, formData[key]);
    if (error) {
      errors[key] = error;
    }
  });
  return errors;
};
