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
  disabled,
}: {
  film: TopListFilmGet;
  index: number;
  onSuccess: () => void;
  disabled: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: film.id, disabled });

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
  const [isEditing, setIsEditing] = useState(false);
  const [originalFilms, setOriginalFilms] = useState<TopListFilmGet[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 8,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
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
          if (!isEditing) setOriginalFilms(sorted);
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
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{topList?.name}</h1>

        {!isEditing ? (
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
            onClick={() => {
              setOriginalFilms(films);
              setIsEditing(true);
            }}
          >
            Изменить
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition disabled:opacity-50"
              disabled={isSaving}
              onClick={async () => {
                setIsSaving(true);
                try {
                  const updatedOrder = films.map((film, index) => ({
                    filmId: film.id,
                    position: index + 1,
                  }));

                  await Promise.all(
                    updatedOrder.map((i) =>
                      updateTopListFilmApi(i.filmId, i.position)
                    )
                  );

                  toast.success("Сохранено");
                  setOriginalFilms(films);
                  setIsEditing(false);
                } catch (e) {
                  toast.error("Не удалось сохранить");
                } finally {
                  setIsSaving(false);
                }
              }}
            >
              Сохранить
            </button>

            <button
              className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded hover:bg-gray-300 transition"
              disabled={isSaving}
              onClick={() => {
                setFilms(originalFilms);
                setIsEditing(false);
                toast.info("Изменения отменены");
              }}
            >
              Отменить
            </button>
          </div>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={isEditing ? handleDragEnd : undefined}
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
                disabled={!isEditing}
              />
            ))}
          </SortableContext>
          {!isEditing && <AddTopListFilm onSuccess={fetchFilms} />}
        </div>
      </DndContext>
    </div>
  );
}
