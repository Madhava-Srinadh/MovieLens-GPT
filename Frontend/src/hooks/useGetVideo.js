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
