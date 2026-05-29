import { useEffect, useState } from "react";
import FilmCard from "../Components/SearchPage/FilmCard";
import { FilmGet } from "../Models/Film";
import { getAllFilmsApi } from "../Services/FilmService";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "../Components/Loader";
import { useDebounce } from "../Context/useDebounce";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [hasMore, setHasMore] = useState(true);
  const [filmsData, setFilmsData] = useState<FilmGet[]>([]);

  useEffect(() => {
    let ignore = false;

    const fetchFirstPage = async () => {
      if (!debouncedQuery) {
        setFilmsData([]);
        setHasMore(false);
        return;
      }

      const pageSize = 20;
      const res = await getAllFilmsApi(1, pageSize, debouncedQuery).catch(
        () => {
          toast.warning("No films found");
        },
      );

      if (!ignore) {
        if (res?.data) {
          setFilmsData(res.data.items);
          setHasMore(res.data.items.length < res.data.totalCount);
        } else {
          setFilmsData([]);
          setHasMore(false);
        }
      }
    };

    fetchFirstPage();

    return () => {
      ignore = true;
    };
  }, [debouncedQuery]);

  const getFilms = async () => {
    const pageSize = 20;
    const currentPage = Math.floor(filmsData.length / pageSize) + 1;

    const res = await getAllFilmsApi(
      currentPage,
      pageSize,
      debouncedQuery,
    ).catch(() => {
      toast.warning("Error loading more");
    });

    if (res?.data) {
      setFilmsData((prev) => [...prev, ...res.data.items]);
      if (filmsData.length + res.data.items.length >= res.data.totalCount) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Search
          </h1>
          <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto sm:mx-0"></div>
          <p className="mt-4 text-gray-500 text-lg">
            Discover films, series, anime, and more
          </p>
        </div>

        {/* Search input */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Enter title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-1/2 px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm bg-white"
          />
        </div>

        {/* Infinite scroll grid */}
        <InfiniteScroll
          dataLength={filmsData.length}
          next={getFilms}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center my-8">
              <Spinner />
            </div>
          }
          endMessage={
            <p className="text-center text-gray-500 mt-8">
              You've reached the end 🎬
            </p>
          }
        >
          {filmsData.length === 0 && !hasMore ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎞️</div>
              <p className="text-gray-500 text-lg">No films found.</p>
              <p className="text-gray-400">Try a different search term.</p>
            </div>
          ) : (
            <div className="mt-3 mx-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filmsData.map((film, index) => (
                <div
                  key={index}
                  className="transform transition-all duration-200"
                >
                  <FilmCard film={film} getFilms={getFilms} />
                </div>
              ))}
            </div>
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
}
