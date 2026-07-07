import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/apiClient";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (query) {
        api.get(`/books/search?query=${encodeURIComponent(query)}`)
        .then(res => setBooks(res.data))
        .catch(err => console.error(err));
    }
  }, [query]);

  if (!query) return <p>Wpisz coś, aby wyszukać książki.</p>;

  return (
    <div>
      <h2>Wyniki wyszukiwania dla: "{query}"</h2>
      {books.length === 0 ? (
        <p>Brak wyników</p>
      ) : (
        <ul>
          {books.map(book => (
            <li key={book.book_id}>
              {book.title} – {book.authors}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
