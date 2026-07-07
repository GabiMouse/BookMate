import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import SearchResultsDropdown from "./SearchResultsDropdown";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [query, setQuery] = useState("");

  const handleSelectBook = (book) => {
    navigate(`/books/${book.book_id}`);
    setQuery("");
  };

  return (
    <header className="bg-white shadow-sm px-6 py-3 flex items-center relative">
      <h2
        className="text-lg font-semibold text-gray-700 absolute left-6 cursor-pointer"
        onClick={() => navigate("/")}
      >
        Panel główny
      </h2>

      <div className="absolute right-6 flex items-center gap-4 z-20">
  {!user ? (
    <button
      onClick={() => navigate("/login")}
      className="
        px-5 py-2
        bg-gradient-to-r from-pink-400 to-pink-600
        text-white font-semibold
        rounded-xl
        shadow-md
        transform
        hover:scale-105 hover:shadow-xl hover:brightness-110
        transition duration-300 ease-in-out
      "
    >
      Zaloguj
    </button>
  ) : (
    <>
      <img
        src="https://i.pravatar.cc/40"
        alt="avatar"
        className="rounded-full w-10 h-10 border cursor-pointer"
        onClick={() => navigate("/profile")}
      />
    </>
  )}
</div>



      {/* PASEK WYSZUKIWANIA */}
      <div className="flex-1 flex justify-center relative">
        <SearchBar
          placeholder="Szukaj książki..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query && (
          <SearchResultsDropdown
            query={query}
            onSelect={handleSelectBook}
          />
        )}
      </div>
    </header>
  );
}

