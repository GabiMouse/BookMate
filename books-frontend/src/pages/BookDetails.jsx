import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import apiClient from "../api/apiClient";
import { AuthContext } from "../context/AuthContext";

export default function BookDetails() {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const isLoggedIn = !!user;

  useEffect(() => {
    setLoading(true);
    apiClient
      .get(`/books/${id}`)
      .then(res => {
        setBook(res.data);
        if (isLoggedIn) {
          setUserRating(res.data.user_rating ?? 0);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Nie udało się wczytać książki.");
        setLoading(false);
      });
  }, [id, isLoggedIn]);

  const handleRateBook = (rating) => {
    if (!isLoggedIn) {
      setModalOpen(true);
      return;
    }

    apiClient.post(
      "/rate",
      { book_id: id, rating },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      setUserRating(rating);
    })
    .catch(err => {
      console.error(err);
      alert("Nie udało się ocenić książki.");
    });
  };

  // USUWANIE OCENY
  const handleDeleteRating = () => {
    apiClient.delete(`/rate/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setUserRating(0);
    })
    .catch(err => {
      console.error(err);
      alert("Nie udało się usunąć oceny.");
    });
  };

  if (loading) return <p className="text-center mt-10">Ładowanie...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!book) return null;

  return (
    <div className="p-10 flex flex-wrap gap-10 justify-center bg-gray-50 min-h-screen">
      {/* OBRAZEK */}
      <img
        src={book.image_url || book.small_image_url || "/no-cover.png"}
        alt={book.title}
        className="w-[350px] h-[450px] rounded-2xl shadow-xl object-cover"
      />

      {/* INFORMACJE */}
      <div className="max-w-[500px]">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-900">
          {book.title}
        </h1>

        <div className="flex flex-col gap-4">
          <div className="p-4 bg-white rounded-xl shadow">
            <strong>Autorzy:</strong> {book.authors}
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <strong>Średnia ocena:</strong> ⭐ {book.average_rating ?? 0}
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <strong>Gatunek:</strong> {book.tag}
          </div>
        </div>

        {/* OCENA */}
        {isLoggedIn && (
          <div className="mt-6 flex gap-2 items-center flex-wrap">
            <span className="font-semibold">
              Twoja ocena: {userRating > 0 ? `${userRating} ⭐` : "brak"}
            </span>

            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                onClick={() => handleRateBook(r)}
                className={`
                  px-3 py-2 rounded transition
                  ${r === userRating
                    ? "bg-yellow-400 text-white"
                    : "bg-gray-200 hover:bg-gray-300"}
                `}
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {/* USUŃ OCENĘ */}
        {isLoggedIn && userRating > 0 && (
          <button
            onClick={handleDeleteRating}
            className="
              mt-4 px-4 py-2 rounded-lg
              bg-blue-100 text-blue-700
              hover:bg-blue-200
              transition
            "
          >
            Usuń ocenę
          </button>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Wymagane logowanie</h2>
            <p className="text-gray-600 mb-6">
              Ta funkcja jest dostępna tylko dla zalogowanych.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setModalOpen(false);
                  navigate("/login");
                }}
                className="py-2 px-4 bg-indigo-600 text-white rounded-lg"
              >
                Przejdź do logowania
              </button>

              <button
                onClick={() => setModalOpen(false)}
                className="py-2 px-4 bg-gray-200 rounded-lg"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

