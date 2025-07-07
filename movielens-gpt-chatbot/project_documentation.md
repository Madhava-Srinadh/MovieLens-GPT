MovieLens GPT Documentation
Project Overview
MovieLens GPT is a full-stack MERN (MongoDB, Express.js, React, Node.js) application designed to enhance movie discovery through AI-powered recommendations and intuitive user interactions. Users can browse trending, popular, and top-rated movies, search for movies using natural language queries (e.g., "Telugu action movies 2023"), filter movies by genre, language, or country, manage personal movie lists ("My List"), and view detailed movie information, including trailers, cast, reviews, and streaming providers. The application integrates a proxy server to securely fetch movie data from the TMDB API and includes a Streamlit-based support chatbot to answer project-related questions.
Key Features

User Authentication: Secure login and signup using Firebase Authentication.
Movie Browsing: Displays curated lists (now playing, popular, top-rated, user’s My List) sourced from the TMDB API.
AI-Powered Search: Supports natural language queries for movie recommendations, powered by the GroqCloud API.
Movie Filtering: Allows users to filter movies by genre, original language, or production country.
Personal Movie Lists: Users can add or remove movies to/from their My List, stored in MongoDB.
Dynamic Video Background: Plays movie trailers or displays backdrops for selected movies.
Detailed Movie View: Provides comprehensive movie details, including cast, reviews, images, and streaming availability.
Support Chatbot: A Streamlit-based chatbot answers questions about the project’s functionality, setup, and troubleshooting.
Responsive UI: Built with TailwindCSS for a modern, mobile-friendly interface.

Project Architecture
The MovieLens GPT project is structured into four main components:

Frontend (React): Handles the user interface, movie browsing, search, and list management using React.js, Redux for state management, and TailwindCSS for styling.
Backend (Node.js/Express.js): Manages user movie lists, validates inputs, and interacts with MongoDB for persistent storage.
Proxy Server (Node.js): Secures TMDB API requests by hiding the API key and handling CORS.
Support Chatbot (Streamlit): A Python-based application using LangChain and Groq to provide detailed answers about the project.

Tech Stack
Frontend

React.js: Core framework for building dynamic UI components and managing client-side routing.
Redux Toolkit: Manages global state for movies, user data, filters, and search results.
TailwindCSS: Provides responsive, utility-first styling for a polished user interface.
Axios: Facilitates HTTP requests to the backend and TMDB proxy server.
lucide-react: Supplies icons for interactive UI elements (e.g., search, navigation).
react-router-dom: Enables client-side routing for seamless navigation.
validator: Validates user email inputs client-side.
lodash: Implements debouncing for efficient search query handling.

Backend

Node.js/Express.js: Powers the API server for handling movie list operations.
MongoDB/Mongoose: Stores and retrieves user movie lists with a structured schema.
validator: Ensures valid email and movie data on the server side.
cors: Configures cross-origin resource sharing for secure frontend-backend communication.

Proxy Server

Node.js/Express.js: Hosts the proxy server for TMDB API requests.
http-proxy-middleware: Routes TMDB API calls while securing the bearer token.

Support Chatbot

Streamlit: Creates an interactive web interface for the chatbot.
LangChain: Constructs a Retrieval-Augmented Generation (RAG) pipeline for question answering.
FAISS: Stores document embeddings for efficient retrieval.
HuggingFace Embeddings: Generates text embeddings using the all-MiniLM-L6-v2 model.
GroqCloud: Powers the chatbot’s responses with the Llama3-8b-8192 model.
python-dotenv: Manages environment variables for API keys.

APIs

TMDB API: Provides movie data (movies, trailers, cast, reviews, providers) via the proxy server.
GroqCloud API: Enables AI-driven movie search and chatbot functionality.
YouTube API: Serves as a fallback for movie trailers when TMDB data is unavailable.
Firebase Authentication: Manages user authentication and session persistence.

Database

MongoDB: Stores user-specific movie lists with a schema defining email and movie details.

Deployment

Frontend: Hosted on Firebase Hosting.
Backend and Proxy: Deployed on Render.
Chatbot: Deployed on Streamlit Cloud.

Application Flow

Authentication: Users sign up or log in via Firebase Authentication. A JWT token is stored in local storage, and user details (UID, email, display name) are saved in Redux.
Home Page: Upon login, users are redirected to the /browse route, displaying curated movie lists (now playing, popular, top-rated).
Movie Browsing: Users scroll through movie posters, with options to load more pages or view their personal My List.
AI Search: Users toggle a search bar to input natural language queries (e.g., "comedy movies 2020"), processed by GroqCloud and mapped to TMDB results.
Filtering: A filter bar allows users to select genres, languages, or countries, updating the displayed movie list.
Movie Details: Clicking a movie opens a modal with detailed information (title, overview, release date, rating, genres, runtime, cast, reviews, providers).
My List Management: Users can add or remove movies from their My List, with changes synced to MongoDB via the backend.
Video Background: Selecting a movie triggers a trailer or backdrop display in the background.
Support Chatbot: Users access a chatbot to ask questions about the project, such as setup instructions or error troubleshooting.

Specific Functionalities and Technologies
Authentication

Technology: Firebase Authentication.
Implementation: The Body.js component uses onAuthStateChanged to monitor user login state, dispatching user data to Redux via userSlice. Protected routes ensure only authenticated users access /browse.
Flow: Users log in via a form, Firebase stores a JWT token, and the frontend redirects to /browse.

Movie Browsing

Technology: TMDB API, React, Redux.
Implementation: MoviePosters.js fetches movies using hooks (useFetchMovies.js, useMyListMoviesFetch.js) and displays them in scrollable lists. Redux slices (movieSlice.js) store movie data.
Flow: Users see categorized lists with pagination, clicking posters to select movies.

AI-Powered Search

Technology: GroqCloud API, TMDB API, React.
Implementation: SearchComponent.js and GptSearchPopup.js handle user queries, processed by useGptResponse.js. Groq returns JSON-formatted movie suggestions, mapped to TMDB data with caching for efficiency.
Flow: Users input queries, results display as posters in MoviePosters.js.

Movie Filtering

Technology: TMDB API, React, Redux.
Implementation: FilterBar.js provides dropdowns for genres, languages, and countries, dispatching filters to filterSlice. useFetchFilteredMovies.js fetches filtered results.
Flow: Users select filters, and the app updates the movie list dynamically.

My List Management

Technology: MongoDB, Express.js, Axios.
Implementation: MovieDetails.js sends add/remove requests to /api/mylist routes (mylist.js). MongoDB stores lists with a schema (UserList.js), validated by validate.js.
Flow: Users click "Add to My List" or "Remove from My List," updating MongoDB and Redux.

Video Background

Technology: TMDB API, YouTube API, React.
Implementation: VideoBackground.js uses useGetVideo.js to fetch trailers, rendering YouTube iframes or TMDB backdrops.
Flow: Selecting a movie plays its trailer or shows a backdrop.

Movie Details

Technology: TMDB API, Axios, React.
Implementation: MovieDetails.js fetches extended data (cast, reviews, providers) using concurrent API calls, rendered in a modal.
Flow: Users click a poster to view a detailed modal with interactive elements.

Support Chatbot

Technology: Streamlit, LangChain, FAISS, Groq.
Implementation: The chatbot loads this documentation, splits it into chunks, embeds them with HuggingFace, and uses Groq for RAG-based answers.
Flow: Users ask questions via a chat interface, receiving detailed responses.

Setup Instructions
Prerequisites

Node.js (v16+), Python (3.8+), MongoDB (local or Atlas).
Accounts: Firebase, TMDB, GroqCloud, HuggingFace, YouTube API.
Git for cloning the repository.

Local Setup

Clone Repository:git clone https://github.com/your-username/MovieLens-GPT
cd MovieLens-GPT


Frontend:
Navigate: cd client
Install: npm install
Create .env:REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_TMDB_PROXY_URL=http://localhost:3000
REACT_APP_BEARER_TOKEN=your_tmdb_bearer_token
REACT_APP_GROQ_API_KEY=your_groq_api_key
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key


Start: npm start


Backend:
Navigate: cd server
Install: npm install
Create .env:MONGODB_URI=your_mongodb_uri
PORT=5000


Start: npm start


Proxy Server:
Navigate: cd tmdb-proxy
Install: npm install
Create .env:TMDB_BEARER_TOKEN=your_tmdb_bearer_token
PORT=3000


Start: npm start


Chatbot:
Navigate: cd movielens-gpt-chatbot
Create virtual environment: python -m venv venv
Activate: venv\Scripts\activate (Windows) or source venv/bin/activate (Unix)
Install: pip install streamlit langchain langchain-groq langchain-huggingface python-dotenv langchain-community faiss-cpu
Create .env:GROQ_API_KEY=your_groq_api_key
HF_TOKEN=your_huggingface_token


Save project_documentation.md in the directory.
Start: streamlit run app.py



Deployment

Frontend: Deploy to Firebase Hosting using npm run build and firebase deploy.
Backend/Proxy: Deploy to Render, setting environment variables in the dashboard.
Chatbot: Deploy to Streamlit Cloud, linking to the GitHub repository and configuring environment variables.

Error Handling

Authentication Failed: Verify Firebase API key and configuration in client/.env.
No Movies Available: Ensure the proxy server is running and REACT_APP_TMDB_PROXY_URL is correct.
MongoDB Connection Error: Check MONGODB_URI in server/.env.
Invalid Bearer Token: Validate TMDB_BEARER_TOKEN in tmdb-proxy/.env.
Chatbot Error: Confirm GROQ_API_KEY and HF_TOKEN in movielens-gpt-chatbot/.env.

Security Considerations

API Keys: Store sensitive keys (Firebase, TMDB, Groq) in .env files, not in version control.
TMDB Proxy: Hides the TMDB bearer token from client-side exposure.
CORS: Backend restricts origins to trusted domains (localhost:3000, movielens18.web.app).
Validation: Both client and server validate emails and movie data to prevent invalid inputs.

Testing and Debugging

Frontend: Test routing, search, filtering, and My List functionality using browser dev tools.
Backend: Use Postman to test /api/mylist endpoints and verify MongoDB updates.
Proxy: Test TMDB API calls via curl http://localhost:3000/api/movie/popular.
Chatbot: Query the chatbot with questions like "What is MovieLens GPT?" or "How does filtering work?".

Potential Improvements

