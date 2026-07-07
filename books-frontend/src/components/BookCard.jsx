import { useNavigate } from "react-router-dom";

export default function BookCard({ book }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/books/${book.book_id}`)}
      className="
        bg-white rounded-2xl shadow-md cursor-pointer
        hover:shadow-xl transition-all duration-300
        border border-gray-200 overflow-hidden
      "
    >
      <img
        src={book.image_url}
        alt={book.title}
        className="
          w-full h-64 object-cover
          hover:scale-105 transition-transform duration-300
        "
      />

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {book.title}
        </h3>

        <p className="text-sm text-gray-500">{book.authors}</p>

        <p className="text-sm mt-3">⭐ {book.average_rating}</p>
      </div>
    </div>
  );
}



