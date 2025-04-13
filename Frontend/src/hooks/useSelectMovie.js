import { useDispatch } from "react-redux";
import { setSelectedMovie } from "../utils/selectSlice";

const useSelectMovie = () => {
  const dispatch = useDispatch();

  const selectMovie = (movie) => {
    dispatch(setSelectedMovie(movie));
  };

  return selectMovie;
};

export default useSelectMovie;
