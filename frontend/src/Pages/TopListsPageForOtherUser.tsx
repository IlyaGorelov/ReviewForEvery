import React, { useEffect, useState } from "react";
import {
  getAllMyTopListsApi,
  postTopListAPI,
} from "../Services/TopListService";
import { toast } from "react-toastify";
import { TopListGet } from "../Models/TopList";
import TopListCard from "../Components/TopListCard";
import { getUserByNameApi } from "../Services/UserService";
import { UserGet } from "../Models/User";
import { useParams } from "react-router-dom";
import TopListCardForOtherUser from "../Components/TopListCardForOtherUser";

type Props = {};

const TopListsPageForOtherUser = (props: Props) => {
  const [topLists, setTopLists] = useState<TopListGet[] | null>([]);

 const { username } = useParams();

  const [user, setUser] = useState<UserGet>();

  async function getUser() {
    getUserByNameApi(username!)
      .then((res) => {
        if (res?.data) {setUser(res.data);
          setTopLists(res.data.topLists);
        }
      })
      .catch((e) => toast.error("Unexpected error"));
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Top Lists {user?.username}</h1>

      <div className="grid gap-4">
        {topLists?.map((list:TopListGet) => (
          <TopListCardForOtherUser key={list.id} list={list}/>
        ))}
      </div>
    </div>
  );
};

export default TopListsPageForOtherUser;
