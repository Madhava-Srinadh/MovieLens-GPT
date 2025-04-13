import React from "react";
import { FaSearch } from "react-icons/fa";
const GptComponent = () => {
  return (
    <div className="absolute right-6 text-white top-[15vh]  z-50">
      <form className="flex items-center border-b border-gray-400 px-3 py-2 bg-gray-900 rounded-md">
        <input
          type="text"
          className="bg-transparent text-white px-2 focus:outline-none w-24 md:w-48 placeholder-gray-400 transition-all hover:w-64"
          placeholder="Gpt Search"
        />
        <button>
          <FaSearch className="text-gray-300" />
        </button>
      </form>
    </div>
  );
};

export default GptComponent;