Implement backend authentication with Firebase Admin SDK for token verification.
Move Groq API calls to the backend for enhanced security.
Add unit tests for React components and Express routes.
Optimize MongoDB queries for scalability with large user lists.
Enhance chatbot with dynamic code retrieval from GitHub.

Codes

/*

Body.js serves as the main layout component for the MovieLens GPT React frontend. It:

Configures client-side routing using React Router to navigate between the login page (/) and the browse page (/browse).
Implements protected routing to ensure only authenticated users can access the browse page.
Manages user authentication state by integrating with Firebase and updating the Redux store (userSlice.js).

React Router:
RouterProvider: Renders the router configuration.
createBrowserRouter: Creates a browser-based router for client-side navigation.
useNavigate: Hook for programmatic navigation (previously discussed in detail).
Components:
Login: Renders the login page (Login.js).
Browse: Renders the movie browsing interface (Browse.js).
Firebase:
auth: Firebase authentication instance from firebase.js.
onAuthStateChanged: Listens for changes in the user’s authentication state.
Redux:
useDispatch: Hook to dispatch actions to the Redux store.
addUser, removeUser: Actions from userSlice.js to update user state.
*/

import React from "react";
import { RouterProvider, createBrowserRouter, useNavigate } from "react-router";
import Login from "./Login";
import Browse from "./Browse";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";

// Purpose: A wrapper component that protects routes (e.g., /browse) by ensuring only authenticated users can access them.
// Props:
// children: The component to render if the user is authenticated (e.g., <Browse />).
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(true);
  /*
Purpose: Sets up a Firebase listener to monitor authentication state changes.
Key Functionality:
onAuthStateChanged: Firebase method that triggers when the user’s authentication status changes (e.g., signs in or out).
Cleanup: Returns unsubscribe to remove the listener when the component unmounts, preventing memory leaks.
*/
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          addUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );
        // Rely on Header.js for navigation
        setIsLoading(false);
      } else {
        dispatch(removeUser());
        navigate("/");
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate, dispatch]);

  //   Purpose: Conditionally renders the UI based on the authentication check.
  // Loading State: Displays “Loading...” while Firebase checks the user’s status.
  // Children: Renders the protected component (e.g., <Browse />) if authenticated.
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return children;
};

// createBrowserRouter is a modern API for defining routes.
// RouterProvider renders the routing system.
// useNavigate enables programmatic navigation, critical for redirects in protected routes.
const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/browse",
      element: (
        <ProtectedRoute>
          <Browse />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;


/*
Browse.js is the primary component for the movie browsing interface in the MovieLens GPT project. 
It:
Serves as the main page for authenticated users to explore movies (accessible at the /browse route, as defined in Body.js).
Renders the navigation bar (Header.js) and the main content area (MainContainer.js).
Manages a state to toggle between displaying a general movie catalog and the user’s personal movie list.
*/

import React, { useState } from "react";
import Header from "./Header";
import MainContainer from "./MainContainer";

const Browse = () => {
  const [showMyList, setShowMyList] = useState(false);
  return (
    <div>
      <Header setShowMyList={setShowMyList} showMyList={showMyList} />
      <MainContainer showMyList={showMyList} />
    </div>
  );
};

export default Browse;


// src/components/FilterBar.jsx

/*
FilterBar.jsx is a React component that renders a filter interface, allowing users to refine movie results by genre, language, and country. It:

Provides dropdown menus with search functionality for selecting filter criteria.
Updates the Redux store (filterSlice.js) with selected filters to trigger movie fetching.
Clears GPT-based movie recommendations (gptSlice.js) to prioritize filtered results.
Closes the filter bar after applying or clearing filters, enhancing user experience.
*/
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
/*
Key Concept:
State Management: Uses useState for local filter state and dropdown toggles.
Refs: Enable click-outside detection for closing dropdowns.
 */
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

  // Dynamic Filtering: Uses JavaScript’s filter method to match user input, enabling type-ahead search in dropdowns.
  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(genreQuery.toLowerCase())
  );
  const filteredLanguages = languages.filter((lang) =>
    lang.english_name.toLowerCase().includes(languageQuery.toLowerCase())
  );
  const filteredCountries = countries.filter((country) =>
    country.english_name.toLowerCase().includes(countryQuery.toLowerCase())
  );

  /*
Key Functionality:
Adds a mousedown event listener to the document.
Checks if the click target is outside all dropdown refs (genreRef, languageRef, countryRef).
Closes dropdowns by setting show*Dropdown states to false.
Cleans up the event listener on unmount to prevent memory leaks.

The ref object itself and its .current property persist for the entire lifetime of the component.
genreRef.current && !genreRef.current.contains(event.target):

genreRef.current: This assumes genreRef is a React ref (created with useRef()) that has been attached to a DOM element (e.g., a dropdown container for genre selection). genreRef.current provides a direct reference to that actual DOM element.

The first part (genreRef.current) checks if the ref actually holds a reference to a DOM element. It's good practice to check this because current can be null before the component mounts or if the element is unmounted.

!genreRef.current.contains(event.target):

event.target: This property of the click event object refers to the specific DOM element that was clicked.

someElement.contains(anotherElement): This is a built-in DOM method that returns true if anotherElement is a descendant of someElement (i.e., anotherElement is inside someElement), or if anotherElement is someElement itself.*/
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


export const validate = (
  email,
  password,
  confirmPassword,
  isSignUp,
  isResetPassword = false
) => {
  // Common email validation
  /**
   Uses a regular expression (/^[^\s@]+@[^\s@]+\.[^\s@]+$/) to verify email format:
[^\s@]+: One or more non-whitespace, non-@ characters (e.g., username).
@: The @ symbol.
[^\s@]+: One or more non-whitespace, non-@ characters (e.g., domain).
\.: A literal dot.
[^\s@]+: One or more non-whitespace, non-@ characters (e.g., top-level domain).
Returns an empty string ("") if valid, or an error message if invalid.
   */
  const validateEmail = (email) => {
    if (!email) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Invalid email format.";
    return "";
  };

  // Common password validation
  const validatePassword = (pwd) => {
    if (!pwd) return "Password is required.";
    if (pwd.length < 6) return "Password must be at least 6 characters long.";
    return "";
  };

  if (isSignUp) {
    const emailError = validateEmail(email);
    if (emailError) return { isValid: false, message: emailError };

    const passwordError = validatePassword(password);
    if (passwordError) return { isValid: false, message: passwordError };

    if (password !== confirmPassword)
      return { isValid: false, message: "Passwords do not match." };
  } else if (isResetPassword) {
    // For reset password, only validate passwords if provided
    if (password || confirmPassword) {
      const passwordError = validatePassword(password);
      if (passwordError) return { isValid: false, message: passwordError };

      if (password !== confirmPassword)
        return { isValid: false, message: "Passwords do not match." };
    }
    // If email is provided (e.g., for sending reset link)
    if (email) {
      const emailError = validateEmail(email);
      if (emailError) return { isValid: false, message: emailError };
    }
  } else {
    // Sign-in
    const emailError = validateEmail(email);
    if (emailError) return { isValid: false, message: emailError };

    const passwordError = validatePassword(password);
    if (passwordError) return { isValid: false, message: passwordError };
  }

  return { isValid: true, message: "" };
};


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


/* The Header.jsx component is a React functional component that serves as the navigation bar for a movie-related web application, integrating with Firebase for authentication, Redux for state management, and custom hooks for movie search functionality.*/

// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaList, FaHome, FaTimes, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  signOut,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";
import useSearchMovie from "../hooks/useSearchMovie";
import { setSelectedMovie } from "../utils/selectSlice";
import { toggleShow } from "../utils/gptSlice";
import { Bot } from "lucide-react";
import GptSearchPopup from "./GptSearchPopup";
import FilterBar from "./FilterBar";
import { setFilters } from "../utils/filterSlice";

