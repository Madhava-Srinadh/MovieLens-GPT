import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import validator from "validator";

const useMyListMovies = (shouldFetch) => {
  const [myListMovies, setMyListMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector((store) => store.user);

  const fetchMyList = useCallback(async () => {
    if (!user || !user.email || !validator.isEmail(user.email)) {
      setError("Please sign in with a valid email to view your list");
      setMyListMovies([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/mylist/${encodeURIComponent(user.email)}`
      );
      setMyListMovies(response.data || []);
    } catch (err) {
      setError(
        "Failed to load your list: " +
          (err.response?.data?.error || err.message || "Unknown error")
      );
      setMyListMovies([]);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (shouldFetch && user?.email && validator.isEmail(user.email)) {
      fetchMyList();
    } else {
      setMyListMovies([]);
      setLoading(false);
      setError(null);
    }
  }, [shouldFetch, user?.email, fetchMyList]);

  return { myListMovies, loading, error, fetchMyList };
};

export default useMyListMovies;
