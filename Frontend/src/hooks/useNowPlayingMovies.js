import useFetchMovies from "../hooks/useFetchMovies";
import { addNowPlayingMovies } from "../utils/movieSlice";

const useNowPlayingMovies = (page) =>
  useFetchMovies("now_playing", addNowPlayingMovies, page);
export default useNowPlayingMovies;
