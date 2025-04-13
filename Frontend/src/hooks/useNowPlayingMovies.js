import useFetchMovies from "../hooks/useFetchMovies";
import { addNowPlayingMovies } from "../utils/movieSlice";

const useNowPlayingMovies = () =>
  useFetchMovies("now_playing", addNowPlayingMovies);
export default useNowPlayingMovies;
