import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/apiClient";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", userData);
      login(res.data.access_token);
      navigate("/profile");
    } catch {
      alert("Błędne dane logowania");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Logowanie</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            placeholder="Hasło"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Zaloguj
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Nie masz konta?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Utwórz je tutaj
          </Link>
        </p>
      </div>
    </div>
  );
}
