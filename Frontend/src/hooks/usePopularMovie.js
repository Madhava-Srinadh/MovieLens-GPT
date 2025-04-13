import useFetchMovies from "../hooks/useFetchMovies";
import { addPopularMovies } from "../utils/movieSlice";

const usePopularMovies = () => useFetchMovies("popular", addPopularMovies);
export default usePopularMovies;
