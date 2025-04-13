import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gptShow",
  initialState: {
    show: false,
    gptMovies: [],
  },
  reducers: {
    toggleShow: (state) => {
      state.show = !state.show;
    },
    setGptMovies: (state, action) => {
      state.gptMovies = action.payload;
    },
  },
});

export const { toggleShow, setGptMovies } = gptSlice.actions;
export default gptSlice.reducer;
