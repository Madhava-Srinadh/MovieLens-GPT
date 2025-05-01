# 🎮 MovieLens GPT 🤖

**MovieLens GPT** is a full-stack MERN application that blends movie discovery with AI-powered recommendations. It integrates the **TMDB API** for movie data, **OpenAI (GroqCloud)** for smart suggestions, **MongoDB** for user-specific lists, and **Firebase** for authentication.

---

## 🚀 Features

### 🔐 Authentication
- ✅ Login / Sign Up with Firebase Authentication
- ✅ User Profile & Sign Out
- ✅ Authenticated routes with redirection to Browse Page

### 🎥 Movie Browsing
- ✅ Hero section with trailer background
- ✅ Movie lists: Trending, Popular, Upcoming, etc.
- ✅ Movie filtering by genre, language, and region
- ✅ Detailed view: title, overview, release date, ratings, trailer

### 🤖 GPT (AI Movie Search)
- ✅ Smart movie search via AI prompt
- ✅ Fetch AI-generated movie recommendations
- ✅ Powered by GroqCloud API + TMDB API

### 📂 My List
- ✅ Personalized movie lists (Favorites, Watchlist)
- ✅ Managed via Express.js REST APIs + MongoDB
- ✅ Persistent across sessions

### 🌐 UI & UX
- ✅ Responsive design with TailwindCSS
- ✅ Global state via Redux
- ✅ Secure environment configurations (`.env`)

---

## 🌍 Live Demo

👉 [Visit MovieLens GPT](https://movielens18.web.app/)  

---

## 💠 Tech Stack

- **Frontend**: React.js, TailwindCSS, Redux
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Firebase Auth
- **APIs**:
  - TMDB API (Movie data)
  - GroqCloud API (AI search)
  - Custom MongoDB REST APIs

---

## 🔐 Proxy Setup

A secure proxy server using Express.js is included for routing TMDB API calls:
- Adds bearer token automatically
- Supports CORS
- Avoids direct client-side API key exposure

> Located in `/tmdb-proxy/server.js`

---

## 📁 Directory Structure

```
├── client/               # React frontend
├── server/               # Express + MongoDB backend
├── tmdb-proxy/           # TMDB Proxy server
├── .env                  # Environment variables
├── firebase-debug.log    # Firebase logs
└── README.md
```

---

## 📜 License

This project is for **educational purposes only**. All movie data belongs to [TMDB](https://www.themoviedb.org/).

---

## 💡 Contributions

Want to contribute? Fork this repo, make your changes, and open a pull request! 🎉  
Let’s make discovering movies even more fun and intelligent!

---

🔥 **Enjoy using MovieLens GPT!** 🎮✨

