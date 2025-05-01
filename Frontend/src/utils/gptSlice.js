// src/utils/gptSlice.js
import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gptShow",
  initialState: {
    show: false,
    gptMovies: null,
    loading: false,
    preservedGptMovies: null,
  },
  reducers: {
    toggleShow: (state) => {
      state.show = !state.show;
    },
    setGptMovies: (state, action) => {
      state.gptMovies = action.payload.movies;
      state.loading = action.payload.loading;
    },
    clearGptMovies: (state) => {
      state.preservedGptMovies = state.gptMovies;
      state.gptMovies = null;
      state.loading = false;
    },
    restoreGptMovies: (state) => {
      if (state.preservedGptMovies) {
        state.gptMovies = state.preservedGptMovies;
        state.preservedGptMovies = null;
      } else {
      }
    },
  },
});

export const { toggleShow, setGptMovies, clearGptMovies, restoreGptMovies } =
  gptSlice.actions;
export default gptSlice.reducer;
