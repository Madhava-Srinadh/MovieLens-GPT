import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleShow, setGptMovies } from "../utils/gptSlice";
import useGptResponse from "../hooks/useGptResponse";
import { debounce } from "lodash";
import { Search } from "lucide-react";

const SearchComponent = () => {
  const dispatch = useDispatch();
  const show = useSelector((store) => store.gpt.show);
  const { fetchGptMovies } = useGptResponse();
  const [query, setQuery] = useState("");

  const debouncedSearch = useCallback(
    debounce((fn, q) => {
      if (q.trim()) {
        fn(q);
      }
    }, 500),
    []
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === "") {
      // Clear results when query is empty
      dispatch(setGptMovies({ movies: null, loading: false }));
    } else {
      debouncedSearch(fetchGptMovies, value);
    }
  };

  const handleToggle = () => {
    dispatch(toggleShow());
    if (show) {
      setQuery("");
      dispatch(setGptMovies({ movies: null, loading: false }));
    }
  };

  return (
    <div className="relative z-20 p-4">
      <button
        onClick={handleToggle}
        className="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition"
      >
        <Search size={18} />
        {show ? "Hide Search" : "Search Movies"}
      </button>
      {show && (
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search for movies (e.g., Telugu movies 2023)..."
          className="mt-2 p-2 w-full max-w-md rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
        />
      )}
    </div>
  );
};

export default SearchComponent;
