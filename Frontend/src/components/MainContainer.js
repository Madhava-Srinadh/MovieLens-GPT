import React, { useState } from "react";
import { useSelector } from "react-redux";
import useGetVideo from "../hooks/useGetVideo";
import useSelectMovie from "../hooks/useSelectMovie";
import useFetchMovies from "../hooks/useFetchMovies";
import useMyListMoviesFetch from "../hooks/useMyListMoviesFetch";
import {
  addNowPlayingMovies,
  addPopularMovies,
  addTopRatedMovies,
} from "../utils/movieSlice";
import { Volume2, VolumeX, Info } from "lucide-react";
import VideoBackground from "./VideoBackground";
import MoviePosters from "./MoviePosters";
import MovieDetails from "./MovieDetails";

// Change this value to offset the video if you have a header (set to 0 if you want it flush at the top)
const headerOffset = 60; // example: header height 60px

const MainContainer = ({ showMyList }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch movies for standard categories:
  useFetchMovies("now_playing", addNowPlayingMovies);
  useFetchMovies("popular", addPopularMovies);
  useFetchMovies("top_rated", addTopRatedMovies);

  // My List fetch – useMyListMoviesFetch now returns a loading flag.
  const { loading: myListLoading } = useMyListMoviesFetch(
    showMyList ? 1 : null
  );

  const nowPlayingMovies = useSelector(
    (store) => store.movies?.nowPlayingMovies
  );
  const popularMovies = useSelector((store) => store.movies?.popularMovies);
  const topRatedMovies = useSelector((store) => store.movies?.topRatedMovies);
  const myListMovies = useSelector((store) => store.movies?.myListMovies);
  const { gptMovies, loading: gptLoading } = useSelector((store) => store.gpt);

  // Select a movie (or fallback to the first movie from now playing)
  const selectedMovie = useSelector(
    (store) =>
      store.select?.selectedMovie || (nowPlayingMovies && nowPlayingMovies[0])
  );

  const movieId = selectedMovie?.id;
  const movieName = selectedMovie?.title || selectedMovie?.name;
  useGetVideo(movieId, movieName);
  const videoData = useSelector((store) => store.select?.selectVideo);
  const selectMovie = useSelectMovie();

  const handleMoreInfoClick = () => {
    setShowDetails((prev) => !prev);
  };

  return (
    <div className="absolute w-[100vw] h-[100vh] overflow-hidden flex flex-col">
      {/* Background video container positioned starting from headerOffset */}
      <div
        className="absolute left-0 w-full h-[50vh] md:h-[100vh]"
        style={{ top: `${headerOffset}px` }}
      >
        <VideoBackground
          videoKey={videoData?.key}
          isMuted={isMuted}
          selectedMovie={selectedMovie}
        />
      </div>

      {/* Overlay for movie info and lists starting from 50vh + headerOffset */}
      <div
        className="absolute left-0 bg-black bg-opacity-50 z-10 flex flex-col p-4 md:p-6 w-full"
        style={{ top: `calc(50vh + ${headerOffset}px)` }}
      >
        <div className="flex items-center gap-6 text-white mb-4">
          <h1 className="text-xl md:text-3xl font-bold">
            {selectedMovie?.title || "No Title"}
          </h1>
          <div className="flex gap-3">
            <button
              className="bg-gray-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition z-20"
              onClick={handleMoreInfoClick}
            >
              <Info size={18} />
              <span className="hidden md:inline">More Info</span>
            </button>
            <button
              className="bg-gray-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition z-20"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>

        <div className="h-[40vh] overflow-y-auto no-scrollbar scrollbar-thumb-gray-600 scrollbar-track-transparent p-2">
          <>
            {/* --- GPT SEARCH MOVIES --- */}
            {!showMyList && (
              <>
                {gptLoading ? (
                  <MoviePosters
                    categoryLabel="Based on Recent Query"
                    category="gpt"
                    onSelect={selectMovie}
                    loading={true}
                  />
                ) : gptMovies !== null ? (
                  gptMovies.length > 0 ? (
                    <MoviePosters
                      categoryLabel="Based on Recent Query"
                      category="gpt"
                      onSelect={selectMovie}
                      loading={false}
                    />
                  ) : (
                    <p className="text-white text-center mt-10">
                      No movies found for your query.
                    </p>
                  )
                ) : null}
              </>
            )}

            {/* --- MY LIST MOVIES --- */}
            {showMyList ? (
              myListLoading ? (
                <MoviePosters
                  categoryLabel="My List"
                  category="my_list"
                  isMyList={true}
                  onSelect={selectMovie}
                  loading={true}
                />
              ) : myListMovies && myListMovies.length > 0 ? (
                <MoviePosters
                  categoryLabel="My List"
                  category="my_list"
                  isMyList={true}
                  onSelect={selectMovie}
                  loading={false}
                />
              ) : (
                <p className="text-white text-center mt-10">
                  No movies in your list yet.
                </p>
              )
            ) : (
              <>
                {/* --- STANDARD CATEGORIES --- */}
                {nowPlayingMovies && nowPlayingMovies.length > 0 ? (
                  <MoviePosters
                    categoryLabel="Now Playing"
                    category="now_playing"
                    onSelect={selectMovie}
                    loading={false}
                  />
                ) : (
                  <MoviePosters
                    categoryLabel="Now Playing"
                    category="now_playing"
                    onSelect={selectMovie}
                    loading={true}
                  />
                )}
                {popularMovies && popularMovies.length > 0 ? (
                  <MoviePosters
                    categoryLabel="Popular"
                    category="popular"
                    onSelect={selectMovie}
                    loading={false}
                  />
                ) : (
                  <MoviePosters
                    categoryLabel="Popular"
                    category="popular"
                    onSelect={selectMovie}
                    loading={true}
                  />
                )}
                {topRatedMovies && topRatedMovies.length > 0 ? (
                  <MoviePosters
                    categoryLabel="Top Rated"
                    category="top_rated"
                    onSelect={selectMovie}
                    loading={false}
                  />
                ) : (
                  <MoviePosters
                    categoryLabel="Top Rated"
                    category="top_rated"
                    onSelect={selectMovie}
                    loading={true}
                  />
                )}
              </>
            )}
          </>
        </div>
      </div>

      {showDetails && selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

export default MainContainer;
