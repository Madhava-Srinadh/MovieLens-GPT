import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { options } from "../utils/constants";

const useFetchMovies = (category, actionCreator, pages = 5) => {
  const dispatch = useDispatch();

  const getMovies = async () => {
    let allMovies = [];
    try {
      for (let page = 1; page <= pages; page++) {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`,
          options
        );
        const json = await response.json();
        allMovies = [...allMovies, ...json.results];
      }
      dispatch(actionCreator(allMovies));
    } catch (error) {
      console.error(`Error fetching ${category} movies:`, error);
    }
  };

  useEffect(() => {
    getMovies();
  }, [dispatch, category, actionCreator]); // Added dependencies to ensure it runs correctly
};

export default useFetchMovies;
