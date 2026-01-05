import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TopListGet } from "../Models/TopList";
import { getUserByNameApi } from "../Services/UserService";
import { UserGet } from "../Models/User";
import { useParams } from "react-router-dom";
import TopListCardForOtherUser from "../Components/TopListCardForOtherUser";
import { Spinner } from "../Components/Loader";

type Props = {};

const TopListsPageForOtherUser = (props: Props) => {
  const [topLists, setTopLists] = useState<TopListGet[] | null>([]);
  const { username } = useParams();
  const [user, setUser] = useState<UserGet>();
  const [isLoading, setIsLoading] = useState(true);

  async function getUser() {
    setIsLoading(true);
    getUserByNameApi(username!)
      .then((res) => {
        if (res?.data) {
          setUser(res.data);
          setTopLists(res.data.topLists);
        }
      })
      .catch((e) => toast.error("Unexpected error"))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Top Lists {user?.username}</h1>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid gap-4">
            {topLists?.map((list: TopListGet) => (
              <TopListCardForOtherUser key={list.id} list={list} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TopListsPageForOtherUser;
