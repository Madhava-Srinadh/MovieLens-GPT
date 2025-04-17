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
      console.log("Setting gptMovies:", action.payload.movies);
      state.gptMovies = action.payload.movies;
      state.loading = action.payload.loading;
    },
    clearGptMovies: (state) => {
      console.log("Clearing gptMovies, preserving:", state.gptMovies);
      state.preservedGptMovies = state.gptMovies;
      state.gptMovies = null;
      state.loading = false;
    },
    restoreGptMovies: (state) => {
      console.log("Restoring gptMovies from:", state.preservedGptMovies);
      if (state.preservedGptMovies) {
        state.gptMovies = state.preservedGptMovies;
        state.preservedGptMovies = null;
        console.log("Restored gptMovies:", state.gptMovies);
      } else {
        console.log("No preservedGptMovies to restore");
      }
    },
  },
});

export const { toggleShow, setGptMovies, clearGptMovies, restoreGptMovies } =
  gptSlice.actions;
export default gptSlice.reducer;