const Header = ({ setShowMyList, showMyList }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showGptPopup, setShowGptPopup] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const filterRef = useRef(null);

  const { fetchMovies } = useSearchMovie(searchValue, setSearchResults);
  const username = user?.email?.split("@")[0] || "Guest";
  /**
   * currentUser.emailVerified:
currentUser is the user object provided by Firebase's onAuthStateChanged callback, representing the currently authenticated user.
emailVerified is a boolean property indicating whether the user has verified their email address (e.g., by clicking a verification link sent by Firebase).
This check ensures that only users who have completed email verification are redirected.
window.location.pathname === "/":
window.location.pathname retrieves the current URL path of the application (e.g., /, /browse, /login).
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(addUser({ uid: currentUser.uid, email: currentUser.email }));
        if (currentUser.emailVerified && window.location.pathname === "/") {
          navigate("/browse");
        }
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate]);
  /**
   * Search Logic:
Uses useEffect to debounce search queries by 300ms, preventing excessive API calls.
Calls fetchMovies (from useSearchMovie) when searchValue is non-empty.
Clears the debounce timer on unmount or when searchValue changes.
   */
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchValue) fetchMovies();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchValue, fetchMovies]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !filterRef.current?.contains(event.target)
      ) {
        setSearchResults([]);
        setIsSearching(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        !filterRef.current?.contains(event.target)
      ) {
        setShowProfileMenu(false);
        setShowUpdatePassword(false);
        setError("");
        setSuccessMessage("");
        setOldPassword("");
        setNewPassword("");
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(removeUser());
        navigate("/");
      })
      .catch((error) => {});
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    if (!oldPassword || !newPassword) {
      setError("Please enter both old and new passwords.");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }
    /*
    Creates an authentication credential for the user using their email and the provided old password.
    The credential object is used to verify the user’s identity by proving they know their current (old) password. Firebase requires reauthentication for sensitive operations like updating a password to ensure security
 * reauthenticateWithCredential: A Firebase Authentication function that verifies the user’s identity by checking the provided credential against their current authentication state.
auth.currentUser: The currently authenticated user object, provided by the Firebase auth instance (imported from ../utils/firebase). It contains details like the user’s uid, email, and authentication tokens.
credential: The AuthCredential object created in the previous step, containing the user’s email and old password.
 */
    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setSuccessMessage("Password updated successfully!");
      setTimeout(() => {
        setShowUpdatePassword(false);
        setShowProfileMenu(false);
        setOldPassword("");
        setNewPassword("");
      }, 2000);
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          setError("Incorrect old password.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Try again later.");
          break;
        case "auth/requires-recent-login":
          setError("Please sign in again to update your password.");
          break;
        default:
          setError("Failed to update password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieSelect = (movie) => {
    dispatch(setSelectedMovie(movie));
    setSearchValue("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleToggle = () => {
    setShowMyList(!showMyList);
  };

  const handleBotClick = () => {
    setShowGptPopup(true);
    dispatch(toggleShow());
  };

  const handleApplyFilters = (filters) => {
    dispatch(setFilters(filters));
    setShowFilterPopup(false);
  };

  const toggleFilterPopup = () => {
    setShowFilterPopup((prev) => !prev);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-black bg-opacity-70 px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between z-50 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logo.svg"
            alt="MovieLens Logo"
            className="hidden md:block w-48 cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={() => user && navigate("/browse")}
          />
          <img
            src="/M.svg"
            alt="MovieLens Logo"
            className="block md:hidden w-16 h-16 cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={() => user && navigate("/browse")}
          />
        </div>

        {user && (
          <button
            onClick={handleToggle}
            className="flex items-center gap-2 text-white text-sm sm:text-base px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 hover:bg-gray-700 transition-all"
          >
            {showMyList ? (
              <FaHome className="text-red-500 text-lg" />
            ) : (
              <FaList className="text-red-500 text-lg" />
            )}
            <span className="hidden sm:inline">
              {showMyList ? "Home" : "My List"}
            </span>
          </button>
        )}
      </div>

      {user && (
        <div
          className="flex items-center gap-3 sm:gap-4 md:gap-5"
          ref={profileRef}
        >
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <div
              className={`flex items-center bg-gray-900/50 backdrop-blur-md border border-gray-600 rounded-full px-3 py-2 h-10 transition-all duration-300 ${
                isSearching ? "w-40 sm:w-52 md:w-80" : "w-10 sm:w-48"
              }`}
            >
              <FaSearch
                className="text-gray-300 cursor-pointer hover:text-white"
                onClick={() => setIsSearching(!isSearching)}
              />
              <input
                type="text"
                className={`bg-transparent text-white pl-3 focus:outline-none placeholder-gray-400 text-sm sm:text-base ${
                  isSearching ? "block" : "hidden sm:block"
                }`}
                placeholder="Search movies..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearching(true)}
              />
              {searchValue && (
                <FaTimes
                  className="text-gray-400 cursor-pointer hover:text-white"
                  onClick={() => {
                    setSearchValue("");
                    setSearchResults([]);
                  }}
                />
              )}
            </div>
            {searchResults.length > 0 && (
              <div className="absolute mt-2 w-60 sm:w-72 md:w-80 max-h-96 overflow-y-auto no-scrollbar bg-gray-900/90 backdrop-blur-md rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.6)] border border-gray-700/50 animate-fade-in">
                {searchResults.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-800/70 cursor-pointer transition-all duration-200 focus:bg-gray-800/70 outline-none"
                    onClick={() => handleMovieSelect(movie)}
                    role="option"
                    tabIndex={0}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded-md"
                    />
                    <span className="text-white text-sm font-medium">
                      {movie.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter Button */}
          <button
            onClick={toggleFilterPopup}
            className="text-white p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200"
          >
            <FaFilter className="w-5 h-5" />
          </button>

          {/* Bot Icon */}
          <Bot
            onClick={handleBotClick}
            className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-all duration-200"
            title="AI Movie Finder"
          />

          {/* Profile */}
          <div className="relative">
            <div
              className="w-10 h-10 rounded-full cursor-pointer bg-blue-600 flex items-center justify-center text-white text-lg font-semibold hover:scale-105 transition-all duration-200"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              tabIndex={0}
            >
              {username[0]?.toUpperCase()}
            </div>
            {showProfileMenu && (
              <div className="absolute top-12 right-0 w-64 bg-gray-900/90 backdrop-blur-md text-white p-4 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.6)] border border-gray-700/50 animate-fade-in">
                <p className="text-base font-semibold">{username}</p>
                <p className="text-xs text-gray-300 truncate mt-1">
                  {user?.email}
                </p>
                <hr className="border-gray-700/50 my-3" />
                {!showUpdatePassword ? (
                  <>
                    <button
                      onClick={() => setShowUpdatePassword(true)}
                      className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all duration-200"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all duration-200 mt-2"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <form onSubmit={handleUpdatePassword} className="space-y-3">
                    <input
                      type="password"
                      placeholder="Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full p-2 bg-gray-800/70 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm"
                      required
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 bg-gray-800/70 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 mr-2 text-white"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            />
                          </svg>
                          Updating...
                        </>
                      ) : (
                        "Update"
                      )}
                    </button>
                    {successMessage && (
                      <p className="text-green-400 text-xs font-medium">
                        {successMessage}
                      </p>
                    )}
                    {error && (
                      <p className="text-red-400 text-xs font-medium">
                        {error}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setShowUpdatePassword(false);
                        setOldPassword("");
                        setNewPassword("");
                        setError("");
                        setSuccessMessage("");
                      }}
                      className="w-full text-gray-400 hover:text-gray-300 text-xs transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showFilterPopup && (
        <div
          ref={filterRef}
          className="absolute top-[60px] right-4 w-80 max-w-full bg-black/90 backdrop-blur-lg p-4 rounded-xl shadow-2xl z-50 animate-slide-down"
        >
          <FilterBar
            onApplyFilters={handleApplyFilters}
            onClose={() => setShowFilterPopup(false)}
          />
        </div>
      )}

      {showGptPopup && (
        <GptSearchPopup onClose={() => setShowGptPopup(false)} />
      )}
    </header>
  );
};

export default Header;


import React, { useState, useRef, useEffect, useCallback } from "react";
import { BG_IMG_URL } from "../utils/constants";
import Header from "./Header";
import { validate } from "./formValidation";
import { auth, googleProvider } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  sendEmailVerification,
  applyActionCode,
} from "firebase/auth";
import { useNavigate, useLocation } from "react-router";
import { useDispatch} from "react-redux";
import { addUser } from "../utils/userSlice";
import { FcGoogle } from "react-icons/fc";

// Custom hook for auth logic
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getErrorMessage = (error) => {
    console.error("Firebase error:", error.code, error.message);
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Email already registered.";
      case "auth/invalid-email":
        return "Invalid email format.";
      case "auth/weak-password":
        return "Password must be 6+ characters.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/user-not-found":
        return "No account found.";
      case "auth/too-many-requests":
        return "Too many attempts. Try later.";
      case "auth/expired-action-code":
        return "Link expired.";
      case "auth/invalid-action-code":
        return "Invalid link.";
      case "auth/requires-recent-login":
        return "Please sign in again to update profile.";
      case "auth/network-request-failed":
        return "Network error. Check your connection.";
      case "auth/operation-not-allowed":
        return "This operation is not enabled.";
      default:
        return `Error: ${error.message || "An unexpected error occurred."}`;
    }
  };

  return { dispatch, navigate, getErrorMessage };
};

const Login = () => {
  const [authState, setAuthState] = useState("signIn");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const email = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);
  const fullName = useRef(null);
  const resetEmail = useRef(null);
  const resetPassword = useRef(null);
  const resetConfirmPassword = useRef(null);

  const { dispatch, navigate, getErrorMessage } = useAuth();

  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const oobCode = query.get("oobCode");
  const mode = query.get("mode");

  const redirectUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://movielens-15165.web.app/";

  const clearInputs = useCallback(() => {
    const inputs = [
      email,
      password,
      confirmPassword,
      fullName,
      resetEmail,
      resetPassword,
      resetConfirmPassword,
    ];
    inputs.forEach((input) => {
      if (input.current) input.current.value = "";
    });
  }, []);
  /*
Handles Firebase email actions (email verification, password reset) based on URL query parameters (oobCode, mode).
Email Verification (mode === "verifyEmail"):
Calls applyActionCode to verify the user’s email using the oobCode.
On success: Sets isVerified to true, clears inputs, and shows a success message.
On failure: Shows an error and redirects to the sign-in page after 3 seconds.
Password Reset (mode === "resetPassword"):
Shows the password reset form (setShowResetPassword(true)).
Verifies the oobCode with verifyPasswordResetCode.
On failure: Shows an error and redirects to sign-in after 3 seconds.
Loading: Manages isLoading to disable UI during async operations
 */
  useEffect(() => {
    if (!oobCode || !mode) return;

    if (mode === "verifyEmail") {
      setIsLoading(true);
      applyActionCode(auth, oobCode)
        .then(() => {
          setIsVerified(true);
          setIsVerificationSent(false);
          setAuthState("signUp");
          setError("");
          setSuccessMessage("Email verified successfully!");
          clearInputs();
        })
        .catch((error) => {
          setError(getErrorMessage(error));
          setTimeout(() => {
            setAuthState("signIn");
            navigate("/");
          }, 3000);
        })
        .finally(() => setIsLoading(false));
    } else if (mode === "resetPassword") {
      setIsLoading(true);
      setShowResetPassword(true);
      setShowForgotPassword(false);
      setAuthState("signIn");
      setError("");
      setSuccessMessage("");
      clearInputs();
      verifyPasswordResetCode(auth, oobCode)
        .then(() => {})
        .catch((error) => {
          setError(getErrorMessage(error));
          setTimeout(() => {
            setShowResetPassword(false);
            setAuthState("signIn");
            navigate("/");
          }, 3000);
        })
        .finally(() => setIsLoading(false));
    }
  }, [oobCode, mode, navigate, getErrorMessage, clearInputs]);

  const toggleAuthState = () => {
    setAuthState(authState === "signIn" ? "signUp" : "signIn");
    setError("");
    setSuccessMessage("");
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setIsVerificationSent(false);
    setIsVerified(false);
    clearInputs();
  };

  const handleResendVerification = async () => {
    if (!auth.currentUser) {
      setError("No user is signed in. Please sign up again.");
      return;
    }
    setIsLoading(true);
    try {
      await sendEmailVerification(auth.currentUser, {
        url: `${redirectUrl}?mode=verifyEmail`,
      });
      setSuccessMessage("Verification email resent. Check your inbox or spam.");
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    const emailValue = resetEmail.current?.value;
    const { isValid, message } = validate(emailValue, "", "", false, true);

    if (!isValid) {
      setError(message);
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, emailValue, {
        url: redirectUrl,
      });
      setSuccessMessage("Check your email for the reset link.");
      clearInputs();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    const newPasswordValue = resetPassword.current?.value;
    const confirmPasswordValue = resetConfirmPassword.current?.value;

    const { isValid, message } = validate(
      "",
      newPasswordValue,
      confirmPasswordValue,
      false,
      true
    );
    if (!isValid) {
      setError(message);
      setIsLoading(false);
      return;
    }

    try {
      await verifyPasswordResetCode(auth, oobCode);
      await confirmPasswordReset(auth, oobCode, newPasswordValue);
      setSuccessMessage("Password reset successfully!");
      setTimeout(() => {
        setShowResetPassword(false);
        setAuthState("signIn");
        clearInputs();
        navigate("/");
      }, 2000);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      await setPersistence(auth, browserSessionPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      dispatch(
        addUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
        })
      );
      navigate("/browse");
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    const emailValue = email.current?.value;
    const passwordValue = password.current?.value;
    const confirmPasswordValue =
      authState === "signUp" ? confirmPassword.current?.value : "";

    const { isValid, message } = validate(
      emailValue,
      passwordValue,
      confirmPasswordValue,
      authState === "signUp"
    );

    if (!isValid) {
      setError(message);
      setIsLoading(false);
      return;
    }

    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      if (authState === "signUp") {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          emailValue,
          passwordValue
        );
        const user = userCredential.user;

        await sendEmailVerification(user, {
          url: `${redirectUrl}?mode=verifyEmail`,
        });

        setIsVerificationSent(true);
        setSuccessMessage("Check your email for verification.");
        clearInputs();
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          emailValue,
          passwordValue
        );
        const user = userCredential.user;
        dispatch(
          addUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "",
          })
        );
        navigate("/browse");
      }
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setAuthState("signIn");
    setSuccessMessage("");
    setError("");
    navigate("/");
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-900">
      <Header />
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${BG_IMG_URL})` }}
      />
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div
          key={authState}
          className="animate-fade-in bg-black/80 p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-md"
        >
          <h1 className="text-2xl sm:text-3xl text-white font-bold text-center mb-6">
            {authState === "signUp"
              ? isVerified
                ? "Verification"
                : isVerificationSent
                ? "Email Verification"
                : "Sign Up"
              : showForgotPassword
              ? "Forgot Password"
              : showResetPassword
              ? "Reset Password"
              : "Sign In"}
          </h1>
          {authState === "signUp" && isVerificationSent && !isVerified ? (
            <div className="animate-fade-in text-center text-white space-y-4">
              <p className="text-lg">Check your email for verification.</p>
              <p className="text-sm text-gray-400">
                Didn’t receive it? Check spam or{" "}
                <button
                  onClick={handleResendVerification}
                  className="text-red-500 hover:underline"
                  disabled={isLoading}
                >
                  resend
                </button>
                .
              </p>
              {successMessage && (
                <p className="text-green-500">{successMessage}</p>
              )}
              {error && <p className="text-red-500">{error}</p>}
            </div>
          ) : authState === "signUp" && isVerified ? (
            <div className="animate-fade-in text-center text-white space-y-4">
              <p className="text-lg">{successMessage}</p>
              <button
                onClick={handleContinue}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition animate-fade-in"
                disabled={isLoading}
              >
                Continue
              </button>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          ) : showResetPassword ? (
            <form
              onSubmit={handleResetPassword}
              className="animate-fade-in space-y-4"
            >
              <input
                ref={resetPassword}
                type="password"
                placeholder="New Password"
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <input
                ref={resetConfirmPassword}
                type="password"
                placeholder="Confirm New Password"
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
                  "Change Password"
                )}
              </button>
              {successMessage && (
                <p className="text-green-500 text-center">{successMessage}</p>
              )}
              {error && <p className="text-red-500 text-center">{error}</p>}
              <p className="text-center text-white mt-4">
                Remember password?{" "}
                <button
                  onClick={() => {
                    setShowResetPassword(false);
                    setAuthState("signIn");
                    setSuccessMessage("");
                    navigate("/");
                  }}
                  className="text-red-500 hover:underline"
                >
                  Sign In
                </button>
              </p>
            </form>
          ) : showForgotPassword ? (
            <form
              onSubmit={handleSendResetEmail}
              className="animate-fade-in space-y-4"
            >
              <input
                ref={resetEmail}
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : (
                  "Send Reset Link"
                )}
              </button>
              {successMessage && (
                <p className="text-green-500 text-center">{successMessage}</p>
              )}
              {error && <p className="text-red-500 text-center">{error}</p>}
              <p className="text-center text-white mt-4">
                Remember password?{" "}
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setAuthState("signIn");
                    setSuccessMessage("");
                  }}
                  className="text-red-500 hover:underline"
                >
                  Sign In
                </button>
              </p>
            </form>
          ) : (
            <form
              key="auth-form"
              onSubmit={handleSubmit}
              className="animate-fade-in space-y-4"
            >
              {authState === "signUp" && (
                <input
                  ref={fullName}
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              )}
              <input
                ref={email}
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <input
                ref={password}
                type="password"
                placeholder={
                  authState === "signUp" ? "Create Password" : "Password"
                }
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              {authState === "signUp" && (
                <input
                  ref={confirmPassword}
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              )}
              {authState === "signIn" && (
                <div className="flex justify-between items-center text-sm">
                  <label className="flex items-center text-white">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="mr-2 accent-red-500"
                    />
                    Remember Me
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setAuthState("signIn");
                      setError("");
                      setSuccessMessage("");
                    }}
                    className="text-white hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                ) : authState === "signUp" ? (
                  "Sign Up"
                ) : (
                  "Sign In"
                )}
              </button>
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-500" />
                <span className="px-3 text-white">or</span>
                <div className="flex-grow border-t border-gray-500" />
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white text-black py-2 rounded-md hover:bg-gray-100 transition flex items-center justify-center disabled:opacity-50"
              >
                <FcGoogle className="mr-2 text-lg" /> Continue with Google
              </button>
              {successMessage && (
                <p className="text-green-500 text-center">{successMessage}</p>
              )}
              {error && <p className="text-red-500 text-center">{error}</p>}
              <p className="text-center text-white mt-4 text-sm">
                {authState === "signUp"
                  ? "Already have an account?"
                  : "New to MovieLens?"}{" "}
                <button
                  onClick={toggleAuthState}
                  className="text-red-500 hover:underline"
                >
                  {authState === "signUp" ? "Sign In" : "Sign Up Now"}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;


import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useGetVideo from "../hooks/useGetVideo";
import useSelectMovie from "../hooks/useSelectMovie";
import useFetchMovies from "../hooks/useFetchMovies";
import useMyListMoviesFetch from "../hooks/useMyListMoviesFetch";
import useFetchFilteredMovies from "../hooks/useFetchFilteredMovies";
import {
  addNowPlayingMovies,
  addPopularMovies,
  addTopRatedMovies,
  clearFilteredMovies,
  restoreFilteredMovies,
} from "../utils/movieSlice";
import { clearFilters, restoreFilters } from "../utils/filterSlice";
import { clearGptMovies, restoreGptMovies } from "../utils/gptSlice";
import {
  Volume2,
  VolumeX,
  Info,
  MessageCircle,
  Loader,
} from "lucide-react";
import VideoBackground from "./VideoBackground";
import MoviePosters from "./MoviePosters";
import MovieDetails from "./MovieDetails";

const headerOffset = 60;
/**
The component uses several pieces of state, managed both locally and via Redux:

Local State:
isMuted: Boolean to toggle video audio (default: true).
showDetails: Boolean to show/hide the MovieDetails component.
currentPage: Tracks the current page for paginated filtered results.
showChatbot: Boolean to toggle the chatbot interface.
isChatbotLoading: Boolean to indicate if the chatbot iframe is loading.
Redux State (accessed via useSelector):
filters: Filter criteria (e.g., genre, language, country).
filteredMovies: List of movies matching the applied filters.
filteredTotalPages: Total pages for paginated filtered results.
gptMovies: Movies from AI-generated (GPT) queries.
gptLoading: Loading state for GPT queries.
nowPlaying, popular, topRated: Movie lists for respective categories.
myList: User's saved movie list.
selectedMovie: The currently selected movie (defaults to the first nowPlaying movie if none is selected).
videoData: Video data (e.g., trailer key) for the selected movie 
 */
const MainContainer = ({ showMyList }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showChatbot, setShowChatbot] = useState(false);
  const [isChatbotLoading, setIsChatbotLoading] = useState(true);
  const dispatch = useDispatch();

  const filters = useSelector((state) => state.filters);
  const filteredMovies = useSelector((state) => state.movies.filteredMovies);
  const filteredTotalPages = useSelector(
    (state) => state.movies.filteredTotalPages
  );
  const { loading: filteredLoading, error } = useFetchFilteredMovies(
    filters,
    currentPage
  );
  const { gptMovies, loading: gptLoading } = useSelector((s) => s.gpt);

  useEffect(() => {
    setShowDetails(false);
    setCurrentPage(1);
  }, [filters]);
  /** 
 * When showMyList is true:
Clears GPT movies, filtered movies, and filters to focus on the user's saved list.
When showMyList is false:
Restores GPT movies, filtered movies, and filters to return to the default view.
 */
  useEffect(() => {
    if (showMyList) {
      dispatch(clearGptMovies());
      dispatch(clearFilteredMovies());
      dispatch(clearFilters());
    } else {
      dispatch(restoreGptMovies());
      dispatch(restoreFilteredMovies());
      dispatch(restoreFilters());
    }
  }, [showMyList, dispatch]);

  useFetchMovies("now_playing", addNowPlayingMovies);
  useFetchMovies("popular", addPopularMovies);
  useFetchMovies("top_rated", addTopRatedMovies);

  const { loading: myListLoading } = useMyListMoviesFetch(
    showMyList ? 1 : null
  );

  const nowPlaying = useSelector((s) => s.movies.nowPlayingMovies);
  const popular = useSelector((s) => s.movies.popularMovies);
  const topRated = useSelector((s) => s.movies.topRatedMovies);
  const myList = useSelector((s) => s.movies.myListMovies);

  const selectedMovie = useSelector(
    (s) => s.select.selectedMovie || nowPlaying?.[0]
  );

  const handleMoreInfoClick = () => {
    if (selectedMovie) setShowDetails((p) => !p);
  };

  useGetVideo(selectedMovie?.id, selectedMovie?.title || selectedMovie?.name);
  const videoData = useSelector((s) => s.select.selectVideo);
  const selectMovie = useSelectMovie();

  const isFiltered =
    filters &&
    (filters.with_genres ||
      filters.with_original_language ||
      filters.with_origin_country);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= filteredTotalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle iframe load and errors
  const handleIframeLoad = () => {
    setIsChatbotLoading(false);
  };


  return (
    <div className="absolute w-[100vw] h-[100vh] overflow-hidden flex flex-col">
      <div
        className="absolute left-0 w-full h-[50vh] md:h-[100vh]"
        style={{ top: `${headerOffset}px` }}
      >
        <VideoBackground
          videoKey={videoData?.key}
          isMuted={isMuted}
          selectedMovie={selectedMovie}
        />
      </div>

      <div
        className="absolute left-0 bg-black bg-opacity-50 z-10 flex flex-col p-4 md:p-6 w-full"
        style={{ top: `calc(50vh + ${headerOffset}px)` }}
      >
        <div className="flex items-center gap-6 text-white mb-4">
          <h1 className="text-xl md:text-3xl font-bold">
            {selectedMovie?.title || "No Title"}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={handleMoreInfoClick}
              className="bg-gray-700 text-white px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-gray-600"
              aria-label="More Information"
            >
              <Info size={18} />
              <span className="hidden md:inline">More Info</span>
            </button>
            <button
              onClick={() => setIsMuted((m) => !m)}
              className="bg-gray-700 text-white px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-gray-600"
              aria-label={isMuted ? "Unmute Video" : "Mute Video"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>

        <div className="h-[40vh] overflow-y-auto no-scrollbar p-2">
          {showMyList ? (
            <>
              {gptMovies && (
                <p className="text-white text-center mb-4">
                  Go to home page for GPT queried movies
                </p>
              )}
              {isFiltered && (
                <p className="text-white text-center mb-4">
                  Go to home page and try applying filters again, since it's
                  only dedicated to My List movies
                </p>
              )}
              {gptMovies && isFiltered && (
                <p className="text-white text-center mb-4">
                  This page is dedicated to your GPT query results. Go to Home
                  to apply filters.
                </p>
              )}
              {myListLoading ? (
                <MoviePosters
                  categoryLabel="My List"
                  category="my_list"
                  isMyList
                  onSelect={selectMovie}
                  loading={true}
                />
              ) : myList?.length > 0 ? (
                <MoviePosters
                  categoryLabel="My List"
                  category="my_list"
                  isMyList
                  onSelect={selectMovie}
                  loading={false}
                  movies={myList}
                />
              ) : (
                <p className="text-white text-center mt-10">
                  No movies in your list yet.
                </p>
              )}
            </>
          ) : (
            <>
              {isFiltered && (
                <button
                  onClick={() => {
                    dispatch(clearFilters());
                    dispatch(clearFilteredMovies());
                  }}
                  className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 mb-4"
                  aria-label="Clear Filters"
                >
                  Clear Filters
                </button>
              )}
              {gptMovies && (
                <button
                  onClick={() => dispatch(clearGptMovies())}
                  className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 mb-4 ml-2"
                  aria-label="Clear Recent Query"
                >
                  Clear Recent Query
                </button>
              )}
              {gptMovies ? (
                <>
                  {gptLoading ? (
                    <MoviePosters
                      categoryLabel="Based on Recent Query"
                      category="gpt"
                      onSelect={selectMovie}
                      loading={true}
                    />
                  ) : (
                    <MoviePosters
                      categoryLabel="Based on Recent Query"
                      category="gpt"
                      onSelect={selectMovie}
                      loading={false}
                      movies={gptMovies}
                    />
                  )}
                </>
              ) : isFiltered ? (
                filteredLoading ? (
                  <MoviePosters
                    categoryLabel="Filtered Results"
                    category="filtered"
                    onSelect={selectMovie}
                    loading={true}
                    page={currentPage}
                    onPageChange={handlePageChange}
                  />
                ) : error ? (
                  <p className="text-white text-center mt-10">{error}</p>
                ) : filteredMovies.length > 0 ? (
                  <>
                    <MoviePosters
                      categoryLabel="Filtered Results"
                      category="filtered"
                      onSelect={selectMovie}
                      loading={false}
                      page={currentPage}
                      onPageChange={handlePageChange}
                      totalPages={filteredTotalPages}
                    />
                    {filteredTotalPages > 1 && (
                      <div className="flex justify-center gap-4 mt-4">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-600"
                          aria-label="Previous Page"
                        >
                          Previous
                        </button>
                        <span className="text-white self-center">
                          Page {currentPage} of {filteredTotalPages}
                        </span>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === filteredTotalPages}
                          className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-600"
                          aria-label="Next Page"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-white text-center mt-10">
                    No movies match your filters. Try different filters.
                  </p>
                )
              ) : (
                <>
                  <MoviePosters
                    categoryLabel="Now Playing"
                    category="now_playing"
                    onSelect={selectMovie}
                    loading={!nowPlaying?.length}
                    movies={nowPlaying}
                  />
                  <MoviePosters
                    categoryLabel="Popular"
                    category="popular"
                    onSelect={selectMovie}
                    loading={!popular?.length}
                    movies={popular}
                  />
                  <MoviePosters
                    categoryLabel="Top Rated"
                    category="top_rated"
                    onSelect={selectMovie}
                    loading={!topRated?.length}
                    movies={topRated}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>

      {showDetails && selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setShowDetails(false)}
        />
      )}

      {/* Support Icon */}
      <button
        onClick={() => {
          setShowChatbot(!showChatbot);
          if (!showChatbot) {
            setIsChatbotLoading(true);
          }
        }}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        title="Support Chat"
        aria-label="Toggle Support Chatbot"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chatbot Section */}
      {showChatbot && (
        <div
          className="fixed bottom-16 right-4 w-full max-w-md h-[70vh] bg-gray-900 bg-opacity-95 rounded-lg shadow-2xl z-50 flex flex-col border border-gray-700/50 backdrop-blur-md animate-slide-up focus:outline-none"
          tabIndex={0}
          aria-label="Support Chatbot Window"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800/50">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">
                MovieLens GPT Support
              </h3>
            </div>
            <button
              onClick={() => setShowChatbot(false)}
              className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close chatbot"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="relative flex-1">
            {isChatbotLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                <Loader className="w-8 h-8 text-blue-400 animate-spin" />
                <span className="ml-2 text-white">Loading Chatbot...</span>
              </div>
            )}
            <iframe
              src="https://movielens-chatbot.streamlit.app/?embedded=true"
              className="w-full h-full rounded-b-lg"
              title="MovieLens GPT Chatbot"
              allow="clipboard-write"
              onLoad={handleIframeLoad}
              style={{
                display: isChatbotLoading ? "none" : "block",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContainer;


// src/components/MovieDetails.js
import React, { useRef, useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import validator from "validator";
import { addToMyList, removeFromMyList } from "../utils/movieSlice";
import { TMDB_BASE_URL, options } from "../utils/constants";
import useMyListMoviesFetch from "../hooks/useMyListMoviesFetch";

const MovieDetails = ({ movie, onClose }) => {
  const detailsRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const myListMovies = useSelector((store) => store.movies.myListMovies);
  useMyListMoviesFetch();

  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [extendedDetails, setExtendedDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [credits, setCredits] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(null);

  const movieId = movie?.id;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!movieId) return;

    const fetchExtendedData = async () => {
      setLoading(true);
      try {
        const detailsUrl = `${TMDB_BASE_URL}/movie/${movieId}?language=en-US`;
        const imagesUrl = `${TMDB_BASE_URL}/movie/${movieId}/images`;
        const creditsUrl = `${TMDB_BASE_URL}/movie/${movieId}/credits?language=en-US`;
        const reviewsUrl = `${TMDB_BASE_URL}/movie/${movieId}/reviews?language=en-US&page=1`;

        const responses = await Promise.all([
          fetch(detailsUrl, options),
          fetch(imagesUrl, options),
          fetch(creditsUrl, options),
          fetch(reviewsUrl, options),
        ]);

        const [detailsData, imagesData, creditsData, reviewsData] =
          await Promise.all(responses.map((res) => res.json()));

        setExtendedDetails(detailsData);
        setImages(imagesData.backdrops || []);
        setCredits(creditsData);
        setReviews(reviewsData.results || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExtendedData();
  }, [movieId]);

  const isMovieInList = useCallback(() => {
    return (
      Array.isArray(myListMovies) &&
      myListMovies.some((m) => m.id === movie?.id)
    );
  }, [myListMovies, movie]);

  const handleAddToList = async () => {
    if (
      !user ||
      !user.email ||
      !validator.isEmail(user.email) ||
      !movie?.id ||
      !movie?.title
    )
      return;

    setIsLoading(true);
    try {
      const movieData = {
        id: Number(movie.id),
        title: String(movie.title),
        poster_path: movie.poster_path || "",
        overview: movie.overview || "",
        release_date: movie.release_date || "",
      };

      await axios.post("https://movielens-gpt.onrender.com/api/mylist", {
        email: user.email,
        movie: movieData,
      });
      dispatch(addToMyList(movieData));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromList = async () => {
    if (!user || !user.email || !validator.isEmail(user.email) || !movie?.id)
      return;

    setIsLoading(true);
    try {
      await axios.delete(
        `https://movielens-gpt.onrender.com/api/mylist/${encodeURIComponent(
          user.email
        )}/${movie.id}`
      );
      dispatch(removeFromMyList(movie.id));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <div className="bg-black bg-opacity-80 text-white p-6 rounded-lg flex items-center">
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Loading movie details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <div className="bg-black bg-opacity-80 text-white p-6 rounded-lg">
          Error loading movie details. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <style>
        {`
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div
        ref={detailsRef}
        className="relative w-full max-w-2xl bg-black bg-opacity-80 p-6 rounded-xl text-white shadow-2xl backdrop-blur-lg overflow-y-auto max-h-[90vh] no-scrollbar"
      >
        <div className="flex flex-col gap-4">
          {extendedDetails?.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${extendedDetails.poster_path}`}
              alt={extendedDetails.title}
              className="w-48 mx-auto rounded-lg object-cover shadow-lg"
            />
          )}
          <div>
            <h2 className="text-3xl font-bold mb-2 text-center">
              {extendedDetails?.title || movie?.title || "Movie Title"}
            </h2>
            {extendedDetails?.overview && (
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                {extendedDetails.overview}
              </p>
            )}
            <div className="text-sm text-gray-300 mb-4">
              <p>
                <strong>Release Date:</strong>{" "}
                {extendedDetails?.release_date || "N/A"}
              </p>
              <p>
                <strong>Rating:</strong>{" "}
                {extendedDetails?.vote_average?.toFixed(1) || "N/A"} (
                {extendedDetails?.vote_count || 0} votes)
              </p>
              <p>
                <strong>Genres:</strong>{" "}
                {extendedDetails?.genres?.map((g) => g.name).join(", ") ||
                  "N/A"}
              </p>
              <p>
                <strong>Runtime:</strong>{" "}
                {extendedDetails?.runtime
                  ? `${Math.floor(extendedDetails.runtime / 60)}h ${
                      extendedDetails.runtime % 60
                    }m`
                  : "N/A"}
              </p>
            </div>
            <button
              className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-transform transform flex items-center justify-center mb-2 ${
                isMovieInList()
                  ? "bg-red-600 hover:bg-red-700 hover:scale-105"
                  : "bg-green-600 hover:bg-green-700 hover:scale-105"
              } ${
                !user?.email || !validator.isEmail(user.email) || isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={isMovieInList() ? handleRemoveFromList : handleAddToList}
              disabled={
                !user?.email || !validator.isEmail(user.email) || isLoading
              }
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Loading...
                </div>
              ) : isMovieInList() ? (
                "Remove from My List"
              ) : (
                "Add to My List"
              )}
            </button>
            {!showMore && (
              <button
                onClick={() => setShowMore(true)}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition-transform transform hover:scale-105"
              >
                Show More Details
              </button>
            )}
          </div>
        </div>

        {showMore && (
          <div className="mt-6 space-y-6">
            {images.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Images</h3>
                <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                      alt={`Slide ${idx + 1}`}
                      className="w-32 h-20 object-cover rounded-lg flex-shrink-0 shadow-md"
                    />
                  ))}
                </div>
              </div>
            )}
            {credits?.cast && (
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Cast</h3>
                <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
                  {credits.cast.map((member) => (
                    <div
                      key={member.id}
                      className="flex flex-col items-center text-center flex-shrink-0 w-20"
                    >
                      {member.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${member.profile_path}`}
                          alt={member.name}
                          className="w-16 h-16 rounded-full object-cover shadow-md"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-300">
                          No Image
                        </div>
                      )}
                      <p className="text-xs mt-1 text-gray-300 truncate w-full">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate w-full">
                        {member.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {reviews.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Reviews</h3>
                <div className="space-y-2">
                  {reviews.slice(0, 2).map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-800 bg-opacity-80 p-3 rounded-lg shadow-md"
                    >
                      <p className="font-semibold text-white">
                        {review.author}
                      </p>
                      <p className="text-xs text-gray-300 mt-1">
                        {review.content.length > 150
                          ? `${review.content.substring(0, 150)}...`
                          : review.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;


// src/components/MoviePosters.js
import React, { useState, useEffect } from "react";
import { ArrowRightCircle } from "lucide-react";
import { useSelector } from "react-redux";
import useFetchMovies from "../hooks/useFetchMovies";
import useMyListMoviesFetch from "../hooks/useMyListMoviesFetch";
import {
  addNowPlayingMovies,
  addPopularMovies,
  addTopRatedMovies,
} from "../utils/movieSlice";

const MoviePosters = ({
  onSelect,
  categoryLabel,
  category,
  isMyList,
  loading,
  page,
  onPageChange,
  totalPages: propTotalPages,
}) => {
  const [localPage, setLocalPage] = useState(1);

  const movies = useSelector((store) => {
    if (isMyList) return store.movies.myListMovies;
    if (category === "gpt") return store.gpt.gptMovies;
    if (category === "filtered") return store.movies.filteredMovies;
    switch (category) {
      case "now_playing":
        return store.movies.nowPlayingMovies;
      case "popular":
        return store.movies.popularMovies;
      case "top_rated":
        return store.movies.topRatedMovies;
      default:
        return [];
    }
  });

  const filteredTotalPages = useSelector(
    (store) => store.movies.filteredTotalPages
  );

  const actionCreators = {
    now_playing: addNowPlayingMovies,
    popular: addPopularMovies,
    top_rated: addTopRatedMovies,
  };

  const { totalPages: stdTotal } = useFetchMovies(
    category && actionCreators[category] ? category : null,
    actionCreators[category],
    localPage
  );

  const { totalPages: myTotal } = useMyListMoviesFetch(
    isMyList ? localPage : null
  );

  const effectiveTotal = isMyList
    ? myTotal
    : category === "filtered"
    ? filteredTotalPages
    : stdTotal;

  const currentPage = category === "filtered" ? page : localPage;

  useEffect(() => {
    if (category !== "filtered") {
      setLocalPage(1);
    }
  }, [category, isMyList]);
  /**
 * Prepares the movie list for display by removing duplicates and filtering out movies without posters.
Logic:
movies?.map((m) => [m.id, m]): Creates an array of [id, movie] pairs.
new Map(...): Converts the array to a Map, automatically removing duplicates based on m.id.
Array.from(...).values(): Converts the Map back to an array of movie objects.
.filter((m) => m?.poster_path): Excludes movies without a poster_path to ensure only valid posters are displayed.
 */
  const display = Array.from(
    new Map(movies?.map((m) => [m.id, m])).values()
  ).filter((m) => m?.poster_path);

  const handleWheel = (e) => {
    e.currentTarget.scrollLeft += e.deltaY;
  };

  const handleNextPage = () => {
    if (currentPage < effectiveTotal) {
      if (category === "filtered" && onPageChange) {
        onPageChange(currentPage + 1);
      } else {
        setLocalPage((p) => p + 1);
      }
    }
  };

  const getPosterHalfHeight = () => {
    return window.innerWidth >= 768 ? 180 / 3 : 150 / 3;
  };

  return (
    <div className="flex flex-col gap-4 mt-4 relative">
      <h2 className="text-white text-xl md:text-2xl font-bold">
        {categoryLabel}
      </h2>
      <div
        className="relative mb- flex items-center"
        style={{ marginBottom: `${getPosterHalfHeight()}px` }}
      >
        <div
          className="flex flex-nowrap overflow-x-auto overflow-y-hidden no-scrollbar p-2 mb-3 gap-8"
          onWheel={handleWheel}
        >
          {loading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="w-[100px] h-[150px] md:w-[120px] md:h-[180px] bg-gray-700 rounded-lg animate-pulse"
              />
            ))
          ) : display.length > 0 ? (
            display.map((movie) => (
              <img
                key={movie.id}
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title || "Movie Poster"}
                className="cursor-pointer w-[100px] h-[150px] md:w-[120px] md:h-[180px] rounded-lg hover:scale-110 transition-transform"
                onClick={() => onSelect(movie)}
              />
            ))
          ) : (
            <p className="text-white">No movies available</p>
          )}
          {currentPage < effectiveTotal && !loading && (
            <button
              className="flex items-center justify-center w-[100px] h-[150px]"
              onClick={handleNextPage}
            >
              <ArrowRightCircle
                size={32}
                className="text-white hover:scale-110 transition-transform"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviePosters;


// src/components/VideoBackground.jsx
import { useEffect, useState } from "react";

const VideoBackground = ({ videoKey, isMuted, selectedMovie }) => {
  const [reloadCounter, setReloadCounter] = useState(0);

  useEffect(() => {
    if (videoKey) {
      const timer = setTimeout(() => {
        setReloadCounter((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [videoKey]);

  if (!videoKey) {
    return selectedMovie?.backdrop_path ? (
      <img
        src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`}
        alt="Movie Backdrop"
        className="absolute top-1/2 left-1/2 w-[200vw] h-[200vh] object-cover transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />
    ) : (
      <div className="absolute top-1/2 left-1/2 w-[200vw] h-[200vh] bg-black flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        No Trailer Available
      </div>
    );
  }

  return (
    <iframe
      key={`${videoKey}-${isMuted}-${reloadCounter}`}
      className="absolute top-1/2 left-1/2 w-[200vw] h-[200vh] md:w-[150vw] md:h-[150vh] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      title="Movie Trailer"
      src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&loop=1&playlist=${videoKey}&mute=${
        isMuted ? 1 : 0
      }&start=7&controls=0&rel=0&modestbranding=1&enablejsapi=1`}
      allow="autoplay; encrypted-media"
      allowFullScreen
    />
  );
};

export default VideoBackground;


import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  appendFilteredMovies,
  setFilteredTotalPages,
  clearFilteredMovies,
} from "../utils/movieSlice";
import { TMDB_BASE_URL, options } from "../utils/constants";

const useFetchFilteredMovies = (filters, page = 1) => {
  /**
   * loading: Tracks whether the API request is in progress.
error: Stores error messages if the request fails.
dispatch: Redux dispatch function to trigger actions.
filteredMovies: Retrieves the current list of filtered movies from the Redux store.
prevFiltersRef: A useRef to store the previous value of filters to detect changes.
loadedPagesRef: A useRef containing a Set to track which pages have already been fetched.
filteredLength: The length of the filteredMovies array, used to check if movies are already loaded.
   */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const filteredMovies = useSelector((state) => state.movies.filteredMovies);
  const prevFiltersRef = useRef(filters);
  const loadedPagesRef = useRef(new Set());

  const filteredLength = filteredMovies.length;

  useEffect(() => {
    const isFiltersEmpty =
      !filters ||
      (!filters.with_genres &&
        !filters.with_original_language &&
        !filters.with_origin_country);

    const filtersChanged =
      JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);
    /**
 * Case 1: If filters haven't changed, movies are already loaded (filteredLength > 0), and the requested page has been fetched (loadedPagesRef.current.has(page)), skip fetching and exit.
Case 2: If no filters are applied (isFiltersEmpty) and no movies are loaded (filteredLength === 0), clear the movies, reset the loaded pages, and exit.
Case 3: If filters haven't changed and the page was already fetched, skip fetching and exit.
 */
    if (filtersChanged) {
      dispatch(clearFilteredMovies());
      loadedPagesRef.current.clear();
      prevFiltersRef.current = filters;
    }

    if (
      !filtersChanged &&
      filteredLength > 0 &&
      loadedPagesRef.current.has(page)
    ) {
      setLoading(false);
      return;
    }

    if (isFiltersEmpty && filteredLength === 0) {
      dispatch(clearFilteredMovies());
      loadedPagesRef.current.clear();
      setLoading(false);
      setError(null);
      return;
    }

    if (!filtersChanged && loadedPagesRef.current.has(page)) {
      setLoading(false);
      return;
    }

    const fetchFiltered = async () => {
      setLoading(true);
      setError(null);
      try {
        const discoverParams = {
          include_adult: false,
          include_video: false,
          page,
          sort_by: "popularity.desc",
          with_genres: filters.with_genres || undefined,
          with_origin_country: filters.with_origin_country || undefined,
          with_original_language: filters.with_original_language || undefined,
        };

        const discoverResponse = await axios.get(
          `${TMDB_BASE_URL}/discover/movie`,
          {
            ...options,
            params: discoverParams,
          }
        );

        dispatch(appendFilteredMovies(discoverResponse.data.results || []));
        dispatch(setFilteredTotalPages(discoverResponse.data.total_pages || 1));
        loadedPagesRef.current.add(page);
      } catch (err) {
        setError(
          err.response?.status === 401
            ? "Invalid Bearer token. Check REACT_APP_BEARER_TOKEN."
            : "Failed to fetch movies. Try again later."
        );
        dispatch(clearFilteredMovies());
        loadedPagesRef.current.clear();
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [filters, page, dispatch, filteredLength]);

  return { loading, error };
};

export default useFetchFilteredMovies;


// src/hooks/useFetchMovies.js
import { useDispatch } from "react-redux";
import { useEffect, useRef, useCallback } from "react";
import { TMDB_BASE_URL, options } from "../utils/constants"; // Updated import
/**
Memoizes getMovies to prevent recreation on every render, ensuring stability in the useEffect dependency array that calls it.
Dependencies: [category, page, dispatch, actionCreator]. The function is recreated only if these change.
Validation:
if (!category || fetchedPages.current.has(page)): Skips fetching if:
category is falsy (e.g., null, ensures no invalid requests).
The page has already been fetched (checked via fetchedPages).
Returns totalPagesRef.current early to maintain consistency.
API Call:
Uses fetch to request movies from:
`${TMDB_BASE_URL}/movie/${category}?language=en-US&page=${page}`
Example: https://api.themoviedb.org/3/movie/popular?language=en-US&page=1.
options: Includes API key and headers (defined in constants.js).
Parses the response as JSON, expecting:
results: An array of movie objects (e.g., { id, title, poster_path, ... }).
total_pages: The total number of pages available.
Success Handling:
Dispatches actionCreator(json.results) to store movies in Redux (e.g., addPopularMovies).
Adds the fetched page to fetchedPages.current to prevent refetching.
Updates totalPagesRef.current with json.total_pages.
Returns json.total_pages for the caller (though not used in the hook’s return).
 */
const useFetchMovies = (category, actionCreator, page = 1) => {
  const dispatch = useDispatch();
  const fetchedPages = useRef(new Set());
  const totalPagesRef = useRef(1);

  const getMovies = useCallback(async () => {
    if (!category || fetchedPages.current.has(page))
      return totalPagesRef.current;
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${category}?language=en-US&page=${page}`,
        options
      );
      const json = await response.json();
      dispatch(actionCreator(json.results));
      fetchedPages.current.add(page);
      totalPagesRef.current = json.total_pages;
      return json.total_pages;
    } catch (error) {
      return totalPagesRef.current;
    }
  }, [category, page, dispatch, actionCreator]);

  useEffect(() => {
    if (page && category && !fetchedPages.current.has(page)) {
      getMovies();
    }
  }, [getMovies, category, page]);

  useEffect(() => {
    fetchedPages.current.clear();
    totalPagesRef.current = 1;
  }, [category]);

  return { getMovies, totalPages: totalPagesRef.current };
};

export default useFetchMovies;


// src/hooks/useGetVideo.js
import { useDispatch } from "react-redux";
import { TMDB_BASE_URL, options } from "../utils/constants"; // Updated import
import { setSelectVideo } from "../utils/selectSlice";
import { useEffect } from "react";

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

const useGetVideo = (movieId, movieName, releaseYear) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVideo = async () => {
      if (!movieId && !movieName) {
        return;
      }

      try {
        let trailerVideo = null;

        if (movieId) {
          const res = await fetch(
            `${TMDB_BASE_URL}/movie/${movieId}/videos?language=en-US`,
            options
          );
          const json = await res.json();
          const video = json.results.find((v) => v.type === "Trailer");

          if (video) {
            trailerVideo = {
              key: video.key,
              id: video.id,
              source: "TMDB",
              type: "Trailer",
            };
          }
        }

        if (!trailerVideo && movieName && YOUTUBE_API_KEY) {
          const query = `${movieName} ${releaseYear || ""} Official Trailer`;
          const youtubeRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
              query
            )}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`
          );
          const ytJson = await youtubeRes.json();
          const videoId = ytJson.items?.[0]?.id?.videoId;

          if (videoId) {
            trailerVideo = {
              key: videoId,
              id: videoId,
              source: "YouTube",
              type: "Trailer",
            };
          } else {
          }
        }

        if (trailerVideo) {
          dispatch(setSelectVideo(trailerVideo));
        } else {
        }
      } catch (err) {
      }
    };

    fetchVideo();
  }, [movieId, movieName, releaseYear, dispatch]);
};

export default useGetVideo;


// src/hooks/useGptResponse.js
import { useDispatch } from "react-redux";
import openai from "../utils/openai";
import { setGptMovies } from "../utils/gptSlice";
import { TMDB_BASE_URL, options } from "../utils/constants"; // Updated import
import languages from "../utils/languages.json";
import countries from "../utils/countries.json";
/**
Processes a user’s search query (e.g., "Telugu movies 2023") using a GPT model to generate a list of movie details (title, year, language, region), then fetches detailed movie data from TMDB based on those details.
 */
const useGptResponse = () => {
  const dispatch = useDispatch();
  let abortController = null;
  let movieCache = new Map();

  const fetchGptMovies = async (query) => {
    /**
 * 
Cancels any ongoing API requests before starting a new one to prevent race conditions.
Logic:
If an abortController exists, calls abort() to cancel previous requests.
Creates a new AbortController and extracts its signal for use in fetch requests. 
 */
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();
    const signal = abortController.signal;

    dispatch(setGptMovies({ movies: [], loading: true }));

    if (!openai) {
      dispatch(setGptMovies({ movies: [], loading: false }));
      return null;
    }

    try {
      const chatCompletion = await openai.chat.completions.create(
        {
          messages: [
            {
              role: "user",
              content: `Suggest a list of movie details based on this query: "${query}". 
Respond in JSON format as an array of objects with keys "title", "year", "language", and "region". 
Use full English names for "language" (e.g., "Telugu") and "region" (e.g., "India"). Include all movies relevant to the query.`,
            },
          ],
          model: "llama-3.3-70b-versatile",
        },
        { signal }
      );

      const gptResponseText =
        chatCompletion.choices[0]?.message?.content || "[]";
      /** Removes Markdown code fences (json` and ) and trims whitespace.
Parses the cleaned text as JSON.
Validates that the result is an array; otherwise, throws an error.
On error, clears movies, stops loading, and returns null. */
      let movieDetailsList = [];
      try {
        const cleanedResponse = gptResponseText
          .replace(/```json\n?|```/g, "")
          .trim();
        movieDetailsList = JSON.parse(cleanedResponse);
        if (!Array.isArray(movieDetailsList))
          throw new Error("Parsed data is not an array");
      } catch (err) {
        dispatch(setGptMovies({ movies: [], loading: false }));
        return null;
      }

      const moviePromises = movieDetailsList.map(async (movie) => {
        const { title, year, language: langName, region: countryName } = movie;

        const languageObj = languages.find(
          (lang) => lang.english_name.toLowerCase() === langName?.toLowerCase()
        );
        const languageCode = languageObj ? languageObj.iso_639_1 : "en";

        const countryObj = countries.find(
          (country) =>
            country.english_name.toLowerCase() === countryName?.toLowerCase()
        );
        const regionCode = countryObj ? countryObj.iso_3166_1 : undefined;

        const cacheKey = `${title}|${year}|${languageCode}|${regionCode}`;

        if (movieCache.has(cacheKey)) {
          return movieCache.get(cacheKey);
        }

        const searchParams = new URLSearchParams({
          query: title,
          include_adult: "false",
          language: languageCode,
          page: "1",
          ...(regionCode && { region: regionCode }),
          ...(year && { year: String(year) }),
        });

        const url = `${TMDB_BASE_URL}/search/movie?${searchParams.toString()}`;

        try {
          const searchResponse = await fetch(url, { ...options, signal });
          const searchData = await searchResponse.json();

          let movieResult = null;
          for (const result of searchData.results || []) {
            if (!result.id) continue;

            const detailsUrl = `${TMDB_BASE_URL}/movie/${result.id}?language=${languageCode}`;
            const detailsResponse = await fetch(detailsUrl, {
              ...options,
              signal,
            });
            const movieDetails = await detailsResponse.json();

            const isLanguageMatch =
              languageCode === "en" ||
              movieDetails.original_language === languageCode;

            const isRegionMatch =
              !regionCode ||
              (movieDetails.production_countries || []).some(
                (c) => c.iso_3166_1 === regionCode
              );

            const releaseYear = movieDetails.release_date
              ? new Date(movieDetails.release_date).getFullYear()
              : null;
            const isYearMatch =
              !year ||
              !releaseYear ||
              Math.abs(releaseYear - parseInt(year)) <= 1;

            if (
              isLanguageMatch &&
              isRegionMatch &&
              isYearMatch &&
              movieDetails.poster_path
            ) {
              movieResult = movieDetails;
              break;
            }
          }

          if (movieResult) {
            movieCache.set(cacheKey, movieResult);
            return movieResult;
          }

          return null;
        } catch (fetchErr) {
          if (fetchErr.name !== "AbortError") {
            return null;
          }
          return null;
        }
      });

      const movies = (await Promise.all(moviePromises)).filter(
        (movie) => movie && movie.poster_path
      );

      dispatch(setGptMovies({ movies, loading: false }));
      return movies;
    } catch (error) {
      if (error.name !== "AbortError") {
        dispatch(setGptMovies({ movies: [], loading: false }));
        return null;
      }
      dispatch(setGptMovies({ movies: [], loading: false }));
      return null;
    }
  };

  return { fetchGptMovies };
};

export default useGptResponse;


import { useDispatch, useSelector } from "react-redux";
import { useEffect, useCallback, useRef, useState } from "react";
import axios from "axios";
import validator from "validator";
import { appendMyListMovies, setMyListTotalPages } from "../utils/movieSlice";

const useMyListMoviesFetch = (page = 1) => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const fetchedPages = useRef(new Set());
  const totalPagesRef = useRef(1);
  const [loading, setLoading] = useState(false);
  /**
   * useCallback is a React hook that memoizes a function, ensuring that the same function instance is returned across renders unless its dependencies change. This is useful for preventing unnecessary re-creation of functions, which can improve performance in scenarios where functions are passed as props or used in dependency arrays.
   */
  const getMyListMovies = useCallback(async () => {
    if (
      !user ||
      !user.email ||
      !validator.isEmail(user.email) ||
      fetchedPages.current.has(page)
    ) {
      return totalPagesRef.current;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://movielens-gpt.onrender.com/api/mylist/${encodeURIComponent(
          user.email
        )}?page=${page}&limit=10`
      );
      dispatch(appendMyListMovies(response.data.movies || []));

      /**
       * When fetching paginated data, the backend API (https://movielens-gpt.onrender.com/api/mylist/{email}?page=${page}&limit=10) returns a response containing:
movies: An array of movie objects for the requested page.
totalPages: The total number of pages available for the user’s movie list, based on the total number of movies and the limit=10 parameter.
The totalPages value is typically calculated by the backend based on the entire dataset (e.g., total movies divided by 10, rounded up). This value is most reliable when fetching the first page because:
The first page request provides a complete view of the dataset’s size.
       */
      if (page === 1) {
        totalPagesRef.current = response.data.totalPages || 1;
        dispatch(setMyListTotalPages(response.data.totalPages || 1));
      }
      fetchedPages.current.add(page);
      setLoading(false);
      return response.data.totalPages || 1;
    } catch (error) {
      setLoading(false);
      return totalPagesRef.current;
    }
  }, [user, page, dispatch]);

  useEffect(() => {
    if (page && user?.email && validator.isEmail(user.email)) {
      getMyListMovies();
    }
  }, [getMyListMovies, page, user?.email]);

  useEffect(() => {
    fetchedPages.current.clear();
    totalPagesRef.current = 1;
  }, [user?.email]);

  return { totalPages: totalPagesRef.current, loading };
};

export default useMyListMoviesFetch;


import useFetchMovies from "../hooks/useFetchMovies";
import { addNowPlayingMovies } from "../utils/movieSlice";

const useNowPlayingMovies = (page) =>
  useFetchMovies("now_playing", addNowPlayingMovies, page);
export default useNowPlayingMovies;


import useFetchMovies from "../hooks/useFetchMovies";
import { addPopularMovies } from "../utils/movieSlice";

const usePopularMovies = (page) =>
  useFetchMovies("popular", addPopularMovies, page);
export default usePopularMovies;

// src/hooks/useSearchMovie.js
import { useDispatch } from "react-redux";
import { searchMovie } from "../utils/searchSlice";
import { TMDB_BASE_URL, options } from "../utils/constants"; // Updated import

const useSearchMovie = (query, setSearchResults) => {
  const dispatch = useDispatch();

  const fetchMovies = async () => {
    if (!query) {
      setSearchResults([]);
      dispatch(searchMovie(null));
      return;
    }

    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?query=${query}`,
        options
      );
      const data = await response.json();

      if (data.results?.length) {
        const filteredResults = data.results.filter(
          (movie) =>
            movie.title?.toLowerCase().startsWith(query.toLowerCase()) &&
            movie.poster_path
        );
        setSearchResults(filteredResults);
        dispatch(searchMovie(filteredResults));
      } else {
        setSearchResults([]);
        dispatch(searchMovie(null));
      }
    } catch (error) {
      setSearchResults([]);
      dispatch(searchMovie(null));
    }
  };

  return { fetchMovies };
};

export default useSearchMovie;

import { useDispatch } from "react-redux";
import { setSelectedMovie } from "../utils/selectSlice";

const useSelectMovie = () => {
  const dispatch = useDispatch();

  const selectMovie = (movie) => {
    dispatch(setSelectedMovie(movie));
  };

  return selectMovie;
};

export default useSelectMovie;

import useFetchMovies from "../hooks/useFetchMovies";
import { addTopRatedMovies } from "../utils/movieSlice";

const useTopRatedMovies = (page) =>
  useFetchMovies("top_rated", addTopRatedMovies, page);
export default useTopRatedMovies;


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


export const BG_IMG_URL =
  "https://assets.nflxext.com/ffe/siteui/vlv3/f268d374-734d-474f-ad13-af5ba87ef9fc/web/IN-en-20250210-TRIFECTA-perspective_92338d5d-6ccd-4b1a-8536-eb2b0240a55e_large.jpg";
export const PROFILE_ICON =
  "https://occ-0-2164-395.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABXz4LMjJFidX8MxhZ6qro8PBTjmHbxlaLAbk45W1DXbKsAIOwyHQPiMAuUnF1G24CLi7InJHK4Ge4jkXul1xIW49Dr5S7fc.png?r=e6e";

export const TMDB_BASE_URL = process.env.REACT_APP_TMDB_PROXY_URL + "/api";
export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
  },
};

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
      state.with_genres = action.payload.with_genres || "";
      state.with_original_language =
        action.payload.with_original_language || "";
      state.with_origin_country = action.payload.with_origin_country || "";
    },
    clearFilters: (state) => {
      
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
      if (state.preservedFilters) {
        state.with_genres = state.preservedFilters.with_genres || "";
        state.with_original_language =
          state.preservedFilters.with_original_language || "";
        state.with_origin_country =
          state.preservedFilters.with_origin_country || "";
        
        state.preservedFilters = null;
      } else {
      }
    },
  },
});

