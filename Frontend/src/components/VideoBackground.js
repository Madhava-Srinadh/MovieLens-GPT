import { useEffect, useState } from "react";

const VideoBackground = ({ videoKey, isMuted, selectedMovie }) => {
  const [reloadCounter, setReloadCounter] = useState(0);

  // When a valid videoKey is received, trigger an automatic re-render
  // after a short delay so that the video request is sent a second time.
  useEffect(() => {
    if (videoKey) {
      const timer = setTimeout(() => {
        // Increase reloadCounter only once per new videoKey
        setReloadCounter((prev) => prev + 1);
      }, 1000); // Adjust delay as needed
      return () => clearTimeout(timer);
    }
  }, [videoKey]);

  // If no videoKey, show a fallback using the movie backdrop or a blank screen.
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
      // The key includes reloadCounter; when it updates, the iframe is re-mounted.
      key={`${videoKey}-${isMuted}-${reloadCounter}`}
      className="absolute top-1/2 left-1/2 w-[200vw] h-[200vh] md:w-[150vw] md:h-[150vh] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      title="Movie Trailer"
      src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&loop=1&playlist=${videoKey}&mute=${
        isMuted ? 1 : 0
      }&start=7&controls=0&showinfo=0&rel=0&enablejsapi=1`}
      allow="autoplay; encrypted-media"
      allowFullScreen
    />
  );
};

export default VideoBackground;
