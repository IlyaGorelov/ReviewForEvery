import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllMyTopListsApi,
  postTopListAPI,
} from "../../Services/TopListService";
import { getUserByNameApi } from "../../Services/UserService";
import { TopListGet } from "../../Models/TopList";
import { UserGet } from "../../Models/User";
import TopListCard from "../../Components/TopListCard";
import { Spinner } from "../../Components/Loader";

type Props = {
  /** "my" = logged‑in user's lists, "user" = another user's lists */
  variant: "my" | "user";
  /** Required when variant === "user" */
  username?: string;
};

const TopListsPage = ({ variant, username }: Props) => {
  const [newName, setNewName] = useState("");
  const [topLists, setTopLists] = useState<TopListGet[] | null>([]);
  const [user, setUser] = useState<UserGet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isOwner = variant === "my";

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (isOwner) {
        const res = await getAllMyTopListsApi();
        if (res?.data) setTopLists(res.data);
      } else if (variant === "user" && username) {
        const res = await getUserByNameApi(username);
        if (res?.data) {
          setUser(res.data);
          setTopLists(res.data.topLists || []);
        }
      }
    } catch {
      toast.error("Could not load lists");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [variant, username]);

  const createTop = async (name: string) => {
    if (!name.trim()) {
      toast.warning("Please enter a list name");
      return;
    }
    try {
      await postTopListAPI(name);
      setNewName("");
      fetchData();
      toast.success("List created");
    } catch {
      toast.error("Could not create list");
    }
  };

  const title = isOwner
    ? "My Top Lists"
    : `Top Lists by ${user?.username || username}`;
  const subtitle = isOwner
    ? "Organize your favorite films into custom lists"
    : "Curated lists from this user";
  const emptyMessage = isOwner
    ? "You don't have any lists yet."
    : `${user?.username || "This user"} hasn't created any top lists yet.`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto sm:mx-0"></div>
          <p className="mt-4 text-gray-500 text-lg">{subtitle}</p>
        </div>

        {/* Create form (only for owner) */}
        {isOwner && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-10 transition-all hover:shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Create a new list
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="e.g., 'Best Sci-Fi Movies', 'Watchlist 2025'..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onKeyDown={(e) => e.key === "Enter" && createTop(newName)}
              />
              <button
                onClick={() => createTop(newName)}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create List
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Press Enter or click the button
            </p>
          </div>
        )}

        {/* Lists content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : topLists?.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center transition-all hover:shadow-lg">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg">{emptyMessage}</p>
            {isOwner && (
              <p className="text-gray-400 mt-1">
                Create your first list using the form above.
              </p>
            )}
          </div>
        ) : (
          <div
            className={
              isOwner ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "grid gap-4"
            }
          >
            {topLists?.map((list) => (
              <div
                key={list.id}
                className="transform transition-all duration-200 hover:-translate-y-1"
              >
                {isOwner ? (
                  <TopListCard list={list} onUpdated={fetchData} />
                ) : (
                  <TopListCard list={list} variant={"otherUser"} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopListsPage;
