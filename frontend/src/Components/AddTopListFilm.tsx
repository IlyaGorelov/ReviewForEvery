import { useCallback, useEffect, useState } from "react";
import { FilmGet } from "../Models/Film";
import { getAllFilmsApi } from "../Services/FilmService";
import { toast } from "react-toastify";
import { postTopListFilmApi } from "../Services/TopListFIlmService";
import { useParams } from "react-router-dom";
import { useDebounce } from "../Context/useDebounce";

type Props = {
  onSuccess: () => void;
};

export default function AddTopListFilm({ onSuccess }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState<number>();
  const [comment, setComment] = useState("");
  const [films, setFilms] = useState<FilmGet[]>([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [position, setPosition] = useState<number>(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { id } = useParams();

  const fetchFilms = useCallback(async () => {
    if (!debouncedQuery) {
      setFilms([]);
      return;
    }

    await getAllFilmsApi(1, 20, debouncedQuery)
      .then((res) => {
        if (res?.data) setFilms(res.data.items);
      })
      .catch(() => toast.error("Unexpected error"));
  }, [debouncedQuery]);

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  const handlePublish = () => {
    if (!selectedFilm) {
      alert("Please select a film");
      return;
    }

    postTopListFilmApi(selectedFilm, position, Number(id), comment)
      .then(() => {
        setShowAddForm(false);
        onSuccess();
      })
      .catch(() => toast.error("Unexpected error"));
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setSelectedFilm(undefined);
    setComment("");
    setPosition(0);
    setQuery("");
  };

  const handleSelect = (film: FilmGet) => {
    setSelectedFilm(film.id);
    setQuery(film.title);
    setShowSuggestions(false);
  };

  return (
    <div className="relative group w-full aspect-[2/3]">
      {!showAddForm && (
        <div
          onClick={() => setShowAddForm(true)}
          className="cursor-pointer h-full w-full rounded-xl border-4 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-all duration-200 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md"
        >
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="text-gray-500 font-medium">Add film</span>
        </div>
      )}

      {showAddForm && (
        <div className="absolute inset-0 bg-white rounded-xl shadow-xl p-4 flex flex-col justify-between z-20">
          <div className="space-y-4">
            {/* Film search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Select film <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
                  onFocus={() => setShowSuggestions(true)}
                />
                {showSuggestions && query && films.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {films.map((film) => (
                      <li
                        key={film.id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition"
                        onMouseDown={() => handleSelect(film)}
                      >
                        {film.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
                placeholder="Enter position (1, 2, 3...)"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Comment (optional)
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a personal note..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-4 pt-2">
            <button
              onClick={handlePublish}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-sm"
            >
              Publish
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-200 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
