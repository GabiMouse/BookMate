import { useEffect, useState } from "react";
import api from "../api/apiClient";


const GENRES = [
  { value: "fantasy", label: "Fantasy" },
  { value: "science-fiction", label: "Science Fiction" },
  { value: "romance", label: "Romans" },
  { value: "thriller", label: "Thriller" },
  { value: "mistery", label: "Kryminał" },
  { value: "biography", label: "Biografia" },
  { value: "horror", label: "Horror" },
  { value: "children", label: "Literatura Dziecięca" },
  { value: "young-adult", label: "Literatura Młodzieżowa" },
  { value: "drama", label: "Dramat" },
  { value: "history", label: "Historyczna" },
  { value: "science", label: "Nauka i Technika" },
  { value: "poetry", label: "Poezja" },
  { value: "graphic-novels", label: "Komiks" },
  { value: "comedy", label: "Komedia" }
];


export default function FilterBar({ onFilter }) {
  const handleReset = () => {
    onFilter({ genre: "", minRating: 0 });
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        padding: "10px 12px",
        background: "#f5f5f5",
        borderRadius: "10px",
        width: "fit-content",
        marginBottom: "15px",
      }}
    >
      {/* GENRE */}
      <select
        onChange={(e) =>
          onFilter((prev) => ({ ...prev, genre: e.target.value }))
        }
        style={{
          padding: "6px 8px",
          borderRadius: "6px",
        }}
      >
        <option value="">Wszystkie gatunki</option>
        {GENRES.map((g) => (
          <option key={g.value} value={g.value}>
            {g.label}
          </option>
        ))}
      </select>

      {/* RATING */}
      <select
        onChange={(e) =>
          onFilter((prev) => ({ ...prev, minRating: Number(e.target.value) }))
        }
        style={{
          padding: "6px 8px",
          borderRadius: "6px",
        }}
      >
        <option value="0">Pokaż wszystkie</option>
        <option value="3">Min 3⭐</option>
        <option value="4">Min 4⭐</option>
        <option value="4.5">Min 4.5⭐</option>
      </select>

      {/* RESET */}
      <button
        onClick={handleReset}
        style={{
          padding: "6px 10px",
          background: "#ddd",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Reset
      </button>
    </div>
  );
}
