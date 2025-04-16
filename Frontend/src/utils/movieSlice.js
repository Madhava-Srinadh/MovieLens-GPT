import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    nowPlayingMovies: [],
    popularMovies: [],
    topRatedMovies: [],
    myListMovies: [],
    myListTotalPages: 1,
  },
  reducers: {
    addNowPlayingMovies: (state, action) => {
      state.nowPlayingMovies = [
        ...state.nowPlayingMovies,
        ...action.payload.filter(
          (newMovie) =>
            !state.nowPlayingMovies.some((movie) => movie.id === newMovie.id)
        ),
      ];
    },
    addPopularMovies: (state, action) => {
      state.popularMovies = [
        ...state.popularMovies,
        ...action.payload.filter(
          (newMovie) =>
            !state.popularMovies.some((movie) => movie.id === newMovie.id)
        ),
      ];
    },
    addTopRatedMovies: (state, action) => {
      state.topRatedMovies = [
        ...state.topRatedMovies,
        ...action.payload.filter(
          (newMovie) =>
            !state.topRatedMovies.some((movie) => movie.id === newMovie.id)
        ),
      ];
    },
    appendMyListMovies: (state, action) => {
      const newMovies = action.payload.filter(
        (newMovie) =>
          !state.myListMovies.some((movie) => movie.id === newMovie.id)
      );
      state.myListMovies = [...state.myListMovies, ...newMovies];
    },
    setMyListTotalPages: (state, action) => {
      state.myListTotalPages = action.payload;
    },
    addToMyList: (state, action) => {
      if (!state.myListMovies.some((m) => m.id === action.payload.id)) {
        state.myListMovies.push(action.payload);
      }
    },
    removeFromMyList: (state, action) => {
      state.myListMovies = state.myListMovies.filter(
        (m) => m.id !== action.payload
      );
    },
  },
});

export const {
  addNowPlayingMovies,
  addPopularMovies,
  addTopRatedMovies,
  appendMyListMovies,
  setMyListTotalPages,
  addToMyList,
  removeFromMyList,
} = movieSlice.actions;
export default movieSlice.reducer;
