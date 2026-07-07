import { useContext, useState } from "react";
import { BookOpen, Star, PlusCircle, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);

  const handleRestrictedClick = (path) => {
    if (!user) {
      setModalOpen(true);
      return;
    }
    navigate(path);
  };

  return (
    <>
      {/* SIDEBAR */}
      <aside className="w-72 bg-white shadow-xl p-6 flex flex-col justify-between border-r border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold mb-10 text-blue-700 tracking-wide">
            BookMate
          </h1>

          <nav className="flex flex-col gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl text-lg transition
               ${isActive ? "bg-blue-100 text-blue-700 font-semibold" : "hover:bg-gray-100"}`
              }
            >
              <BookOpen size={22} /> Książki
            </NavLink>

            <button
              onClick={() => handleRestrictedClick("/recommendations")}
              className="flex items-center gap-3 p-3 rounded-xl text-lg text-left hover:bg-gray-100 transition"
            >
              <Star size={22} /> Rekomendacje
            </button>

            <button
              onClick={() => handleRestrictedClick("/add")}
              className="flex items-center gap-3 p-3 rounded-xl text-lg text-left hover:bg-gray-100 transition"
            >
              <PlusCircle size={22} /> Dodaj książkę
            </button>
          </nav>
        </div>

        {user && (
          <button
            onClick={logout}
            className="flex items-center gap-3 text-gray-600 hover:text-red-500 p-3 text-lg transition"
          >
            <LogOut size={22} /> Wyloguj się
          </button>
        )}
      </aside>

      {/* MODAL */}
      {modalOpen && (
        <div
          className="
            fixed inset-0
            flex justify-center items-center
            bg-black/40
            backdrop-blur-sm
            z-50
            animate-fadeIn
          "
        >
          <div
            className="
              bg-white
              p-8
              rounded-2xl
              shadow-xl
              max-w-sm
              w-full
              text-center
              animate-scaleIn
            "
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Wymagane logowanie
            </h2>

            <p className="text-gray-600 mb-6">
              Ta funkcja jest dostępna wyłącznie dla zalogowanych użytkowników.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() =>{
                    setModalOpen(false);
                    navigate("/login")}}
                className="
                  py-2 px-4
                  bg-indigo-600
                  text-white
                  rounded-lg
                  hover:bg-indigo-700
                  transition
                  shadow
                "
              >
                Przejdź do logowania
              </button>

              <button
                onClick={() => setModalOpen(false)}
                className="
                  py-2 px-4
                  bg-gray-200
                  rounded-lg
                  hover:bg-gray-300
                  transition
                "
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
