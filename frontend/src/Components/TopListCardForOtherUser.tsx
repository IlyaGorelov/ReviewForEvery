// /src/components/TopListCard.tpx

import { useNavigate } from "react-router-dom";
import { TopListGet } from "../Models/TopList";
import { deleteTopListAPI, updateTopListApi } from "../Services/TopListService";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  list: TopListGet;
};

export default function TopListCardForOtherUser({ list }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${list.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border rounded p-4 shadow hover:shadow-md transition"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{list.name}</h2>
      </div>
    </div>
  );
}
