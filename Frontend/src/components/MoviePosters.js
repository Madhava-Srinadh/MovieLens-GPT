import React, { useState, useEffect } from "react";
import { ArrowRightCircle } from "lucide-react";
import { useSelector } from "react-redux";
import useFetchMovies from "../hooks/useFetchMovies";
import useMyListMoviesFetch from "../hooks/useMyListMoviesFetch";
import {
  addNowPlayingMovies,
  addPopularMovies,
  addTopRatedMovies,
} from "../utils/movieSlice";

const MoviePosters = ({
  onSelect,
  categoryLabel,
  category,
  isMyList,
  loading,
}) => {
  const [localPage, setLocalPage] = useState(1);

  const movies = useSelector((store) => {
    if (isMyList) return store.movies.myListMovies;
    if (category === "gpt") return store.gpt.gptMovies;
    switch (category) {
      case "now_playing":
        return store.movies.nowPlayingMovies;
      case "popular":
        return store.movies.popularMovies;
      case "top_rated":
        return store.movies.topRatedMovies;
      default:
        return [];
    }
  });

  const actionCreators = {
    now_playing: addNowPlayingMovies,
    popular: addPopularMovies,
    top_rated: addTopRatedMovies,
  };

  const { totalPages: stdTotal } = useFetchMovies(
    category && actionCreators[category] ? category : null,
    actionCreators[category],
    localPage
  );

  const { totalPages: myTotal } = useMyListMoviesFetch(
    isMyList ? localPage : null
  );

  const effectiveTotal = isMyList ? myTotal : stdTotal;

  useEffect(() => {
    setLocalPage(1);
  }, [category, isMyList]);

  const display = Array.from(
    new Map(movies?.map((m) => [m.id, m])).values()
  ).filter((m) => m?.poster_path);

  const handleWheel = (e) => {
    e.currentTarget.scrollLeft += e.deltaY;
    e.preventDefault();
  };

  const handleNextPage = () => {
    if (localPage < effectiveTotal) {
      setLocalPage((p) => p + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-4 relative">
      <h2 className="text-white text-xl md:text-2xl font-bold">
        {categoryLabel}
      </h2>
      <div className="relative flex items-center">
        <div
          className="flex flex-nowrap overflow-x-auto overflow-y-hidden no-scrollbar p-2 m-3 gap-8"
          onWheel={handleWheel}
          style={{ touchAction: "pan-x" }}
        >
          {loading ? (
            // Render 5 skeleton cards for poster loading state
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="w-[100px] h-[150px] md:w-[120px] md:h-[180px] bg-gray-700 rounded-lg animate-pulse"
              />
            ))
          ) : display.length > 0 ? (
            display.map((movie) => (
              <img
                key={movie.id}
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title || "Movie Poster"}
                className="cursor-pointer w-[100px] h-[150px] md:w-[120px] md:h-[180px] rounded-lg hover:scale-110 transition-transform"
                onClick={() => onSelect(movie)}
              />
            ))
          ) : (
            <p className="text-white">No movies available</p>
          )}
          {localPage < effectiveTotal && !loading && (
            <button
              className="flex items-center justify-center w-[100px] h-[150px]"
              onClick={handleNextPage}
              aria-label="Next page"
            >
              <ArrowRightCircle
                size={32}
                className="text-white hover:scale-110 transition-transform"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviePosters;
