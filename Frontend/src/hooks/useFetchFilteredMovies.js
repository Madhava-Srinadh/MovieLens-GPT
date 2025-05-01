import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  appendFilteredMovies,
  setFilteredTotalPages,
  clearFilteredMovies,
} from "../utils/movieSlice";
import { TMDB_BASE_URL, options } from "../utils/constants";

const useFetchFilteredMovies = (filters, page = 1) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const filteredMovies = useSelector((state) => state.movies.filteredMovies);
  const prevFiltersRef = useRef(filters);
  const loadedPagesRef = useRef(new Set());

  const filteredLength = filteredMovies.length;

  useEffect(() => {
    const isFiltersEmpty =
      !filters ||
      (!filters.with_genres &&
        !filters.with_original_language &&
        !filters.with_origin_country);

    const filtersChanged =
      JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);

    

    if (filtersChanged) {
      dispatch(clearFilteredMovies());
      loadedPagesRef.current.clear();
      prevFiltersRef.current = filters;
    }

    if (
      !filtersChanged &&
      filteredLength > 0 &&
      loadedPagesRef.current.has(page)
    ) {
      
      setLoading(false);
      return;
    }

    if (isFiltersEmpty && filteredLength === 0) {
      dispatch(clearFilteredMovies());
      loadedPagesRef.current.clear();
      setLoading(false);
      setError(null);
      return;
    }

    if (!filtersChanged && loadedPagesRef.current.has(page)) {
      setLoading(false);
      return;
    }

    const fetchFiltered = async () => {
      setLoading(true);
      setError(null);
      try {
        const discoverParams = {
          include_adult: false,
          include_video: false,
          page,
          sort_by: "popularity.desc",
          with_genres: filters.with_genres || undefined,
          with_origin_country: filters.with_origin_country || undefined,
          with_original_language: filters.with_original_language || undefined,
        };

        const discoverResponse = await axios.get(
          `${TMDB_BASE_URL}/discover/movie`,
          {
            ...options,
            params: discoverParams,
          }
        );


        dispatch(appendFilteredMovies(discoverResponse.data.results || []));
        dispatch(setFilteredTotalPages(discoverResponse.data.total_pages || 1));
        loadedPagesRef.current.add(page);
      } catch (err) {
        setError(
          err.response?.status === 401
            ? "Invalid Bearer token. Check REACT_APP_BEARER_TOKEN."
            : "Failed to fetch movies. Try again later."
        );
        dispatch(clearFilteredMovies());
        loadedPagesRef.current.clear();
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [filters, page, dispatch, filteredLength]);

  return { loading, error };
};

export default useFetchFilteredMovies;
