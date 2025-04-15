const VideoBackground = ({ videoKey, isMuted }) => {
  return (
    <iframe
      className="absolute top-1/2 left-1/2 w-[200vw] h-[200vh] md:w-[150vw] md:h-[150vh] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      title="Movie Trailer"
      key={videoKey}
      src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&loop=1&playlist=${videoKey}&mute=${
        isMuted ? 1 : 0
      }&start=7&controls=0&showinfo=0&rel=0&enablejsapi=1`}
      allow="autoplay; encrypted-media"
      allowFullScreen
    ></iframe>
  );
};

export default VideoBackground;
