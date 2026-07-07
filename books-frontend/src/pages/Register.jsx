import { useState } from "react";
import api from "../api/apiClient";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = userData.username.trim();
    const email = userData.email.trim();
    const password = userData.password;

    if (!username || !email || !password) {
      alert("Wszystkie pola są wymagane");
      return;
    }

    try {
      await api.post("/auth/register", { username, email, password });
      alert("Konto utworzone!");
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.detail === "Email already registered") {
        alert("E-mail zajęty!");
      } else {
        alert("Błąd rejestracji");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 shadow-lg rounded-md bg-white mt-10 flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center mb-4">Rejestracja</h2>

      <input
        type="text"
        placeholder="Username"
        value={userData.username}
        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
        className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="email"
        placeholder="Email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="password"
        placeholder="Hasło"
        value={userData.password}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
        className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      >
        Zarejestruj
      </button>

      <p className="text-center text-sm">
        Masz już konto?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-blue-500 cursor-pointer underline"
        >
          Zaloguj się tutaj
        </span>
      </p>
    </form>
  );
}
