import { useDispatch } from "react-redux";
import { searchMovie } from "../utils/searchSlice";
import { options } from "../utils/constants";

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
        `https://api.themoviedb.org/3/search/movie?query=${query}`,
        options
      );
      const data = await response.json();

      if (data.results?.length) {
        // Filter movies that start with the query and have a poster
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
      console.error("Error fetching movies:", error);
      setSearchResults([]);
      dispatch(searchMovie(null));
    }
  };

  return { fetchMovies };
};

export default useSearchMovie;
