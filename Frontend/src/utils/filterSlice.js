// src/utils/filterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filters",
  initialState: {
    with_genres: "",
    with_original_language: "",
    with_origin_country: "",
    preservedFilters: null,
  },
  reducers: {
    setFilters: (state, action) => {
      console.log("Setting filters:", action.payload);
      state.with_genres = action.payload.with_genres || "";
      state.with_original_language =
        action.payload.with_original_language || "";
      state.with_origin_country = action.payload.with_origin_country || "";
    },
    clearFilters: (state) => {
      console.log("Clearing filters, preserving:", {
        with_genres: state.with_genres,
        with_original_language: state.with_original_language,
        with_origin_country: state.with_origin_country,
      });
      state.preservedFilters = {
        with_genres: state.with_genres,
        with_original_language: state.with_original_language,
        with_origin_country: state.with_origin_country,
      };
      state.with_genres = "";
      state.with_original_language = "";
      state.with_origin_country = "";
    },
    restoreFilters: (state) => {
      console.log("Restoring filters from:", state.preservedFilters);
      if (state.preservedFilters) {
        state.with_genres = state.preservedFilters.with_genres || "";
        state.with_original_language =
          state.preservedFilters.with_original_language || "";
        state.with_origin_country =
          state.preservedFilters.with_origin_country || "";
        console.log("Restored filters:", {
          with_genres: state.with_genres,
          with_original_language: state.with_original_language,
          with_origin_country: state.with_origin_country,
        });
        state.preservedFilters = null;
      } else {
        console.log("No preservedFilters to restore");
      }
    },
  },
});

export const { setFilters, clearFilters, restoreFilters } = filterSlice.actions;
export default filterSlice.reducer;
