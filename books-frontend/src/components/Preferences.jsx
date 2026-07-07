import { useEffect, useState } from "react";
import api from "../api/apiClient";

export default function PreferencesModal({ onClose }) {
  const [tags, setTags] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  );


  useEffect(() => {
    api.get("/tags").then(res => setTags(res.data));
  }, []);

  const toggle = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(t => t !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  };

  const save = async () => {
    if (selected.length !== 3) {
      alert("Wybierz dokładnie 3 gatunki");
      return;
    }

    await api.post("/users/preferences", {
      tag_ids: selected
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">
          Wybierz 3 ulubione gatunki
        </h2>

        <input
          type="text"
          placeholder="Szukaj gatunku..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 mb-2 w-full rounded"
        />

        <div className="grid grid-cols-2 gap-2 mb-4 max-h-64 overflow-y-auto">
          {filteredTags.map(tag => (
            <button
              key={tag.id}
              onClick={() => toggle(tag.id)}
              className={`border p-2 rounded ${
                selected.includes(tag.id)
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>


        <button
          onClick={save}
          className="bg-blue-500 text-white w-full py-2 rounded"
        >
          Zapisz
        </button>
      </div>
    </div>
  );
}
