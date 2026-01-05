import { useEffect, useState } from "react";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useParams } from "react-router-dom";
import TopListFilmCard from "../Components/TopListFilmCard";
import { TopListGet } from "../Models/TopList";
import { getTopListByIdApi } from "../Services/TopListService";
import { toast } from "react-toastify";
import {
  getAllTopFilmsApi,
  updateTopListFilmApi,
} from "../Services/TopListFIlmService";
import { TopListFilmGet } from "../Models/TopListFilm";
import TopListFilmCardWithoutDnD from "../Components/TopListFilmCardForOtherUser";

export default function TopListPageForOtherUser() {
  const { listId } = useParams();
  const [films, setFilms] = useState<TopListFilmGet[]>([]);
  const [topList, setTopList] = useState<TopListGet | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

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
    await getAllTopFilmsApi(Number(listId))
      .then((res) => {
        if (res?.data) {
          const sorted = res.data.sort((a, b) => a.position - b.position);
          setFilms(sorted);
        }
      })
      .catch((e) => toast.error("Unexpected error"));
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = films.findIndex((f) => f.id === active.id);
    const newIndex = films.findIndex((f) => f.id === over.id);

    const newFilms = arrayMove(films, oldIndex, newIndex);
    setFilms(newFilms);

    try {
      const updatedOrder = newFilms.map((film, index) => ({
        filmId: film.id,
        position: index + 1,
      }));
      for (let i of updatedOrder) {
        await updateTopListFilmApi(i.filmId, i.position);
      }
    } catch (err) {
      console.error("Update order failed", err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{topList?.name}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {films.map((film, index) => (
          <TopListFilmCardWithoutDnD topListfilm={film} position={index + 1} />
        ))}
      </div>
    </div>
  );
}
