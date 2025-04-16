import { useDispatch } from "react-redux";
import openai from "../utils/openai";
import { setGptMovies } from "../utils/gptSlice";
import { options } from "../utils/constants";
import languages from "../utils/languages.json";
import countries from "../utils/countries.json";

const useGptResponse = () => {
  const dispatch = useDispatch();
  let abortController = null;
  let movieCache = new Map();

  const fetchGptMovies = async (query) => {
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

        const url = `https://api.themoviedb.org/3/search/movie?${searchParams.toString()}`;

        try {
          const searchResponse = await fetch(url, { ...options, signal });
          const searchData = await searchResponse.json();

          let movieResult = null;
          for (const result of searchData.results || []) {
            if (!result.id) continue;

            const detailsUrl = `https://api.themoviedb.org/3/movie/${result.id}?language=${languageCode}`;
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
