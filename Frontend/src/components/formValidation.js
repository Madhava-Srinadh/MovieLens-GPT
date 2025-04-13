export const validate = (
  email,
  password,
  confirmPassword,
  isSignUp,
  isResetPassword = false
) => {
  // Common email validation
  const validateEmail = (email) => {
    if (!email) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Invalid email format.";
    return "";
  };

  // Common password validation
  const validatePassword = (pwd) => {
    if (!pwd) return "Password is required.";
    if (pwd.length < 6) return "Password must be at least 6 characters long.";
    return "";
  };

  if (isSignUp) {
    const emailError = validateEmail(email);
    if (emailError) return { isValid: false, message: emailError };

    const passwordError = validatePassword(password);
    if (passwordError) return { isValid: false, message: passwordError };

    if (password !== confirmPassword)
      return { isValid: false, message: "Passwords do not match." };
  } else if (isResetPassword) {
    // For reset password, only validate passwords if provided
    if (password || confirmPassword) {
      const passwordError = validatePassword(password);
      if (passwordError) return { isValid: false, message: passwordError };

      if (password !== confirmPassword)
        return { isValid: false, message: "Passwords do not match." };
    }
    // If email is provided (e.g., for sending reset link)
    if (email) {
      const emailError = validateEmail(email);
      if (emailError) return { isValid: false, message: emailError };
    }
  } else {
    // Sign-in
    const emailError = validateEmail(email);
    if (emailError) return { isValid: false, message: emailError };

    const passwordError = validatePassword(password);
    if (passwordError) return { isValid: false, message: passwordError };
  }

  return { isValid: true, message: "" };
};
