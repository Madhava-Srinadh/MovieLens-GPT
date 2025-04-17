// src/hooks/useFetchFilteredMovies.js
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  appendFilteredMovies,
  setFilteredTotalPages,
  clearFilteredMovies,
} from "../utils/movieSlice";
import { options } from "../utils/constants";

const useFetchFilteredMovies = (filters, page = 1) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const filteredMovies = useSelector((state) => state.movies.filteredMovies);
  const prevFiltersRef = useRef(filters);
  const loadedPagesRef = useRef(new Set());

  useEffect(() => {
    const isFiltersEmpty =
      !filters ||
      (!filters.with_genres &&
        !filters.with_original_language &&
        !filters.with_origin_country);

    // Check if filters have changed
    const filtersChanged =
      JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);

    console.log(
      "useFetchFilteredMovies: filtersChanged=",
      filtersChanged,
      "filters=",
      filters,
      "page=",
      page
    );

    // Clear and reset when filters change
    if (filtersChanged) {
      console.log("Filters changed, clearing filteredMovies");
      dispatch(clearFilteredMovies());
      loadedPagesRef.current.clear();
      prevFiltersRef.current = filters;
    }

    // Skip if filteredMovies is restored, filters haven't changed, and page is loaded
    if (
      !filtersChanged &&
      filteredMovies.length > 0 &&
      loadedPagesRef.current.has(page)
    ) {
      console.log(
        `Skipping fetch, restored filteredMovies for page ${page}, length:`,
        filteredMovies.length
      );
      setLoading(false);
      return;
    }

    if (isFiltersEmpty && filteredMovies.length === 0) {
      console.log("No filters applied and no filteredMovies, resetting");
      dispatch(clearFilteredMovies());
      loadedPagesRef.current.clear();
      setLoading(false);
      setError(null);
      return;
    }

    // Skip fetching if page is already loaded and filters haven't changed
    if (!filtersChanged && loadedPagesRef.current.has(page)) {
      console.log(`Skipping fetch for page ${page}, already loaded`);
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

        console.log(
          "Fetching movies for page:",
          page,
          "Params:",
          discoverParams
        );
        const discoverResponse = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            ...options,
            params: discoverParams,
          }
        );

        console.log(
          "Discover API response for page",
          page,
          ":",
          discoverResponse.data
        );

        dispatch(appendFilteredMovies(discoverResponse.data.results || []));
        dispatch(setFilteredTotalPages(discoverResponse.data.total_pages || 1));
        loadedPagesRef.current.add(page);
      } catch (err) {
        console.error("Error fetching filtered movies:", err.response || err);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page, dispatch]);

  return { loading, error };
};

export default useFetchFilteredMovies;
