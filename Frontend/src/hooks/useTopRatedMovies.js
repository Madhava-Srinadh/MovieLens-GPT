import useFetchMovies from "../hooks/useFetchMovies";
import { addTopRatedMovies } from "../utils/movieSlice";

const useTopRatedMovies = (page) =>
  useFetchMovies("top_rated", addTopRatedMovies, page);
export default useTopRatedMovies;
