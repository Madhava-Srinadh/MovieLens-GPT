import React, { useState, useRef, useEffect, useCallback } from "react";
import { BG_IMG_URL } from "../utils/constants";
import Header from "./Header";
import { validate } from "./formValidation";
import { auth, googleProvider } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  updateEmail,
  updatePassword,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  sendEmailVerification,
  applyActionCode,
} from "firebase/auth";
import { useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { FcGoogle } from "react-icons/fc";

// Custom hook for auth logic
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getErrorMessage = (error) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Email already registered.";
      case "auth/invalid-email":
        return "Invalid email format.";
      case "auth/weak-password":
        return "Password must be 6+ characters.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/user-not-found":
        return "No account found.";
      case "auth/too-many-requests":
        return "Too many attempts. Try later.";
      case "auth/expired-action-code":
        return "Link expired.";
      case "auth/invalid-action-code":
        return "Invalid link.";
      case "auth/requires-recent-login":
        return "Please sign in again to update profile.";
      default:
        return "An error occurred.";
    }
  };

  return { dispatch, navigate, getErrorMessage };
};

const Login = () => {
  const [authState, setAuthState] = useState("signIn");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const email = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);
  const fullName = useRef(null);
  const newEmail = useRef(null);
  const newPassword = useRef(null);
  const resetEmail = useRef(null);
  const resetPassword = useRef(null);
  const resetConfirmPassword = useRef(null);

  const { dispatch, navigate, getErrorMessage } = useAuth();
  const user = useSelector((store) => store.user);
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const oobCode = query.get("oobCode");
  const mode = query.get("mode");

  // Debug state changes
  useEffect(() => {
    
  }, [
    authState,
    isVerificationSent,
    isVerified,
    showUpdateProfile,
    showForgotPassword,
    showResetPassword,
  ]);

  useEffect(() => {
    if (oobCode && mode === "verifyEmail") {
      setIsLoading(true);
      applyActionCode(auth, oobCode)
        .then(() => {
          setIsVerified(true);
          setIsVerificationSent(false); // Reset to show verified state
          setAuthState("signUp");
          setError("");
          setSuccessMessage("Verification is successful");
          clearInputs();
        })
        .catch((error) => {
          console.error("Verification error:", error);
          setError(getErrorMessage(error));
          setTimeout(() => {
            setAuthState("signIn");
            navigate("/");
          }, 3000);
        })
        .finally(() => setIsLoading(false));
    } else if (oobCode && mode === "resetPassword") {
      setShowResetPassword(true);
      setShowForgotPassword(false);
      setAuthState("signIn");
      setShowUpdateProfile(false);
      setError("");
      setSuccessMessage("");
      clearInputs();
      verifyPasswordResetCode(auth, oobCode).catch((error) => {
        console.error("Password reset error:", error);
        setError(getErrorMessage(error));
        setTimeout(() => {
          setShowResetPassword(false);
          setAuthState("signIn");
          navigate("/");
        }, 3000);
      });
    }
  }, [oobCode, mode, navigate, getErrorMessage]);

  const clearInputs = useCallback(() => {
    const inputs = [
      email,
      password,
      confirmPassword,
      fullName,
      newEmail,
      newPassword,
      resetEmail,
      resetPassword,
      resetConfirmPassword,
    ];
    inputs.forEach((input) => {
      if (input.current) input.current.value = "";
    });
  }, []);

  const toggleAuthState = () => {
    setAuthState(authState === "signIn" ? "signUp" : "signIn");
    setError("");
    setSuccessMessage("");
    setShowForgotPassword(false);
    setShowUpdateProfile(false);
    setShowResetPassword(false);
    setIsVerificationSent(false);
    setIsVerified(false);
    clearInputs();
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    const emailValue = resetEmail.current?.value;
    const { isValid, message } = validate(emailValue, "", "", false, true);

    if (!isValid) {
      setError(message);
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, emailValue, {
        url: "http://localhost:3000/",
      });
      setSuccessMessage("Check your email for the reset link.");
    } catch (error) {
      setError(getErrorMessage(error));
      console.error("Send reset email error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    const newPasswordValue = resetPassword.current?.value;
    const confirmPasswordValue = resetConfirmPassword.current?.value;

    const { isValid, message } = validate(
      "",
      newPasswordValue,
      confirmPasswordValue,
      false,
      true
    );
    if (!isValid) {
      setError(message);
      setIsLoading(false);
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPasswordValue);
      setSuccessMessage("Password reset successfully!");
      setTimeout(() => {
        setShowResetPassword(false);
        setAuthState("signIn");
        clearInputs();
        navigate("/");
      }, 2000);
    } catch (error) {
      setError(getErrorMessage(error));
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      await setPersistence(auth, browserSessionPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      dispatch(
        addUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
        })
      );
      navigate("/browse");
    } catch (error) {
      setError(getErrorMessage(error));
      console.error("Google sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    const emailValue = email.current?.value;
    const passwordValue = password.current?.value;
    const confirmPasswordValue =
      authState === "signUp" ? confirmPassword.current?.value : "";

    const { isValid, message } = validate(
      emailValue,
      passwordValue,
      confirmPasswordValue,
      authState === "signUp"
    );

    if (!isValid) {
      setError(message);
      setIsLoading(false);
      return;
    }

    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      if (authState === "signUp") {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          emailValue,
          passwordValue
        );
        const user = userCredential.user;

        await sendEmailVerification(user, {
          url: "http://localhost:3000/?mode=verifyEmail",
        });

        setIsVerificationSent(true);
        setSuccessMessage("Check your email for verification.");
        clearInputs();
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          emailValue,
          passwordValue
        );
        const user = userCredential.user;
        dispatch(
          addUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "",
          })
        );
        navigate("/browse");
      }
    } catch (error) {
      setError(getErrorMessage(error));
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    const newEmailValue = newEmail.current?.value;
    const newPasswordValue = newPassword.current?.value;

    try {
      if (newEmailValue) {
        await updateEmail(auth.currentUser, newEmailValue);
        dispatch(addUser({ ...user, email: newEmailValue }));
        setSuccessMessage("Email updated successfully.");
      }
      if (newPasswordValue) {
        await updatePassword(auth.currentUser, newPasswordValue);
        setSuccessMessage((prev) =>
          prev
            ? `${prev} Password also updated.`
            : "Password updated successfully."
        );
      }
      if (!newEmailValue && !newPasswordValue) {
        setError("Please provide a new email or password.");
      }
      clearInputs();
      setShowUpdateProfile(false);
      setAuthState("signIn");
    } catch (error) {
      setError(getErrorMessage(error));
      console.error("Update profile error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyButton = async () => {
    if (!isVerified) {
      setError("Please verify your email first.");
      return;
    }

    if (!auth.currentUser) {
      setAuthState("signIn");
      setSuccessMessage("");
      setError("Please sign in to continue.");
      return;
    }

    navigate("/browse");
  };

  const handleContinue = () => {
    if (auth.currentUser) {
      navigate("/browse");
    } else {
      setAuthState("signIn");
      setSuccessMessage("");
      setError("");
      navigate("/");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-900">
      <Header setShowUpdateProfile={setShowUpdateProfile} />
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${BG_IMG_URL})` }}
      />
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div
          key={authState}
          className="animate-fade-in bg-black/80 p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-md"
        >
          <h1 className="text-2xl sm:text-3xl text-white font-bold text-center mb-6">
            {authState === "signUp"
              ? isVerified
                ? "Verification"
                : isVerificationSent
                ? "Email Verification"
                : "Sign Up"
              : showUpdateProfile
              ? "Update Profile"
              : showForgotPassword
              ? "Forgot Password"
              : showResetPassword
              ? "Reset Password"
              : "Sign In"}
          </h1>
          {authState === "signUp" && isVerificationSent && !isVerified ? (
            <div className="animate-fade-in text-center text-white space-y-4">
              <p className="text-lg">Check your email for verification.</p>
              <p className="text-sm text-gray-400">
                Didn’t receive it? Check spam or{" "}
                <button
                  onClick={() =>
                    setSuccessMessage("Verification email resent.")
                  }
                  className="text-red-500 hover:underline"
                >
                  resend
                </button>
                .
              </p>
              <button
                onClick={handleVerifyButton}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition animate-fade-in"
                aria-label="Verify Email"
                disabled={isLoading}
              >
                Verify
              </button>
              {successMessage && (
                <p className="text-green-500">{successMessage}</p>
              )}
              {error && <p className="text-red-500">{error}</p>}
            </div>
          ) : authState === "signUp" && isVerified ? (
            <div className="animate-fade-in text-center text-white space-y-4">
              <p className="text-lg">{successMessage}</p>
              <button
                onClick={handleVerifyButton}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition animate-fade-in"
                aria-label="Verified - Go to Browse"
                disabled={isLoading}
              >
                Verified
              </button>
              <button
                onClick={handleContinue}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition animate-fade-in"
                aria-label="Continue to Sign In"
                disabled={isLoading}
              >
                Continue
              </button>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          ) : showResetPassword ? (
            <form
              onSubmit={handleResetPassword}
              className="animate-fade-in space-y-4"
            >
              <input
                ref={resetPassword}
                type="password"
                placeholder="New Password"
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                aria-label="New Password"
              />
              <input
                ref={resetConfirmPassword}
                type="password"
                placeholder="Confirm New Password"
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                aria-label="Confirm New Password"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
                  "Change Password"
                )}
              </button>
              {successMessage && (
                <p className="text-green-500 text-center">{successMessage}</p>
              )}
              {error && <p className="text-red-500 text-center">{error}</p>}
              <p className="text-center text-white mt-4">
                Remember password?{" "}
                <button
                  onClick={() => {
                    setShowResetPassword(false);
                    setAuthState("signIn");
                    setSuccessMessage("");
                    navigate("/");
                  }}
                  className="text-red-500 hover:underline"
                >
                  Sign In
                </button>
              </p>
            </form>
          ) : showForgotPassword ? (
            <form
              onSubmit={handleSendResetEmail}
              className="animate-fade-in space-y-4"
            >
              <input
                ref={resetEmail}
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                aria-label="Email for Password Reset"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
                  "Send Reset Link"
                )}
              </button>
              {successMessage && (
                <p className="text-green-500 text-center">{successMessage}</p>
              )}
              {error && <p className="text-red-500 text-center">{error}</p>}
              <p className="text-center text-white mt-4">
                Remember password?{" "}
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setAuthState("signIn");
                    setSuccessMessage("");
                  }}
                  className="text-red-500 hover:underline"
                >
                  Sign In
                </button>
              </p>
            </form>
          ) : showUpdateProfile ? (
            <form
              onSubmit={handleUpdateProfile}
              className="animate-fade-in space-y-4"
            >
              <input
                ref={newEmail}
                type="email"
                placeholder="New Email (optional)"
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="New Email"
              />
              <input
                ref={newPassword}
                type="password"
                placeholder="New Password (optional)"
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="New Password"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
                  "Update Profile"
                )}
              </button>
              {successMessage && (
                <p className="text-green-500 text-center">{successMessage}</p>
              )}
              {error && <p className="text-red-500 text-center">{error}</p>}
              <p className="text-center text-white mt-4">
                Changed mind?{" "}
                <button
                  onClick={() => {
                    setShowUpdateProfile(false);
                    setAuthState("signIn");
                    setSuccessMessage("");
                  }}
                  className="text-red-500 hover:underline"
                >
                  Back to Sign In
                </button>
              </p>
            </form>
          ) : (
            <form
              key="auth-form"
              onSubmit={handleSubmit}
              className="animate-fade-in space-y-4"
            >
              {authState === "signUp" && (
                <input
                  ref={fullName}
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  aria-label="Full Name"
                />
              )}
              <input
                ref={email}
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                aria-label="Email"
              />
              <input
                ref={password}
                type="password"
                placeholder={
                  authState === "signUp" ? "Create Password" : "Password"
                }
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                aria-label="Password"
              />
              {authState === "signUp" && (
                <input
                  ref={confirmPassword}
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  aria-label="Confirm Password"
                />
              )}
              {authState === "signIn" && (
                <div className="flex justify-between items-center text-sm">
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="mr-2 accent-red-500"
                      aria-label="Remember Me"
                    />
                    Remember Me
                  </label>
                  <button
                    onClick={() => {
                      setShowForgotPassword(true);
                      setAuthState("signIn");
                      setError("");
                      setSuccessMessage("");
                    }}
                    className="text-white hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : authState === "signUp" ? (
                  "Sign Up"
                ) : (
                  "Sign In"
                )}
              </button>
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-500" />
                <span className="px-3 text-white">or</span>
                <div className="flex-grow border-t border-gray-500" />
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white text-black py-2 rounded-md hover:bg-gray-100 transition flex items-center justify-center disabled:opacity-50"
              >
                <FcGoogle className="mr-2 text-lg" /> Continue with Google
              </button>
              {successMessage && (
                <p className="text-green-500 text-center">{successMessage}</p>
              )}
              {error && <p className="text-red-500 text-center">{error}</p>}
              <p className="text-center text-white mt-4 text-sm">
                {authState === "signUp"
                  ? "Already have an account?"
                  : "New to MovieLens?"}{" "}
                <button
                  onClick={toggleAuthState}
                  className="text-red-500 hover:underline"
                >
                  {authState === "signUp" ? "Sign In" : "Sign Up Now"}
                </button>
              </p>
              {user && authState === "signIn" && (
                <p
                  className="text-center text-red-500 mt-2 hover:underline cursor-pointer text-sm"
                  onClick={() => {
                    setShowUpdateProfile(true);
                    setError("");
                    setSuccessMessage("");
                  }}
                >
                  Update Profile
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
