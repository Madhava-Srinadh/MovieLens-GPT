export const validate = (
  email,
  password,
  confirmPassword,
  isSignUp,
  isResetPassword = false
) => {
  if (isSignUp) {
    if (!email) {
      return { isValid: false, message: "Email is required." };
    }

    if (!password || password.length < 8) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters long.",
      };
    }

    if (password !== confirmPassword) {
      return { isValid: false, message: "Passwords do not match." };
    }
  } else if (isResetPassword) {
    if (!email) {
      return { isValid: false, message: "Email is required." };
    }

    if (password && password.length < 8) {
      return {
        isValid: false,
        message: "New password must be at least 8 characters long.",
      };
    }

    if (password !== confirmPassword) {
      return { isValid: false, message: "Passwords do not match." };
    }
  } else {
    if (!email) {
      return { isValid: false, message: "Email is required." };
    }

    if (!password || password.length < 8) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters long.",
      };
    }
  }

  return { isValid: true, message: "" };
};
