import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserByNameApi } from "../Services/UserService";
import { UserGet } from "../Models/User";

export const ForeignAccountPage = () => {
  const navigate = useNavigate();
  const { username } = useParams();

  const [user, setUser] = useState<UserGet>();

  async function getUser() {
    getUserByNameApi(username!)
      .then((res) => {
        if (res?.data) setUser(res.data);
      })
      .catch((e) => toast.error("Unexpected error"));
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-3">Аккаунт: {user?.username}</h1>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("all-reviews")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Отзывы
        </button>

        <button
          onClick={() => navigate("top-lists")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Топы
        </button>
      </div>
    </div>
  );
};
