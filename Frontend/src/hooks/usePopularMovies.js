import useFetchMovies from "../hooks/useFetchMovies";
import { addPopularMovies } from "../utils/movieSlice";

const usePopularMovies = (page) =>
  useFetchMovies("popular", addPopularMovies, page);
export default usePopularMovies;
