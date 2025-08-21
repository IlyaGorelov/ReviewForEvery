// /src/components/TopListCard.tpx

import { useNavigate } from "react-router-dom";
import { TopListGet } from "../Models/TopList";
import { deleteTopListAPI, updateTopListApi } from "../Services/TopListService";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  list: TopListGet;
  onUpdated: () => void;
};

export default function TopListCard({ list, onUpdated }: Props) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(list.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    navigate(`/top-lists/${list.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const saveName = async () => {
    if (name.trim() === "") {
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
      if (onUpdated) onUpdated();
    } catch (error) {
      toast.error("Failed to update name");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveName();
    } else if (e.key === "Escape") {
      setName(list.name);
      setIsEditing(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Ты уверен?")) {
      await deleteTopListAPI(list.id).catch((e) =>
        toast.error("Unexpected error")
      );
      onUpdated();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="border rounded p-4 shadow hover:shadow-md transition"
    >
      <div className="flex justify-between items-center">
        <div>
          {isEditing ? (
            <input
              onClick={(e) => {
                e.stopPropagation();
              }}
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={saveName}
              className="border p-1 rounded"
              maxLength={50}
              required
            />
          ) : (
            <h2 className="text-xl font-semibold">{list.name}</h2>
          )}
        </div>

        <div className="flex gap-2">
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="text-blue-500 hover:underline text-sm"
              title="Edit"
            >
              Edit
            </button>
          )}

          <button
            onClick={handleDelete}
            className="text-red-500 hover:underline text-sm"
            title="Delete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
