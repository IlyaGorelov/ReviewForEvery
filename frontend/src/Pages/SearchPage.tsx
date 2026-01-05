import { useEffect, useState } from "react";
import FilmCard from "../Components/SearchPage/FilmCard";
import { FilmGet } from "../Models/Film";
import { getAllFilmsApi } from "../Services/FilmService";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "../Components/Loader";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [filmsData, setFilmsData] = useState<FilmGet[]>([]);

  const getFilms = async (reset = false) => {
    const pageSize = 20;
    const currentPage = reset ? 1 : Math.floor(filmsData.length / pageSize) + 1;

    const res = await getAllFilmsApi(currentPage, pageSize, query).catch(
      (e) => {
        toast.warning("No films found");
      }
    );

    if (res?.data) {
      if (reset) {
        setFilmsData(res.data.items);
      } else {
        setFilmsData((prev) => [...prev, ...res.data.items]);
      }

      if (
        (reset
          ? res.data.items.length
          : filmsData.length + res.data.items.length) >= res.data.totalCount
      ) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
  };

  useEffect(() => {
    getFilms(true);
  }, []);

  useEffect(() => {
    getFilms(true);
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Поиск</h1>
      <input
        type="text"
        placeholder="Введите название ..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <InfiniteScroll
        dataLength={filmsData.length}
        next={getFilms}
        hasMore={hasMore}
        loader={<Spinner />}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filmsData === null ? (
            <p>Films not found</p>
          ) : (
            filmsData?.map((film, index) => (
              <FilmCard key={index} film={film} getFilms={getFilms} />
            ))
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
}
