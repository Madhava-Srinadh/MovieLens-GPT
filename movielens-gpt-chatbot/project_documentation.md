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
