import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RecommendationsPage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8080/recommendations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("RECOMMENDATIONS:", res.data); // DEBUG
        setBooks(res.data);
      } catch (err) {
        console.error("Błąd pobierania rekomendacji:", err);
      }
    };

    fetchRecommendations();
  }, [token]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Rekomendacje dla Ciebie
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.book_id}
            onClick={() => navigate(`/books/${book.book_id}`)}
            className="
              bg-white rounded-2xl shadow-md cursor-pointer
              hover:shadow-xl transition-all duration-300
              border border-gray-200 overflow-hidden
            "
          >
            {/* OBRAZEK */}
            <img
              src={book.image_url || book.small_image_url}
              alt={book.title}
              onError={(e) => {
                e.target.src = "/no-cover.png";
              }}
              className="
                w-full h-64 object-cover
                hover:scale-105 transition-transform duration-300
              "
            />

            {/* DANE */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {book.title}
              </h3>

              <p className="text-sm text-gray-500">
                {book.authors}
              </p>

              <p className="text-sm mt-3">
                ⭐ {book.average_rating}
              </p>

              {book.tag && (
                <p className="text-xs text-blue-600 mt-2">
                  #{book.tag}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
