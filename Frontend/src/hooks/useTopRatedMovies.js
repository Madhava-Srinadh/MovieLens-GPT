import useFetchMovies from "../hooks/useFetchMovies";
import { addTopRatedMovies } from "../utils/movieSlice";

const useTopRatedMovies = () => useFetchMovies("top_rated", addTopRatedMovies);
export default useTopRatedMovies;
