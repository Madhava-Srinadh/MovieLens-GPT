// src/components/GptSearchPopup.jsx
import React, { useState } from "react";
import { FaBrain } from "react-icons/fa";
import useGptResponse from "../hooks/useGptResponse";

const GptSearchPopup = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const { fetchGptMovies } = useGptResponse();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchGptMovies(query);
      setQuery("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="relative w-full max-w-md bg-gray-900 rounded-lg p-6 text-white shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Ask GPT</h2>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex items-center w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-800">
            <FaBrain className="text-gray-300 mr-2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full bg-transparent text-white focus:outline-none placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default GptSearchPopup;
