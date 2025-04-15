import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaList, FaHome, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  signOut,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";
import useSearchMovie from "../hooks/useSearchMovie";
import { setSelectedMovie } from "../utils/selectSlice";
import { toggleShow } from "../utils/gptSlice";
import { Bot } from "lucide-react";
import GptSearchPopup from "./GptSearchPopup";

const Header = ({ setShowMyList, showMyList }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showGptPopup, setShowGptPopup] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const { fetchMovies } = useSearchMovie(searchValue, setSearchResults);
  const username = user?.email?.split("@")[0] || "Guest";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(addUser({ uid: currentUser.uid, email: currentUser.email }));
        if (currentUser.emailVerified && window.location.pathname === "/") {
          navigate("/browse");
        }
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchValue) fetchMovies();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchValue, fetchMovies]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        setIsSearching(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
        setShowUpdatePassword(false);
        setError("");
        setSuccessMessage("");
        setOldPassword("");
        setNewPassword("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(removeUser());
        navigate("/");
      })
      .catch((error) => console.error("Sign out error:", error));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    if (!oldPassword || !newPassword) {
      setError("Please enter both old and new passwords.");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setSuccessMessage("Password updated successfully!");
      setTimeout(() => {
        setShowUpdatePassword(false);
        setShowProfileMenu(false);
        setOldPassword("");
        setNewPassword("");
      }, 2000);
    } catch (error) {
      console.error("Update password error:", error.code, error.message);
      switch (error.code) {
        case "auth/wrong-password":
          setError("Incorrect old password.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Try again later.");
          break;
        case "auth/requires-recent-login":
          setError("Please sign in again to update your password.");
          break;
        default:
          setError("Failed to update password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieSelect = (movie) => {
    dispatch(setSelectedMovie(movie));
    setSearchValue("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleToggle = () => {
    setShowMyList(!showMyList);
  };

  const handleBotClick = () => {
    setShowGptPopup(true);
    dispatch(toggleShow());
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-black bg-opacity-70 px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between z-50 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logo.svg"
            alt="MovieLens Logo"
            className="hidden md:block w-48 cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={() => user && navigate("/browse")}
          />
          <img
            src="/M.svg"
            alt="MovieLens Logo"
            className="block md:hidden w-16 h-16 cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={() => user && navigate("/browse")}
          />
        </div>

        {user && (
          <button
            onClick={handleToggle}
            className="flex items-center gap-2 text-white text-sm sm:text-base px-3 py-2 rounded-lg bg-gray-800 border border-gray-600"
            aria-label={showMyList ? "Go to Home" : "Go to My List"}
          >
            {showMyList ? (
              <FaHome className="text-red-500 text-lg" />
            ) : (
              <FaList className="text-red-500 text-lg" />
            )}
            <span className="hidden sm:inline">
              {showMyList ? "Home" : "My List"}
            </span>
          </button>
        )}
      </div>

      {user && (
        <div
          className="flex items-center gap-3 sm:gap-4 md:gap-5"
          ref={profileRef}
        >
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <div
              className={`flex items-center bg-gray-900/50 backdrop-blur-md border border-gray-600 rounded-full px-3 py-2 h-10 transition-all duration-300 ${
                isSearching ? "w-40 sm:w-52 md:w-80" : "w-10 sm:w-48"
              }`}
            >
              <FaSearch
                className="text-gray-300 cursor-pointer"
                onClick={() => setIsSearching(!isSearching)}
                aria-label="Toggle search"
              />
              <input
                type="text"
                className={`bg-transparent text-white pl-3 focus:outline-none placeholder-gray-400 text-sm sm:text-base ${
                  isSearching ? "block" : "hidden sm:block"
                }`}
                placeholder="Search movies..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearching(true)}
                aria-label="Search movies"
              />
              {searchValue && (
                <FaTimes
                  className="text-gray-400 cursor-pointer"
                  onClick={() => {
                    setSearchValue("");
                    setSearchResults([]);
                  }}
                  aria-label="Clear search"
                />
              )}
            </div>
            {searchResults.length > 0 && (
              <div className="absolute mt-2 w-60 sm:w-72 md:w-80 max-h-96 overflow-y-auto no-scrollbar bg-gray-900/90 backdrop-blur-md rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.6)] border border-gray-700/50 animate-fade-in">
                {searchResults.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-800/70 cursor-pointer transition-all duration-200 focus:bg-gray-800/70 outline-none"
                    onClick={() => handleMovieSelect(movie)}
                    role="option"
                    tabIndex={0}
                    aria-selected="false"
                    aria-label={`Select ${movie.title}`}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded-md"
                    />
                    <span className="text-white text-sm font-medium">
                      {movie.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bot Icon */}
          <Bot
            onClick={handleBotClick}
            className="w-6 h-6 text-white cursor-pointer"
            aria-label="Open AI Search"
            title="AI Movie Finder"
          />

          {/* Profile */}
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full cursor-pointer bg-blue-600 flex items-center justify-center text-white text-lg font-semibold hover:scale-105 transition-all duration-200"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              aria-label="Toggle profile menu"
              tabIndex={0}
            >
              {username[0]?.toUpperCase()}
            </div>
            {showProfileMenu && (
              <div className="absolute top-12 right-0 w-64 bg-gray-900/90 backdrop-blur-md text-white p-4 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.6)] border border-gray-700/50 animate-fade-in">
                <p className="text-base font-semibold">{username}</p>
                <p className="text-xs text-gray-300 truncate mt-1">
                  {user?.email}
                </p>
                <hr className="border-gray-700/50 my-3" />
                {!showUpdatePassword ? (
                  <>
                    <button
                      onClick={() => setShowUpdatePassword(true)}
                      className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all duration-200"
                      aria-label="Update Password"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all duration-200 mt-2"
                      aria-label="Sign Out"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <form onSubmit={handleUpdatePassword} className="space-y-3">
                    <input
                      type="password"
                      placeholder="Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full p-2 bg-gray-800/70 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm"
                      aria-label="Old Password"
                      required
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 bg-gray-800/70 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm"
                      aria-label="New Password"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                      aria-label="Submit Password Update"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 mr-2 text-white"
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
                          Updating...
                        </>
                      ) : (
                        "Update"
                      )}
                    </button>
                    {successMessage && (
                      <p className="text-green-400 text-xs font-medium">
                        {successMessage}
                      </p>
                    )}
                    {error && (
                      <p className="text-red-400 text-xs font-medium">
                        {error}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setShowUpdatePassword(false);
                        setOldPassword("");
                        setNewPassword("");
                        setError("");
                        setSuccessMessage("");
                      }}
                      className="w-full text-gray-400 hover:text-gray-300 text-xs transition-all duration-200"
                      aria-label="Cancel Password Update"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showGptPopup && (
        <GptSearchPopup onClose={() => setShowGptPopup(false)} />
      )}
    </header>
  );
};

export default Header;
