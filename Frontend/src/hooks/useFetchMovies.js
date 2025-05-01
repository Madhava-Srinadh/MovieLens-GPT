// src/hooks/useFetchMovies.js
import { useDispatch } from "react-redux";
import { useEffect, useRef, useCallback } from "react";
import { TMDB_BASE_URL, options } from "../utils/constants"; // Updated import

const useFetchMovies = (category, actionCreator, page = 1) => {
  const dispatch = useDispatch();
  const fetchedPages = useRef(new Set());
  const totalPagesRef = useRef(1);

  const getMovies = useCallback(async () => {
    if (!category || fetchedPages.current.has(page))
      return totalPagesRef.current;
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${category}?language=en-US&page=${page}`,
        options
      );
      const json = await response.json();
      dispatch(actionCreator(json.results));
      fetchedPages.current.add(page);
      totalPagesRef.current = json.total_pages;
      return json.total_pages;
    } catch (error) {
      return totalPagesRef.current;
    }
  }, [category, page, dispatch, actionCreator]);

  useEffect(() => {
    if (page && category && !fetchedPages.current.has(page)) {
      getMovies();
    }
  }, [getMovies, category, page]);

  useEffect(() => {
    fetchedPages.current.clear();
    totalPagesRef.current = 1;
  }, [category]);

  return { getMovies, totalPages: totalPagesRef.current };
};

export default useFetchMovies;
