
export const submitUtils = (formData) => {
  let newErrors = {};

  // Full Name
  const lastIndex = formData.fullNameValue.length - 1;
  const lastChar = formData.fullNameValue[lastIndex];
  const nameRegex = /^[A-Za-z\s]+$/;

  if (
    formData.fullNameValue.trim() === "" ||
    lastChar === " " ||
    !nameRegex.test(formData.fullNameValue)
  ) {
    newErrors.fullNameValue = true;
  }

  // Contact
  const phoneRegex = /^[0-9]{10}$/;

  if (!phoneRegex.test(formData.contactNumberValue)) {
    newErrors.contactNumberValue = true;
  }

  // Date
  if (!formData.day) newErrors.day = true;
  if (!formData.month) newErrors.month = true;
  if (!formData.year) newErrors.year = true;

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(formData.emailValue)) {
    newErrors.emailValue = true;
  }

  // Password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!passwordRegex.test(formData.passwordValue)) {
    newErrors.passwordValue = true;
  }

  // Confirm Password
  if (
    formData.confirmPasswordValue !== formData.passwordValue ||
    formData.confirmPasswordValue.length < 8
  ) {
    newErrors.confirmPasswordValue = true;
  }

  return newErrors;
};