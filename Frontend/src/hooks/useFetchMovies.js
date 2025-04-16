import { useDispatch } from "react-redux";
import { useEffect, useRef, useCallback } from "react";
import { options } from "../utils/constants";

const useFetchMovies = (category, actionCreator, page = 1) => {
  const dispatch = useDispatch();
  const fetchedPages = useRef(new Set());
  const totalPagesRef = useRef(1);

  const getMovies = useCallback(async () => {
    if (!category || fetchedPages.current.has(page))
      return totalPagesRef.current;
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`,
        options
      );
      const json = await response.json();
      dispatch(actionCreator(json.results));
      fetchedPages.current.add(page);
      totalPagesRef.current = json.total_pages;
      return json.total_pages;
    } catch (error) {
      console.error(`Error fetching ${category} movies:`, error);
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
