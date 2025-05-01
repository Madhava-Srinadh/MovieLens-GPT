// src/components/FilterBar.jsx
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFilters, clearFilters } from "../utils/filterSlice";
import { clearGptMovies } from "../utils/gptSlice";
import { FaTimes, FaChevronDown } from "react-icons/fa";
import countries from "../utils/countries.json";
import languages from "../utils/languages.json";

const genres = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
];

const FilterBar = ({ onClose }) => {
  const dispatch = useDispatch();
  const [selectedGenre, setSelectedGenre] = useState({ id: "", name: "" });
  const [selectedLanguage, setSelectedLanguage] = useState({
    iso_639_1: "",
    english_name: "",
  });
  const [selectedCountry, setSelectedCountry] = useState({
    iso_3166_1: "",
    english_name: "",
  });
  const [genreQuery, setGenreQuery] = useState("");
  const [languageQuery, setLanguageQuery] = useState("");
  const [countryQuery, setCountryQuery] = useState("");
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const genreRef = useRef(null);
  const languageRef = useRef(null);
  const countryRef = useRef(null);

  // Filter options based on query
  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(genreQuery.toLowerCase())
  );
  const filteredLanguages = languages.filter((lang) =>
    lang.english_name.toLowerCase().includes(languageQuery.toLowerCase())
  );
  const filteredCountries = countries.filter((country) =>
    country.english_name.toLowerCase().includes(countryQuery.toLowerCase())
  );

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        genreRef.current &&
        !genreRef.current.contains(event.target) &&
        languageRef.current &&
        !languageRef.current.contains(event.target) &&
        countryRef.current &&
        !countryRef.current.contains(event.target)
      ) {
        setShowGenreDropdown(false);
        setShowLanguageDropdown(false);
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilter = () => {
    const filterPayload = {
      with_genres: selectedGenre.id,
      with_original_language: selectedLanguage.iso_639_1,
      with_origin_country: selectedCountry.iso_3166_1,
    };
    dispatch(clearGptMovies());
    dispatch(setFilters(filterPayload));
    onClose();
  };

  const handleClear = () => {
    setSelectedGenre({ id: "", name: "" });
    setSelectedLanguage({ iso_639_1: "", english_name: "" });
    setSelectedCountry({ iso_3166_1: "", english_name: "" });
    setGenreQuery("");
    setLanguageQuery("");
    setCountryQuery("");
    dispatch(clearFilters());
    onClose();
  };

  const selectGenre = (genre) => {
    setSelectedGenre(genre);
    setGenreQuery(genre.name);
    setShowGenreDropdown(false);
  };

  const selectLanguage = (lang) => {
    setSelectedLanguage(lang);
    setLanguageQuery(lang.english_name);
    setShowLanguageDropdown(false);
  };

  const selectCountry = (country) => {
    setSelectedCountry(country);
    setCountryQuery(country.english_name);
    setShowCountryDropdown(false);
  };

  return (
    <div className="relative flex flex-col gap-4 p-4 bg-black/90 backdrop-blur-lg rounded-xl text-white animate-slide-down">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-300 hover:text-white transition-all duration-200"
        aria-label="Close filter bar"
      >
        <FaTimes className="w-5 h-5" />
      </button>
      <h3 className="text-lg font-semibold text-center">Filter Movies</h3>
      <div className="flex flex-col gap-3">
        {/* Genre Filter */}
        <div ref={genreRef} className="relative">
          <label className="block text-sm font-medium mb-1">Genre</label>
          <div className="relative">
            <input
              type="text"
              value={genreQuery}
              onChange={(e) => {
                setGenreQuery(e.target.value);
                setShowGenreDropdown(true);
                if (!e.target.value) setSelectedGenre({ id: "", name: "" });
              }}
              onFocus={() => setShowGenreDropdown(true)}
              placeholder="Type to search genres..."
              className="w-full bg-gray-800/70 backdrop-blur-sm text-white p-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-label="Search genres"
            />
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {showGenreDropdown && (
            <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-gray-900/90 backdrop-blur-lg rounded-lg shadow-lg border border-gray-700/50">
              {filteredGenres.length > 0 ? (
                filteredGenres.map((genre) => (
                  <div
                    key={genre.id}
                    onClick={() => selectGenre(genre)}
                    className="px-3 py-2 text-white hover:bg-gray-800/70 cursor-pointer transition-all duration-200"
                    role="option"
                    aria-selected={selectedGenre.id === genre.id}
                  >
                    {genre.name}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-400">No genres found</div>
              )}
            </div>
          )}
        </div>

        {/* Language Filter */}
        <div ref={languageRef} className="relative">
          <label className="block text-sm font-medium mb-1">Language</label>
          <div className="relative">
            <input
              type="text"
              value={languageQuery}
              onChange={(e) => {
                setLanguageQuery(e.target.value);
                setShowLanguageDropdown(true);
                if (!e.target.value)
                  setSelectedLanguage({ iso_639_1: "", english_name: "" });
              }}
              onFocus={() => setShowLanguageDropdown(true)}
              placeholder="Type to search languages..."
              className="w-full bg-gray-800/70 backdrop-blur-sm text-white p-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-label="Search languages"
            />
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {showLanguageDropdown && (
            <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-gray-900/90 backdrop-blur-lg rounded-lg shadow-lg border border-gray-700/50">
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map((lang) => (
                  <div
                    key={lang.iso_639_1}
                    onClick={() => selectLanguage(lang)}
                    className="px-3 py-2 text-white hover:bg-gray-800/70 cursor-pointer transition-all duration-200"
                    role="option"
                    aria-selected={
                      selectedLanguage.iso_639_1 === lang.iso_639_1
                    }
                  >
                    {lang.english_name}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-400">
                  No languages found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Country Filter */}
        <div ref={countryRef} className="relative">
          <label className="block text-sm font-medium mb-1">Country</label>
          <div className="relative">
            <input
              type="text"
              value={countryQuery}
              onChange={(e) => {
                setCountryQuery(e.target.value);
                setShowCountryDropdown(true);
                if (!e.target.value)
                  setSelectedCountry({ iso_3166_1: "", english_name: "" });
              }}
              onFocus={() => setShowCountryDropdown(true)}
              placeholder="Type to search countries..."
              className="w-full bg-gray-800/70 backdrop-blur-sm text-white p-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-label="Search countries"
            />
            <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {showCountryDropdown && (
            <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-gray-900/90 backdrop-blur-lg rounded-lg shadow-lg border border-gray-700/50">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <div
                    key={country.iso_3166_1}
                    onClick={() => selectCountry(country)}
                    className="px-3 py-2 text-white hover:bg-gray-800/70 cursor-pointer transition-all duration-200"
                    role="option"
                    aria-selected={
                      selectedCountry.iso_3166_1 === country.iso_3166_1
                    }
                  >
                    {country.english_name}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-400">
                  No countries found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleFilter}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClear}
          className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200 font-semibold"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
