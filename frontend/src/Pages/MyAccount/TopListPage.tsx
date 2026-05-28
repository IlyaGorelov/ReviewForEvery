import { useEffect, useState } from "react";
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
  reorderTopListFilmsApi,
} from "../../Services/TopListFIlmService";
import AddTopListFilm from "../../Components/AddTopListFilm";
import { Spinner } from "../../Components/Loader";

// DnD wrapper component (only used during editing)
function SortableFilm({
  film,
  index,
  onSuccess,
  isEditing,
}: {
  film: TopListFilmGet;
  index: number;
  onSuccess: () => void;
  isEditing: boolean;
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

  const delayClass = ["delay-0", "delay-75", "delay-150", "delay-200"][
    index % 4
  ];

  return (
    <div style={style} ref={setNodeRef}>
      <div
        className={
          isEditing && !isDragging ? `animate-jiggle ${delayClass}` : ""
        }
      >
        <TopListFilmCard
          topListfilm={film}
          refNode={setNodeRef}
          listeners={listeners}
          attributes={attributes}
          isDragging={isDragging}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
}

type Props = {
  /** "edit" = owner can rearrange, "readonly" = view only */
  variant?: "edit" | "readonly";
};

export default function TopListPage({ variant = "edit" }: Props) {
  const { id: topListId } = useParams(); // unified route param
  const [films, setFilms] = useState<TopListFilmGet[]>([]);
  const [topList, setTopList] = useState<TopListGet | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalFilms, setOriginalFilms] = useState<TopListFilmGet[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 8 },
    }),
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const fetchTopList = async () => {
    try {
      const res = await getTopListByIdApi(Number(topListId));
      if (res?.data) setTopList(res.data);
    } catch {
      toast.error("Could not load list");
    }
  };

  const fetchFilms = async () => {
    setIsLoading(true);
    try {
      const res = await getAllTopFilmsApi(Number(topListId));
      if (res?.data) {
        const sorted = res.data.sort((a, b) => a.position - b.position);
        setFilms(sorted);
        if (!isEditing) setOriginalFilms(sorted);
      }
    } catch {
      toast.error("Could not load films");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopList();
    fetchFilms();
  }, [topListId]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = films.findIndex((f) => f.id === active.id);
    const newIndex = films.findIndex((f) => f.id === over.id);
    setFilms(arrayMove(films, oldIndex, newIndex));
  };

  const saveOrder = async () => {
    setIsSaving(true);
    try {
      const items = films.map((film, idx) => ({
        id: film.id,
        position: idx + 1,
      }));
      await reorderTopListFilmsApi(Number(topListId), items);
      toast.success("Order saved");
      setIsEditing(false);
      fetchFilms();
    } catch {
      toast.error("Failed to save order");
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    setFilms(originalFilms);
    setIsEditing(false);
    toast.info("Changes cancelled");
  };

  const isEditable = variant === "edit";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {topList?.name || "Top List"}
              </h1>
              <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
              <p className="mt-3 text-gray-500 text-lg">
                {films.length} {films.length === 1 ? "item" : "items"}
              </p>
            </div>

            {/* Edit / Save / Cancel buttons – only for editable variant */}
            {isEditable && !isEditing && (
              <button
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm"
                onClick={() => {
                  setOriginalFilms(films);
                  setIsEditing(true);
                }}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Order
              </button>
            )}
            {isEditable && isEditing && (
              <div className="flex gap-3">
                <button
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-50 shadow-sm"
                  disabled={isSaving}
                  onClick={saveOrder}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save
                </button>
                <button
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all disabled:opacity-50 shadow-sm"
                  disabled={isSaving}
                  onClick={cancelEdit}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : films.length === 0 && !isEditable ? (
          /* Empty state for readonly variant */
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg">This list is empty.</p>
            <p className="text-gray-400 mt-1">No items have been added yet.</p>
          </div>
        ) : (
          <>
            {isEditing ? (
              /* Drag & drop grid when editing */
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                        isEditing={isEditing}
                      />
                    ))}
                  </SortableContext>
                </div>
              </DndContext>
            ) : isEditable ? (
              /* View mode for owner – shows cards + add button */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {films.map((film) => (
                  <TopListFilmCard
                    key={film.id}
                    topListfilm={film}
                    attributes={undefined}
                    listeners={undefined}
                    isDragging={false}
                    refNode={() => {}}
                    onSuccess={fetchFilms}
                  />
                ))}
                <AddTopListFilm onSuccess={fetchFilms} />
              </div>
            ) : (
              /* Read‑only variant – uses a simpler card without DnD hooks */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {films.map((film, index) => (
                  <div
                    key={film.id}
                    className="transform transition-all duration-200 hover:-translate-y-1"
                  >
                    <TopListFilmCard topListfilm={film} variant={"otherUser"} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
