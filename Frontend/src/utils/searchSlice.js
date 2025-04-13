import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "searchShow",
  initialState: {
    movie: null,
  },
  reducers: {
    searchMovie: (state, action) => {
      state.movie = action.payload;
    },
  },
});

export const { searchMovie } = searchSlice.actions;
export default searchSlice.reducer;
