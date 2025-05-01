// src/hooks/useSearchMovie.js
import { useDispatch } from "react-redux";
import { searchMovie } from "../utils/searchSlice";
import { TMDB_BASE_URL, options } from "../utils/constants"; // Updated import

const useSearchMovie = (query, setSearchResults) => {
  const dispatch = useDispatch();

  const fetchMovies = async () => {
    if (!query) {
      setSearchResults([]);
      dispatch(searchMovie(null));
      return;
    }

    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?query=${query}`,
        options
      );
      const data = await response.json();

      if (data.results?.length) {
        const filteredResults = data.results.filter(
          (movie) =>
            movie.title?.toLowerCase().startsWith(query.toLowerCase()) &&
            movie.poster_path
        );
        setSearchResults(filteredResults);
        dispatch(searchMovie(filteredResults));
      } else {
        setSearchResults([]);
        dispatch(searchMovie(null));
      }
    } catch (error) {
      setSearchResults([]);
      dispatch(searchMovie(null));
    }
  };

  return { fetchMovies };
};

export default useSearchMovie;
