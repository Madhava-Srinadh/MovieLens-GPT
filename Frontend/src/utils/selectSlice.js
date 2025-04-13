import { createSlice } from "@reduxjs/toolkit";

const selectSlice = createSlice({
  name: "selected",
  initialState: {
    selectedMovie: null,
    selectVideo: null,
  },
  reducers: {
    setSelectedMovie(state, action) {
      state.selectedMovie = action.payload;
    },
    setSelectVideo(state, action) {
      state.selectVideo = action.payload;
    },
  },
});

export const { setSelectedMovie, setSelectVideo } = selectSlice.actions;
export default selectSlice.reducer;
