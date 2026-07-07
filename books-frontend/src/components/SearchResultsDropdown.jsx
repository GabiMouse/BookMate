import { useState, useEffect } from "react";
import api from "../api/apiClient";

export default function SearchResultsDropdown({ query, onSelect }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/books/search?query=${encodeURIComponent(query)}`);
        if (!cancelled) setResults(res.data);
      } catch (err) {
        console.error("Fetch search error:", err);
        if (!cancelled) setError("Błąd pobierania wyników");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const delay = setTimeout(fetchResults, 300);
    return () => {
      cancelled = true;
      clearTimeout(delay);
    };
  }, [query]);

  if (!query) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl rounded-lg z-50 max-h-60 overflow-y-auto">
      {loading && <p className="p-2">Ładowanie…</p>}
      {error && <p className="p-2 text-red-500">{error}</p>}
      {!loading && !error && results.length === 0 && <p className="p-2">Brak wyników</p>}

      {!loading && !error && results.map(book => (
        <div
          key={book.book_id}
          className="p-2 hover:bg-pink-100 cursor-pointer"
          onClick={() => onSelect(book)}
        >
          <p className="font-semibold">{book.title}</p>
          <p className="text-sm text-gray-500">{book.authors}</p>
        </div>
      ))}
    </div>
  );
}
