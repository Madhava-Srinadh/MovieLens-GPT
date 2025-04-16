import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import validator from "validator";
import { addToMyList, removeFromMyList } from "../utils/movieSlice";
import { options } from "../utils/constants";
import useMyListMoviesFetch from "../hooks/useMyListMoviesFetch";

const MovieDetails = ({ movie, onClose }) => {
  // References and hooks setup
  const detailsRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const myListMovies = useSelector((store) => store.movies.myListMovies);
  // Kick off the fetch for My List movies (if needed)
  useMyListMoviesFetch();

  // Component state
  const [isLoading, setIsLoading] = useState(false); // for add/remove list actions
  const [loading, setLoading] = useState(true); // for extended details fetch
  const [extendedDetails, setExtendedDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [credits, setCredits] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [providers, setProviders] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(null);

  const movieId = movie?.id;

  // --- HANDLE CLICK OUTSIDE TO CLOSE MODAL ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // --- FETCH EXTENDED MOVIE DATA ---
  useEffect(() => {
    if (!movieId) return;

    const fetchExtendedData = async () => {
      setLoading(true);
      try {
        // Build URLs for all endpoints
        const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
        const imagesUrl = `https://api.themoviedb.org/3/movie/${movieId}/images`;
        const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`;
        const reviewsUrl = `https://api.themoviedb.org/3/movie/${movieId}/reviews?language=en-US&page=1`;
        const providersUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`;

        // Request all data concurrently
        const responses = await Promise.all([
          fetch(detailsUrl, options),
          fetch(imagesUrl, options),
          fetch(creditsUrl, options),
          fetch(reviewsUrl, options),
          fetch(providersUrl, options),
        ]);

        // Convert all responses to JSON
        const [
          detailsData,
          imagesData,
          creditsData,
          reviewsData,
          providersData,
        ] = await Promise.all(responses.map((res) => res.json()));

        // Set the fetched data into state
        setExtendedDetails(detailsData);
        setImages(imagesData.backdrops || []);
        setCredits(creditsData);
        setReviews(reviewsData.results || []);
        setProviders(providersData.results || {});
      } catch (err) {
        console.error("Error fetching extended details:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExtendedData();
  }, [movieId]);

  // --- CHECK WHETHER THE MOVIE IS IN THE USER'S LIST ---
  const isMovieInList = useCallback(() => {
    return (
      Array.isArray(myListMovies) &&
      myListMovies.some((m) => m.id === movie?.id)
    );
  }, [myListMovies, movie]);

  // --- HANDLERS FOR ADDING/REMOVING MOVIE FROM THE LIST ---
  const handleAddToList = async () => {
    if (
      !user ||
      !user.email ||
      !validator.isEmail(user.email) ||
      !movie?.id ||
      !movie?.title
    )
      return;

    setIsLoading(true);
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
      dispatch(addToMyList(movieData));
    } catch (error) {
      // You may want to handle errors properly
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromList = async () => {
    if (!user || !user.email || !validator.isEmail(user.email) || !movie?.id)
      return;

    setIsLoading(true);
    try {
      await axios.delete(
        `https://movielens-gpt.onrender.com/api/mylist/${encodeURIComponent(
          user.email
        )}/${movie.id}`
      );
      dispatch(removeFromMyList(movie.id));
    } catch (error) {
      // Silently fail or log error
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER WATCH PROVIDERS (LIMIT 4 UNIQUE PROVIDERS) ---
  const renderProviders = useMemo(() => {
    if (!providers || Object.keys(providers).length === 0) return null;

    const firstRegion = Object.keys(providers)[0];
    const regionData = providers[firstRegion];

    if (!regionData?.flatrate && !regionData?.rent && !regionData?.buy)
      return null;

    // Filter for unique providers across all categories
    const seen = new Set();
    const uniqueProviders = [
      ...(regionData.flatrate || []),
      ...(regionData.rent || []),
      ...(regionData.buy || []),
    ]
      .filter((provider) => {
        if (seen.has(provider.provider_id)) return false;
        seen.add(provider.provider_id);
        return true;
      })
      .slice(0, 4); // Limit to 4 providers

    if (uniqueProviders.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-white mb-2">{firstRegion}</h4>
        <div className="flex space-x-4 overflow-x-hidden">
          {uniqueProviders.map((provider) => (
            <div
              key={provider.provider_id}
              className="flex flex-col items-center flex-shrink-0"
            >
              <img
                src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                alt={provider.provider_name}
                className="w-12 h-12 object-contain rounded-lg"
              />
              <span className="text-xs mt-2 text-gray-300">
                {provider.provider_name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }, [providers]);

  // --- LOADING AND ERROR STATES FOR EXTENDED DATA ---
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <div className="bg-black bg-opacity-80 text-white p-6 rounded-lg flex items-center">
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
          Loading movie details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <div className="bg-black bg-opacity-80 text-white p-6 rounded-lg">
          Error loading movie details. Please try again.
        </div>
      </div>
    );
  }

  // --- MAIN MOVIE DETAILS CONTENT ---
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      {/* Global styles for hiding scrollbars */}
      <style>
        {`
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div
        ref={detailsRef}
        className="relative w-full max-w-2xl bg-black bg-opacity-80 p-6 rounded-xl text-white shadow-2xl backdrop-blur-lg overflow-y-auto max-h-[90vh] no-scrollbar"
      >
        {/* --- Basic Movie Details --- */}
        <div className="flex flex-col gap-4">
          {extendedDetails?.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${extendedDetails.poster_path}`}
              alt={extendedDetails.title}
              className="w-48 mx-auto rounded-lg object-cover shadow-lg"
            />
          )}
          <div>
            <h2 className="text-3xl font-bold mb-2 text-center">
              {extendedDetails?.title || movie?.title || "Movie Title"}
            </h2>
            {extendedDetails?.overview && (
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                {extendedDetails.overview}
              </p>
            )}
            <div className="text-sm text-gray-300 mb-4">
              <p>
                <strong>Release Date:</strong>{" "}
                {extendedDetails?.release_date || "N/A"}
              </p>
              <p>
                <strong>Rating:</strong>{" "}
                {extendedDetails?.vote_average?.toFixed(1) || "N/A"} (
                {extendedDetails?.vote_count || 0} votes)
              </p>
              <p>
                <strong>Genres:</strong>{" "}
                {extendedDetails?.genres?.map((g) => g.name).join(", ") ||
                  "N/A"}
              </p>
              <p>
                <strong>Runtime:</strong>{" "}
                {extendedDetails?.runtime
                  ? `${Math.floor(extendedDetails.runtime / 60)}h ${
                      extendedDetails.runtime % 60
                    }m`
                  : "N/A"}
              </p>
            </div>
            {/* --- Add / Remove from My List Button --- */}
            <button
              className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-transform transform flex items-center justify-center mb-2 ${
                isMovieInList()
                  ? "bg-red-600 hover:bg-red-700 hover:scale-105"
                  : "bg-green-600 hover:bg-green-700 hover:scale-105"
              } ${
                !user?.email || !validator.isEmail(user.email) || isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={isMovieInList() ? handleRemoveFromList : handleAddToList}
              disabled={
                !user?.email || !validator.isEmail(user.email) || isLoading
              }
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
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
                </div>
              ) : isMovieInList() ? (
                "Remove from My List"
              ) : (
                "Add to My List"
              )}
            </button>
            {/* --- Toggle for Additional Details --- */}
            {!showMore && (
              <button
                onClick={() => setShowMore(true)}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition-transform transform hover:scale-105"
              >
                Show More Details
              </button>
            )}
          </div>
        </div>

        {/* --- Additional Information Section --- */}
        {showMore && (
          <div className="mt-6 space-y-6">
            {/* --- Images Carousel --- */}
            {images.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Images</h3>
                <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                      alt={`Slide ${idx + 1}`}
                      className="w-32 h-20 object-cover rounded-lg flex-shrink-0 shadow-md"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* --- Cast Section --- */}
            {credits?.cast && (
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Cast</h3>
                <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
                  {credits.cast.map((member) => (
                    <div
                      key={member.id}
                      className="flex flex-col items-center text-center flex-shrink-0 w-20"
                    >
                      {member.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                          alt={member.name}
                          className="w-16 h-16 rounded-full object-cover shadow-md"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-300">
                          No Image
                        </div>
                      )}
                      <p className="text-xs mt-1 text-gray-300 truncate w-full">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate w-full">
                        {member.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- Watch Providers Section --- */}
            {renderProviders && (
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Watch Providers
                </h3>
                {renderProviders}
              </div>
            )}

            {/* --- Reviews Section --- */}
            {reviews.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Reviews</h3>
                <div className="space-y-2">
                  {reviews.slice(0, 2).map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-800 bg-opacity-80 p-3 rounded-lg shadow-md"
                    >
                      <p className="font-semibold text-white">
                        {review.author}
                      </p>
                      <p className="text-xs text-gray-300 mt-1">
                        {review.content.length > 150
                          ? `${review.content.substring(0, 150)}...`
                          : review.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
