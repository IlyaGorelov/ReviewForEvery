import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/useAuth";
import { deleteAnyAccountApi, deleteMeApi } from "../Services/AuthService";
import { toast } from "react-toastify";

export const AccountPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleDeleteMyAccount = async () => {
    await deleteMeApi();
    logout();
    navigate("/register");
  };

  const deleteAccount = async () => {
    const userId = window.prompt("User name?");
    await deleteAnyAccountApi(String(userId)).catch((e) => {
      toast.error("Oops!");
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-3">Аккаунт: {user?.userName}</h1>
      <p className="text-xl mb-6">Email: {user?.email}</p>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/my-reviews")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Мои отзывы
        </button>

        <button
          onClick={() => navigate("/top-lists")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Мои топы
        </button>

        <button
          onClick={handleDeleteMyAccount}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Удалить мой аккаунт
        </button>

        {user?.role.includes("Admin") && (
          <>
            <hr className="my-4" />
            <h2 className="text-xl font-semibold">Админ панель</h2>

            <button
              onClick={() => navigate("/reviews")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Все отзывы
            </button>

            <button
              onClick={() => navigate("/add-film")}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Добавить фильм
            </button>

            <button
              onClick={() => navigate("/add")}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
            >
              Список всех фильмов
            </button>

            <button
              onClick={() => deleteAccount()}
              className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
            >
              Удалить любой аккаунт
            </button>
          </>
        )}
      </div>
    </div>
  );
};
