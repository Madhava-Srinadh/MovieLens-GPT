import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import moviesReducer from "./movieSlice";
import gptReducer from "./gptSlice";
import searchReducer from "./searchSlice";
import selectReducer from "./selectSlice";
import filterReducer from "./filterSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    movies: moviesReducer,
    gpt: gptReducer,
    movie: searchReducer,
    select: selectReducer,
    filters: filterReducer,
  },
});

export default appStore;
