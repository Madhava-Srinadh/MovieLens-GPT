import { useDispatch } from "react-redux";
import openai from "../utils/openai";
import { setGptMovies } from "../utils/gptSlice";
import { options } from "../utils/constants";

const useGptResponse = () => {
  const dispatch = useDispatch();

  const fetchGptMovies = async (query) => {
    if (!openai) {
      console.error(
        "❌ Groq API client is not initialized! Check your API key."
      );
      return;
    }

    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Suggest a list of movie titles based on this query: "${query}". Provide only the titles as a comma-separated list.`,
          },
        ],
        model: "llama-3.3-70b-versatile",
      });

      const movieTitles =
        chatCompletion.choices[0]?.message?.content?.split(",") || [];
      const trimmedTitles = movieTitles.map((title) => title.trim());

      const moviePromises = trimmedTitles.map(async (title) => {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            title
          )}&language=en-US`,
          options
        );
        const data = await response.json();
        return data.results?.[0];
      });

      const movies = (await Promise.all(moviePromises)).filter(
        (movie) => movie && movie.poster_path
      );

      dispatch(setGptMovies(movies));
    } catch (error) {
      console.error("Error fetching GPT movies:", error);
    }
  };

  return { fetchGptMovies };
};

export default useGptResponse;
