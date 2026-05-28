// src/components/TopListCard.tsx

import { useNavigate } from "react-router-dom";
import { TopListGet } from "../Models/TopList";
import { deleteTopListAPI, updateTopListApi } from "../Services/TopListService";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  list: TopListGet;
  variant?: "owner" | "otherUser";
  onUpdated?: () => void;
};

export default function TopListCard({
  list,
  variant = "owner",
  onUpdated,
}: Props) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(list.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const isOwner = variant === "owner";

  const handleClick = () => {
    if (isOwner) {
      navigate(`/top-lists/${list.id}`);
    } else {
      // Other user relative link (used inside e.g. /user/:username/top-lists)
      navigate(`${list.id}`);
    }
  };

  // ----- Edit handlers (owner only) -----
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOwner) setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const saveName = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (name === list.name) {
      setIsEditing(false);
      return;
    }
    try {
      await updateTopListApi(name, list.id);
      setIsEditing(false);
      onUpdated?.();
    } catch {
      toast.error("Failed to update name");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") saveName();
    if (e.key === "Escape") {
      setName(list.name);
      setIsEditing(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure?")) {
      try {
        await deleteTopListAPI(list.id);
        onUpdated?.();
      } catch {
        toast.error("Could not delete list");
      }
    }
  };

  // ----- UI -----
  return (
    <div
      onClick={handleClick}
      className={`group bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${
        isOwner ? "" : "hover:shadow-lg" // slightly different hover for other user
      }`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start gap-4">
          {/* Title / Edit field */}
          <div className="flex-1 min-w-0">
            {isOwner && isEditing ? (
              <input
                onClick={(e) => e.stopPropagation()}
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={saveName}
                className="w-full px-3 py-2 text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                maxLength={50}
                required
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                {list.name}
              </h2>
            )}
          </div>

          {/* Action buttons – only for owner */}
          {isOwner && (
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  title="Edit list name"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit
                </button>
              )}
              <button
                onClick={handleDelete}
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                title="Delete list"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
