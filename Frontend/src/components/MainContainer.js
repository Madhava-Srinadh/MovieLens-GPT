import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useGetVideo from "../hooks/useGetVideo";
import useSelectMovie from "../hooks/useSelectMovie";
import useFetchMovies from "../hooks/useFetchMovies";
import useMyListMoviesFetch from "../hooks/useMyListMoviesFetch";
import useFetchFilteredMovies from "../hooks/useFetchFilteredMovies";
import {
  addNowPlayingMovies,
  addPopularMovies,
  addTopRatedMovies,
  clearFilteredMovies,
  restoreFilteredMovies,
} from "../utils/movieSlice";
import { clearFilters, restoreFilters } from "../utils/filterSlice";
import { clearGptMovies, restoreGptMovies } from "../utils/gptSlice";
import { Volume2, VolumeX, Info, MessageCircle } from "lucide-react";
import VideoBackground from "./VideoBackground";
import MoviePosters from "./MoviePosters";
import MovieDetails from "./MovieDetails";

const headerOffset = 60;

const MainContainer = ({ showMyList }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showChatbot, setShowChatbot] = useState(false);
  const dispatch = useDispatch();

  const filters = useSelector((state) => state.filters);
  const filteredMovies = useSelector((state) => state.movies.filteredMovies);
  const filteredTotalPages = useSelector(
    (state) => state.movies.filteredTotalPages
  );
  const { loading: filteredLoading, error } = useFetchFilteredMovies(
    filters,
    currentPage
  );
  const { gptMovies, loading: gptLoading } = useSelector((s) => s.gpt);

  useEffect(() => {
    setShowDetails(false);
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    if (showMyList) {
      dispatch(clearGptMovies());
      dispatch(clearFilteredMovies());
      dispatch(clearFilters());
    } else {
      dispatch(restoreGptMovies());
      dispatch(restoreFilteredMovies());
      dispatch(restoreFilters());
    }
  }, [showMyList, dispatch]);

  useFetchMovies("now_playing", addNowPlayingMovies);
  useFetchMovies("popular", addPopularMovies);
  useFetchMovies("top_rated", addTopRatedMovies);

  const { loading: myListLoading } = useMyListMoviesFetch(
    showMyList ? 1 : null
  );

  const nowPlaying = useSelector((s) => s.movies.nowPlayingMovies);
  const popular = useSelector((s) => s.movies.popularMovies);
  const topRated = useSelector((s) => s.movies.topRatedMovies);
  const myList = useSelector((s) => s.movies.myListMovies);

  const selectedMovie = useSelector(
    (s) => s.select.selectedMovie || nowPlaying?.[0]
  );

  const handleMoreInfoClick = () => {
    if (selectedMovie) setShowDetails((p) => !p);
  };

  useGetVideo(selectedMovie?.id, selectedMovie?.title || selectedMovie?.name);
  const videoData = useSelector((s) => s.select.selectVideo);
  const selectMovie = useSelectMovie();

  const isFiltered =
    filters &&
    (filters.with_genres ||
      filters.with_original_language ||
      filters.with_origin_country);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= filteredTotalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="absolute w-[100vw] h-[100vh] overflow-hidden flex flex-col">
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
              onClick={handleMoreInfoClick}
              className="bg-gray-700 text-white px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-gray-600"
            >
              <Info size={18} />
              <span className="hidden md:inline">More Info</span>
            </button>
            <button
              onClick={() => setIsMuted((m) => !m)}
              className="bg-gray-700 text-white px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-gray-600"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>

        <div className="h-[40vh] overflow-y-auto no-scrollbar p-2">
          {showMyList ? (
            <>
              {gptMovies && (
                <p className="text-white text-center mb-4">
                  Go to home page for GPT queried movies
                </p>
              )}
              {isFiltered && (
                <p className="text-white text-center mb-4">
                  Go to home page and try applying filters again, since it's
                  only dedicated to My List movies
                </p>
              )}
              {gptMovies && isFiltered && (
                <p className="text-white text-center mb-4">
                  This page is dedicated to your GPT query results. Go to Home
                  to apply filters.
                </p>
              )}
              {myListLoading ? (
                <MoviePosters
                  categoryLabel="My List"
                  category="my_list"
                  isMyList
                  onSelect={selectMovie}
                  loading={true}
                />
              ) : myList?.length > 0 ? (
                <MoviePosters
                  categoryLabel="My List"
                  category="my_list"
                  isMyList
                  onSelect={selectMovie}
                  loading={false}
                  movies={myList}
                />
              ) : (
                <p className="text-white text-center mt-10">
                  No movies in your list yet.
                </p>
              )}
            </>
          ) : (
            <>
              {isFiltered && (
                <button
                  onClick={() => {
                    dispatch(clearFilters());
                    dispatch(clearFilteredMovies());
                  }}
                  className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 mb-4"
                >
                  Clear Filters
                </button>
              )}
              {gptMovies && (
                <button
                  onClick={() => dispatch(clearGptMovies())}
                  className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 mb-4 ml-2"
                >
                  Clear Recent Query
                </button>
              )}
              {gptMovies ? (
                <>
                  {gptLoading ? (
                    <MoviePosters
                      categoryLabel="Based on Recent Query"
                      category="gpt"
                      onSelect={selectMovie}
                      loading={true}
                    />
                  ) : (
                    <MoviePosters
                      categoryLabel="Based on Recent Query"
                      category="gpt"
                      onSelect={selectMovie}
                      loading={false}
                      movies={gptMovies}
                    />
                  )}
                </>
              ) : isFiltered ? (
                filteredLoading ? (
                  <MoviePosters
                    categoryLabel="Filtered Results"
                    category="filtered"
                    onSelect={selectMovie}
                    loading={true}
                    page={currentPage}
                    onPageChange={handlePageChange}
                  />
                ) : error ? (
                  <p className="text-white text-center mt-10">{error}</p>
                ) : filteredMovies.length > 0 ? (
                  <>
                    <MoviePosters
                      categoryLabel="Filtered Results"
                      category="filtered"
                      onSelect={selectMovie}
                      loading={false}
                      page={currentPage}
                      onPageChange={handlePageChange}
                      totalPages={filteredTotalPages}
                    />
                    {filteredTotalPages > 1 && (
                      <div className="flex justify-center gap-4 mt-4">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-600"
                        >
                          Previous
                        </button>
                        <span className="text-white self-center">
                          Page {currentPage} of {filteredTotalPages}
                        </span>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === filteredTotalPages}
                          className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-600"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-white text-center mt-10">
                    No movies match your filters. Try different filters.
                  </p>
                )
              ) : (
                <>
                  <MoviePosters
                    categoryLabel="Now Playing"
                    category="now_playing"
                    onSelect={selectMovie}
                    loading={!nowPlaying?.length}
                    movies={nowPlaying}
                  />
                  <MoviePosters
                    categoryLabel="Popular"
                    category="popular"
                    onSelect={selectMovie}
                    loading={!popular?.length}
                    movies={popular}
                  />
                  <MoviePosters
                    categoryLabel="Top Rated"
                    category="top_rated"
                    onSelect={selectMovie}
                    loading={!topRated?.length}
                    movies={topRated}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>

      {showDetails && selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setShowDetails(false)}
        />
      )}

      {/* Support Icon */}
      <button
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 z-20"
        title="Support Chat"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chatbot Section */}
      {showChatbot && (
        <div className="fixed bottom-16 right-4 w-96 h-[70vh] bg-gray-900 bg-opacity-95 rounded-lg shadow-xl z-20 flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">
              MovieLens GPT Support
            </h3>
            <button
              onClick={() => setShowChatbot(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <iframe
            src="http://localhost:8501/" // Replace with your Streamlit app URL after deployment
            className="flex-1 w-full h-full rounded-b-lg"
            title="MovieLens GPT Chatbot"
            allow="clipboard-write"
          />
        </div>
      )}
    </div>
  );
};

export default MainContainer;