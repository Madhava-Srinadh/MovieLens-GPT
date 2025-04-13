import { useDispatch } from "react-redux";
import { options } from "../utils/constants"; // TMDB API options
import { setSelectVideo } from "../utils/selectSlice";
import { useEffect } from "react";

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY; // Load API key from .env

const useGetVideo = (movieId, movieName, releaseYear) => {
  const dispatch = useDispatch();

  const DEFAULT_TRAILER = {
    key: "dQw4w9WgXcQ", // Replace with a real fallback video ID
    id: "dQw4w9WgXcQ",
    source: "Fallback",
    type: "Trailer",
  };

  const getMovieVideo = async () => {
    if (!movieId && !movieName) {
      console.warn("Movie ID and Name are missing.");
      return;
    }

    try {
      let trailerVideo = null;

      // 1️⃣ Try fetching from TMDB
      if (movieId) {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
          options
        );
        const json = await response.json();

        trailerVideo = json.results.find((video) => video.type === "Trailer");
        if (trailerVideo) {
          trailerVideo = {
            key: trailerVideo.key,
            id: trailerVideo.id,
            source: "TMDB",
          };
        }
      }

      // 2️⃣ If no TMDB trailer, search YouTube
      if (!trailerVideo && movieName && YOUTUBE_API_KEY) {
        console.warn("No trailer found in TMDB. Searching YouTube...");

        const searchQuery = `${movieName} ${
          releaseYear ? releaseYear : ""
        } Official Trailer`;

        const youtubeResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            searchQuery
          )}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`
        );

        const youtubeJson = await youtubeResponse.json();
        const videoId = youtubeJson.items?.[0]?.id?.videoId;

        if (videoId) {
          trailerVideo = {
            key: videoId,
            id: videoId,
            source: "YouTube",
            type: "Trailer",
          };
        } else {
          console.warn("YouTube search returned no valid video.");
        }
      } else if (!YOUTUBE_API_KEY) {
        console.error("YouTube API key is missing. Please add it to .env");
      }

      // 3️⃣ Use found video or fallback
      dispatch(setSelectVideo(trailerVideo || DEFAULT_TRAILER));
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  useEffect(() => {
    getMovieVideo();
  }, [movieId, movieName, releaseYear]);
};

export default useGetVideo;
