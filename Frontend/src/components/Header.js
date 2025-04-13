import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaList, FaHome } from "react-icons/fa";
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
import { PROFILE_ICON } from "../utils/constants";
import { ReactSVG } from "react-svg";
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
        const { uid, email, emailVerified } = currentUser;
        dispatch(addUser({ uid, email }));
        if (emailVerified && window.location.pathname === "/") {
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
      fetchMovies();
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
      console.error("Update password error:", error);
      switch (error.code) {
        case "auth/wrong-password":
          setError("Incorrect old password.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Try again later.");
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
    <header className="fixed top-0 left-0 w-full bg-gradient-to-b from-black/95 to-black/80 px-4 sm:px-8 md:px-12 py-5 flex items-center justify-between z-50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
        <div className="flex-shrink-0 relative z-10">
          <ReactSVG
            src="/logo.svg"
            className="hidden md:block w-40 fill-red-600 cursor-pointer hover:scale-105 hover:shadow-[0_0_15px_rgba(239,68,68,0.6)] transition-all duration-300"
            onClick={() => user && navigate("/browse")}
            aria-label="MovieLens Logo"
          />
          <img
            src="/M.svg"
            alt="MovieLens Logo"
            className="block md:hidden w-12 h-12 cursor-pointer hover:scale-105 hover:shadow-[0_0_10px_rgba(239,68,68,0.6)] transition-all duration-300"
            onClick={() => user && navigate("/browse")}
          />
        </div>
        {user && (
          <div className="ml-5 flex items-center">
            <button
              onClick={handleToggle}
              className="flex items-center gap-2 text-white text-sm md:text-base px-4 py-2 rounded-full bg-transparent border border-red-600/50 hover:bg-red-600/30 hover:border-red-600 hover:shadow-[0_0_12px_rgba(239,68,68,0.4)] transition-all duration-300"
              aria-label={showMyList ? "Go to Home" : "Go to My List"}
            >
              {showMyList ? (
                <FaHome className="text-red-500" />
              ) : (
                <FaList className="text-red-500" />
              )}
              <span className="hidden sm:inline">
                {showMyList ? "Home" : "My List"}
              </span>
            </button>
          </div>
        )}
      </div>

      {user && (
        <div
          className="flex items-center gap-4 sm:gap-6 md:gap-8"
          ref={profileRef}
        >
          <div className="relative" ref={searchRef}>
            <div className="flex items-center bg-gray-900/40 backdrop-blur-sm border border-gray-700/30 rounded-full px-4 py-2.5 transition-all duration-300 hover:bg-gray-900/60 hover:border-red-500/50">
              <FaSearch className="text-gray-200" aria-hidden="true" />
              <input
                type="text"
                className="bg-transparent text-white pl-3 focus:outline-none w-28 sm:w-36 md:w-64 placeholder-gray-300 transition-all duration-500 focus:w-36 sm:focus:w-48 md:focus:w-80"
                placeholder="Search movies..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearching(true)}
                aria-label="Search movies"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="animate-fade-in absolute mt-3 w-72 sm:w-80 md:w-[28rem] max-h-[28rem] overflow-y-auto no-scrollbar bg-gray-900/90 backdrop-blur-md rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.7)] border border-gray-700/40">
                {searchResults.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-800/70 cursor-pointer transition-all duration-200"
                    onClick={() => handleMovieSelect(movie)}
                    role="button"
                    tabIndex={0}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-14 h-20 object-cover rounded-md shadow-sm"
                    />
                    <span className="text-white text-sm md:text-base font-medium">
                      {movie.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Bot
            onClick={handleBotClick}
            className={`w-8 h-8 text-white hover:text-red-500 hover:shadow-[0_0_12px_rgba(239,68,68,0.7)] cursor-pointer transition-all duration-300 hover:rotate-12 ${
              isSearching ? "hidden sm:block" : ""
            }`}
            aria-label="Open GPT Search"
          />
          <div className="relative">
            <img
              className={`w-11 h-11 rounded-full cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.6)] ${
                isSearching ? "hidden sm:block" : ""
              }`}
              src={PROFILE_ICON}
              alt="Profile"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              aria-label="Toggle profile menu"
            />
            {showProfileMenu && (
              <div className="animate-fade-in absolute top-16 right-0 w-72 bg-gray-900/90 backdrop-blur-md text-white p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.7)] border border-gray-700/40">
                <p className="text-xl font-bold tracking-tight">{username}</p>
                <p className="text-sm text-gray-200 truncate mt-1">
                  {user?.email}
                </p>
                <hr className="border-gray-700/50 my-4" />
                {!showUpdatePassword ? (
                  <>
                    <button
                      onClick={() => setShowUpdatePassword(true)}
                      className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-300 mb-3"
                      aria-label="Update Password"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-300"
                      aria-label="Sign Out"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <input
                      type="password"
                      placeholder="Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full p-3 bg-gray-800/60 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                      aria-label="Old Password"
                      required
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 bg-gray-800/60 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                      aria-label="New Password"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                      aria-label="Submit Password Update"
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
                        "Update"
                      )}
                    </button>
                    {successMessage && (
                      <p className="text-green-500 text-sm font-semibold">
                        {successMessage}
                      </p>
                    )}
                    {error && (
                      <p className="text-red-500 text-sm font-semibold">
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
                      className="w-full text-red-400 hover:text-red-300 hover:underline text-sm transition-all duration-200"
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
