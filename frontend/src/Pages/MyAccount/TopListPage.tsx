import { useEffect, useState } from "react";
import axios from "axios";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { TopListFilmGet } from "../../Models/TopListFilm";
import TopListFilmCard from "../../Components/TopListFilmCard";
import { TopListGet } from "../../Models/TopList";
import { getTopListByIdApi } from "../../Services/TopListService";
import {
  getAllTopFilmsApi,
  updateTopListFilmApi,
} from "../../Services/TopListFIlmService";
import AddTopListFilm from "../../Components/AddTopListFilm";

function SortableFilm({
  film,
  index,
  onSuccess,
}: {
  film: TopListFilmGet;
  index: number;
  onSuccess: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: film.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",    
    WebkitUserDrag: "none",  
    userSelect: "none",
  } as React.CSSProperties;

  return (
    <div style={style}>
      <TopListFilmCard
        topListfilm={film}
        position={index + 1}
        refNode={setNodeRef}
        listeners={listeners}
        attributes={attributes}
        isDragging={isDragging}
        onSuccess={onSuccess}
      />
    </div>
  );
}

export default function TopListPage() {
  const { id: topListId } = useParams();
  const [films, setFilms] = useState<TopListFilmGet[]>([]);
  const [topList, setTopList] = useState<TopListGet | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
  );

  async function getTopList() {
    await getTopListByIdApi(Number(topListId))
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
  }, [topListId]);

  const fetchFilms = async () => {
    await getAllTopFilmsApi(Number(topListId))
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <SortableContext
            items={films.map((f) => f.id)}
            strategy={rectSortingStrategy}
          >
            {films.map((film, index) => (
              <SortableFilm
                key={film.id}
                film={film}
                index={index}
                onSuccess={fetchFilms}
              />
            ))}
          </SortableContext>
          <AddTopListFilm position={films.length + 1} onSuccess={fetchFilms} />
        </div>
      </DndContext>
    </div>
  );
}
