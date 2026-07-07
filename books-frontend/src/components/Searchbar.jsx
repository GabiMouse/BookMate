import { Search } from "lucide-react";

export default function SearchBar({ placeholder, value, onChange }) {
  return (
    <div className="flex items-center bg-white shadow-sm rounded-lg p-2 w-full max-w-md">
      <Search size={18} className="text-gray-400 mx-2" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full focus:outline-none text-gray-700"
      />
    </div>
  );
}
