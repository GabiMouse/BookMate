import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

export default function AddBook() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    authors: "",
    original_publication_year: "",
    isbn: "",
    tag_name: "",
    image_url: "",
    small_image_url: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post("/add", form);
      alert("Książka dodana!");
      navigate(`/books/${res.data.book_id}`);
    } catch (err) {
      console.error(err);
      alert("Błąd przy dodawaniu książki");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Dodaj nową książkę</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          placeholder="Tytuł"
          value={form.title}
          onChange={handleChange}
          required
          className="p-3 border rounded"
        />
        <input
          type="text"
          name="authors"
          placeholder="Autor/Autorzy (oddziel przecinkiem)"
          value={form.authors}
          onChange={handleChange}
          required
          className="p-3 border rounded"
        />
        <input
          type="number"
          name="original_publication_year"
          placeholder="Rok wydania"
          value={form.original_publication_year}
          onChange={handleChange}
          required
          className="p-3 border rounded"
        />
        <input
          type="text"
          name="isbn"
          placeholder="ISBN"
          value={form.isbn}
          onChange={handleChange}
          required
          className="p-3 border rounded"
        />
        <select
          name="tag_name"
          value={form.tag_name}
          onChange={handleChange}
          required
          className="p-3 border rounded"
        >
          <option value="">Wybierz gatunek</option>
          <option value="fantasy">Fantasy</option>
          <option value="science-fiction">Science Fiction</option>
          <option value="romance">Romans</option>
          <option value="thriller">Thriller</option>
          <option value="mistery">Kryminał</option>
          <option value="biography">Biografia</option>
          <option value="horror">Horror</option>
          <option value="children">Literatura Dziecięca</option>
          <option value="young-adult">Literatura Młodzieżowa</option>
          <option value="drama">Dramat</option>
          <option value="history">Historyczna</option>
          <option value="science">Nauka i Technika</option>
          <option value="poetry">Poezja</option>
          <option value="graphic-novels">Komiks</option>
          <option value="comedy">Komedia</option>
            </select>
        <input
          type="url"
          name="image_url"
          placeholder="URL okładki"
          value={form.image_url}
          onChange={handleChange}
          className="p-3 border rounded"
        />
        <input
          type="url"
          name="small_image_url"
          placeholder="URL małego obrazka"
          value={form.small_image_url}
          onChange={handleChange}
          className="p-3 border rounded"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"
        >
          Dodaj książkę
        </button>
      </form>
    </div>
  );
}

