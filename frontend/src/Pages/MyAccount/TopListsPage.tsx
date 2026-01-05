import React, { useEffect, useState } from "react";
import {
  getAllMyTopListsApi,
  postTopListAPI,
} from "../../Services/TopListService";
import { TopListGet } from "../../Models/TopList";
import { toast } from "react-toastify";
import TopListCard from "../../Components/TopListCard";
import AddTopListFilm from "../../Components/AddTopListFilm";
import { Spinner } from "../../Components/Loader";

type Props = {};

const TopListsPage = (props: Props) => {
  const [newName, setNewName] = useState("");
  const [topLists, setTopLists] = useState<TopListGet[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTopLists = async () => {
    setIsLoading(true);
    await getAllMyTopListsApi()
      .then((res) => {
        if (res?.data) {
          setTopLists(res.data);
        }
      })
      .catch((e) => {
        toast.error("Unexpected error");
      })
      .finally(() => setIsLoading(false));
  };

  const createTop = async (name: string) => {
    await postTopListAPI(name).catch((e) => {
      toast.warning("Unexpected error");
    });
    await getTopLists();
  };

  useEffect(() => {
    getTopLists();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Top Lists</h1>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="New list name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border rounded px-3 py-2 flex-grow"
          required
        />
        <button
          onClick={() => createTop(newName)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create
        </button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid gap-4">
            {topLists?.map((list: TopListGet) => (
              <TopListCard key={list.id} list={list} onUpdated={getTopLists} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TopListsPage;
