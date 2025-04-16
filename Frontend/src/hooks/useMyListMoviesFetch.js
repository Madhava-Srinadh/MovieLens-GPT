import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback, useRef } from "react";
import axios from "axios";
import validator from "validator";
import { appendMyListMovies, setMyListTotalPages } from "../utils/movieSlice";

const useMyListMoviesFetch = (page = 1) => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const fetchedPages = useRef(new Set());
  const totalPagesRef = useRef(1);

  const getMyListMovies = useCallback(async () => {
    if (
      !user ||
      !user.email ||
      !validator.isEmail(user.email) ||
      fetchedPages.current.has(page)
    ) {
      return totalPagesRef.current;
    }
    try {
      const response = await axios.get(
        `https://movielens-gpt.onrender.com/api/mylist/${encodeURIComponent(
          user.email
        )}?page=${page}&limit=10`
      );
      dispatch(appendMyListMovies(response.data.movies || []));
      if (page === 1) {
        totalPagesRef.current = response.data.totalPages || 1;
        dispatch(setMyListTotalPages(response.data.totalPages || 1));
      }
      fetchedPages.current.add(page);
      return response.data.totalPages || 1;
    } catch (error) {
      console.error("Error fetching my list movies:", error);
      return totalPagesRef.current;
    }
  }, [user, page, dispatch]);

  useEffect(() => {
    if (page && user?.email && validator.isEmail(user.email)) {
      getMyListMovies();
    }
  }, [getMyListMovies, page, user?.email]);

  useEffect(() => {
    fetchedPages.current.clear();
    totalPagesRef.current = 1;
  }, [user?.email]);

  return { totalPages: totalPagesRef.current };
};

export default useMyListMoviesFetch;
