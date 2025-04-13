import React from "react";

const MoviePosters = ({ movies, onSelect, categoryLabel }) => {
  // Remove duplicate movies based on their id and filter out movies without a poster image
  const uniqueMovies = movies
    ? Array.from(
        new Map(movies.map((movie) => [movie.id, movie])).values()
      ).filter((movie) => movie.poster_path)
    : [];

  // (Optional) Convert vertical wheel events into horizontal scrolling
  const handleWheel = (e) => {
    e.currentTarget.scrollLeft += e.deltaY;
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h2 className="text-white text-xl md:text-2xl font-bold">
        {categoryLabel}
      </h2>
      <div
        className="flex flex-nowrap overflow-x-auto overflow-y-hidden no-scrollbar p-2 m-3 gap-8"
        onWheel={handleWheel}
        style={{ touchAction: "pan-x" }} // Enables proper horizontal scrolling on touch devices
      >
        {uniqueMovies.map((movie) => (
          <img
            key={movie.id}
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={movie.title}
            className="cursor-pointer w-[100px] h-[150px] md:w-[120px] md:h-[180px] rounded-lg transition-transform transform hover:scale-110"
            onClick={() => onSelect(movie)}
          />
        ))}
      </div>
    </div>
  );
};

export default MoviePosters;
