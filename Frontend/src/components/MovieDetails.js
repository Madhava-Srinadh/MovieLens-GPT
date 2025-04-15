import React, { useRef, useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import useMyListMovies from "../hooks/useMyListMovies";
import axios from "axios";
import validator from "validator";

const MovieDetails = ({ movie, onClose }) => {
  const detailsRef = useRef(null);
  const user = useSelector((store) => store.user);
  const { myListMovies, fetchMyList, loading } = useMyListMovies(false);
  const [isLoading, setIsLoading] = useState(false); // New loading state for button

  const safeFetchMyList = useCallback(() => {
    if (user?.email && validator.isEmail(user.email)) {
      fetchMyList();
    }
  }, [user?.email, fetchMyList]);

  useEffect(() => {
    safeFetchMyList();
    const handleClickOutside = (event) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, safeFetchMyList]);

  const isMovieInList = () => {
    return myListMovies.some((m) => m.id === movie?.id);
  };

  const handleAddToList = async () => {
    if (
      !user ||
      !user.email ||
      !validator.isEmail(user.email) ||
      !movie?.id ||
      !movie?.title
    ) {
      return;
    }
    setIsLoading(true); // Start loading
    try {
      const movieData = {
        id: Number(movie.id),
        title: String(movie.title),
        poster_path: movie.poster_path || "",
        overview: movie.overview || "",
        release_date: movie.release_date || "",
      };
      await axios.post("https://movielens-gpt.onrender.com/api/mylist", {
        email: user.email,
        movie: movieData,
      });
      await safeFetchMyList();
    } catch (error) {
      // Silently fail as per request
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleRemoveFromList = async () => {
    if (!user || !user.email || !validator.isEmail(user.email) || !movie?.id) {
      return;
    }
    setIsLoading(true); // Start loading
    try {
      await axios.delete(
        `https://movielens-gpt.onrender.com/api/mylist/${encodeURIComponent(
          user.email
        )}/${movie.id}`
      );
      await safeFetchMyList();
    } catch (error) {
      // Silently fail
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div
        ref={detailsRef}
        className="relative w-full max-w-lg bg-black bg-opacity-80 p-6 rounded-lg text-white shadow-xl backdrop-blur-lg border border-gray-600"
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${movie?.poster_path || ""}`}
          alt={movie?.title || "Movie"}
          className="w-[50%] mx-auto object-cover rounded-lg"
        />
        <h2 className="text-2xl font-bold mt-4">
          {movie?.title || "Unknown Title"}
        </h2>
        <p className="text-sm mt-2">
          {movie?.overview || "No description available"}
        </p>
        <p className="text-sm mt-2">
          ⭐ {movie?.vote_average?.toFixed(1) || "N/A"} | 📅{" "}
          {movie?.release_date || "N/A"}
        </p>
        <button
          className={`mt-4 w-full py-2 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform ${
            isMovieInList()
              ? "bg-red-600 hover:bg-red-700 hover:scale-105"
              : "bg-green-600 hover:bg-green-700 hover:scale-105"
          } ${
            !user?.email ||
            !validator.isEmail(user?.email) ||
            loading ||
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : ""
          } flex items-center justify-center`}
          onClick={isMovieInList() ? handleRemoveFromList : handleAddToList}
          disabled={
            !user?.email ||
            !validator.isEmail(user?.email) ||
            loading ||
            isLoading
          }
        >
          {isLoading ? (
            <>
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
              Loading...
            </>
          ) : isMovieInList() ? (
            "Remove from My List"
          ) : (
            "Add to My List"
          )}
        </button>
      </div>
    </div>
  );
};

export default MovieDetails;
