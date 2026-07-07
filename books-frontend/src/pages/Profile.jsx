import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const { user, token } = useContext(AuthContext);
  const [ratedBooks, setRatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRatings = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8080/my-ratings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRatedBooks(res.data);
      } catch (err) {
        console.error("Błąd pobierania ocen:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [user, token]);

  const handleRatingChange = async (book_id, newRating) => {
    try {
      await axios.post(
        "http://127.0.0.1:8080/rate",
        { book_id, rating: newRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRatedBooks((prev) =>
        prev.map((item) =>
          item.book.book_id === book_id ? { ...item, rating: newRating } : item
        )
      );
    } catch (err) {
      console.error("Błąd przy aktualizacji oceny:", err);
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="mb-4 text-lg font-semibold">Nie jesteś zalogowany!</p>
        <Link
          to="/login"
          className="px-4 py-2 bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition"
        >
          Zaloguj się
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Witaj, {user.username || user.email}!
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Ładowanie ocenionych książek...</p>
      ) : ratedBooks.length === 0 ? (
        <p className="text-center text-gray-600 mb-4">Nie oceniono jeszcze żadnej książki.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {ratedBooks.map((item) => (
            <Link
              key={item.book.book_id}
              to={`/books/${item.book.book_id}`}
              className="flex bg-gray-50 p-3 rounded shadow-sm items-center hover:bg-gray-100 transition"
            >
              <img
                src={item.book.image_url || "/placeholder.png"}
                alt={item.book.title}
                className="w-16 h-24 object-cover rounded mr-3"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.book.title}</h3>
                <p className="text-gray-500">{item.book.authors}</p>
                <div className="flex items-center mt-1">
                  <span className="mr-2 text-yellow-500 font-bold">Ocena:</span>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      className={`px-2 py-1 rounded ${
                        r === item.rating ? "bg-yellow-300" : "bg-gray-200"
                      } mr-1`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleRatingChange(item.book.book_id, r);
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center">
        <Link
          to="/"
          className="px-4 py-2 bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition"
        >
          Przejdź do strony głównej
        </Link>
      </div>
    </div>
  );
}
