import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gptShow",
  initialState: {
    show: false,
    gptMovies: [],
    loading: false, // Added for loading animation
  },
  reducers: {
    toggleShow: (state) => {
      state.show = !state.show;
    },
    setGptMovies: (state, action) => {
      state.gptMovies = action.payload.movies;
      state.loading = action.payload.loading;
    },
  },
});

export const { toggleShow, setGptMovies } = gptSlice.actions;
export default gptSlice.reducer;
