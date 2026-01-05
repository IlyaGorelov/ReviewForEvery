import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { useParams } from "react-router-dom";
import { TopListGet } from "../Models/TopList";
import { getTopListByIdApi } from "../Services/TopListService";
import { toast } from "react-toastify";
import {
  getAllTopFilmsApi,
  updateTopListFilmApi,
} from "../Services/TopListFIlmService";
import { TopListFilmGet } from "../Models/TopListFilm";
import TopListFilmCardWithoutDnD from "../Components/TopListFilmCardForOtherUser";
import { Spinner } from "../Components/Loader";

export default function TopListPageForOtherUser() {
  const { listId } = useParams();
  const [films, setFilms] = useState<TopListFilmGet[]>([]);
  const [topList, setTopList] = useState<TopListGet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function getTopList() {
    await getTopListByIdApi(Number(listId))
      .then((res) => {
        if (res?.data) setTopList(res.data);
      })
      .catch((e) => {
        toast.error("Unexpected error");
      });
  }

  useEffect(() => {
    getTopList();
    fetchFilms();
  }, [listId]);

  const fetchFilms = async () => {
    setIsLoading(true);
    await getAllTopFilmsApi(Number(listId))
      .then((res) => {
        if (res?.data) {
          const sorted = res.data.sort((a, b) => a.position - b.position);
          setFilms(sorted);
        }
      })
      .catch((e) => toast.error("Unexpected error"))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{topList?.name}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {films.map((film, index) => (
              <TopListFilmCardWithoutDnD
                topListfilm={film}
                position={index + 1}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
