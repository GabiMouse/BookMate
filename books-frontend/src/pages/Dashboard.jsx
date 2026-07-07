import { useEffect, useState } from "react";
import api from "../api/apiClient";
import BookCard from "../components/BookCard";
import FilterBar from "../components/FilterBar";
import PreferencesModal from "../components/Preferences"



export default function Dashboard() {

  const [showPreferences, setShowPreferences] = useState(false);
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({ genre: "", minRating: 0 });
  const [page, setPage] = useState(1);

  const limit = 50;

  const fetchBooks = () => {
    api.get("/books", {
      params: {
        genre: filters.genre || undefined,
        min_rating: filters.minRating || undefined,
        skip: (page - 1) * limit,
        limit: limit,
      }
    })
      .then(response => setBooks(response.data))
      .catch(err => console.error(err));
  };

useEffect(() => {
  api.get("/users/preferences/status")
    .then(res => {
      if (!res.data.has_preferences) {
        setShowPreferences(true);
      }
    })
    .catch(err => {
      console.error("Błąd sprawdzania preferencji", err);
    });
}, []);


  useEffect(() => {
    fetchBooks();
  }, [filters, page]);

  return (
    <div>

        {showPreferences && (
            <PreferencesModal onClose={() => setShowPreferences(false)} />
        )}


      <FilterBar filters={filters} onFilter={(f) => {
        setPage(1);     // reset strony po zmianie filtra
        setFilters(f);
      }} />

      {/* GRID KSIĄŻEK */}
      <div
        className="grid gap-6 mt-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"
        }}
      >
        {books.map(book => (
          <BookCard key={book.book_id} book={book} />
        ))}
      </div>

      {/* Paginacja */}
<div className="flex justify-center mt-6 gap-4">
  <button
    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
    disabled={page === 1}
    className="
      px-5 py-2 rounded-lg shadow-md
      bg-gray-100 hover:bg-gray-200
      transition-colors duration-200
      disabled:opacity-40 disabled:cursor-not-allowed
    "
  >
    ◀ Poprzednia
  </button>

  <span className="
      px-5 py-2 rounded-lg shadow-md
      bg-white text-gray-700 font-semibold
      flex items-center justify-center
    "
  >
    Strona {page}
  </span>

  <button
    onClick={() => setPage(prev => prev + 1)}
    disabled={books.length < limit}
    className="
      px-5 py-2 rounded-lg shadow-md
      bg-gray-100 hover:bg-gray-200
      transition-colors duration-200
      disabled:opacity-40 disabled:cursor-not-allowed
    "
  >
    Następna ▶
  </button>
</div>

    </div>
  );
}