export const { setFilters, clearFilters, restoreFilters } = filterSlice.actions;
export default filterSlice.reducer;


import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Validate Firebase config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "Firebase configuration is incomplete. Check environment variables."
  );
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;


// src/utils/gptSlice.js
import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gptShow",
  initialState: {
    show: false,
    gptMovies: null,
    loading: false,
    preservedGptMovies: null,
  },
  reducers: {
    toggleShow: (state) => {
      state.show = !state.show;
    },
    setGptMovies: (state, action) => {
      state.gptMovies = action.payload.movies;
      state.loading = action.payload.loading;
    },
    clearGptMovies: (state) => {
      state.preservedGptMovies = state.gptMovies;
      state.gptMovies = null;
      state.loading = false;
    },
    restoreGptMovies: (state) => {
      if (state.preservedGptMovies) {
        state.gptMovies = state.preservedGptMovies;
        state.preservedGptMovies = null;
      } else {
      }
    },
  },
});

export const { toggleShow, setGptMovies, clearGptMovies, restoreGptMovies } =
  gptSlice.actions;
export default gptSlice.reducer;


// src/utils/movieSlice.js
import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    nowPlayingMovies: [],
    popularMovies: [],
    topRatedMovies: [],
    myListMovies: [],
    myListTotalPages: 1,
    filteredMovies: [],
    filteredTotalPages: 1,
    preservedFilteredMovies: [],
  },
  reducers: {
    addNowPlayingMovies: (state, action) => {
      state.nowPlayingMovies = [
        ...state.nowPlayingMovies,
        ...action.payload.filter(
          (newMovie) =>
            !state.nowPlayingMovies.some((movie) => movie.id === newMovie.id)
        ),
      ];
    },
    addPopularMovies: (state, action) => {
      state.popularMovies = [
        ...state.popularMovies,
        ...action.payload.filter(
          (newMovie) =>
            !state.popularMovies.some((movie) => movie.id === newMovie.id)
        ),
      ];
    },
    addTopRatedMovies: (state, action) => {
      state.topRatedMovies = [
        ...state.topRatedMovies,
        ...action.payload.filter(
          (newMovie) =>
            !state.topRatedMovies.some((movie) => movie.id === newMovie.id)
        ),
      ];
    },
    appendMyListMovies: (state, action) => {
      const newMovies = action.payload.filter(
        (newMovie) =>
          !state.myListMovies.some((movie) => movie.id === newMovie.id)
      );
      state.myListMovies = [...state.myListMovies, ...newMovies];
    },
    setMyListTotalPages: (state, action) => {
      state.myListTotalPages = action.payload;
    },
    addToMyList: (state, action) => {
      if (!state.myListMovies.some((m) => m.id === action.payload.id)) {
        state.myListMovies.push(action.payload);
      }
    },
    removeFromMyList: (state, action) => {
      state.myListMovies = state.myListMovies.filter(
        (m) => m.id !== action.payload
      );
    },
    appendFilteredMovies: (state, action) => {
      const newMovies = action.payload.filter(
        (newMovie) =>
          !state.filteredMovies.some((movie) => movie.id === newMovie.id)
      );
      state.filteredMovies = [...state.filteredMovies, ...newMovies];
    },
    setFilteredTotalPages: (state, action) => {
      state.filteredTotalPages = action.payload;
    },
    clearFilteredMovies: (state) => {
      state.preservedFilteredMovies = [...state.filteredMovies];
      state.filteredMovies = [];
      state.filteredTotalPages = 1;
    },
    restoreFilteredMovies: (state) => {
      
      if (state.preservedFilteredMovies.length > 0) {
        state.filteredMovies = [...state.preservedFilteredMovies];
        state.filteredTotalPages =
          Math.ceil(state.preservedFilteredMovies.length / 20) || 1;
        
        state.preservedFilteredMovies = [];
      } else {
      }
    },
  },
});

export const {
  addNowPlayingMovies,
  addPopularMovies,
  addTopRatedMovies,
  appendMyListMovies,
  setMyListTotalPages,
  addToMyList,
  removeFromMyList,
  appendFilteredMovies,
  setFilteredTotalPages,
  clearFilteredMovies,
  restoreFilteredMovies,
} = movieSlice.actions;
export default movieSlice.reducer;


import Groq from "groq-sdk";

// Load API key from environment variables
const groqApiKey = process.env.REACT_APP_GROQ_API_KEY;

// Initialize Groq client only if API key exists
const openai = groqApiKey
  ? new Groq({ apiKey: groqApiKey, dangerouslyAllowBrowser: true })
  : null;

export default openai;

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

import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      return {
        uid: action.payload.uid,
        email: action.payload.email,
        displayName: action.payload.displayName,
      };
    },
    removeUser: () => null,
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;

import { Provider } from "react-redux";
import Body from "./components/Body";
import appStore from "./utils/appStore"
function App() {
  return (
    <Provider store={appStore}>
      <div>
        <Body />
      </div>
    </Provider>
  );
}

export default App;


import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
