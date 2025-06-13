import React, { useEffect, useState } from "react";
import { BiSolidLike } from "react-icons/bi";
import { FaBook } from "react-icons/fa";
import { FaShare } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../main.jsx";

function formatNumber(num) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'b';
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  } else {
    return num;
  }
}

export default function BlogLikeAndShareComponent({ blog }) {
  const [activityData, setActivityData] = useState(blog?.activity || {});
  const authUser = queryClient.getQueryData(["authUser"]);

  const { mutate: requestReadsAndLikeFunc } = useMutation({
    mutationFn: async (type) => {
      const path = type === "like" ? "like" : "read";
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/blog/${path}/${blog?.blog_id}/${authUser?.user._id}`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        const data = await res.json();

        if (res.ok && data?.message) {
          setActivityData(data.message); // update UI
        } else {
          toast.error(data?.error || "Something went wrong");
        }
      } catch (e) {
        toast.error(e.message);
      }
    },
  });

  // Send read request on mount
  useEffect(() => {
    requestReadsAndLikeFunc("read");
  }, []);

  return (
    <div className="flex justify-center gap-5 m-4 bg-gray-100 p-2.5 rounded">
      <button
        onClick={() => requestReadsAndLikeFunc("like")}
        className="flex gap-2.5 items-center"
      >
        <BiSolidLike />
        <span>{formatNumber(activityData.total_likes || 0)}</span>
      </button>

      <button className="flex gap-2.5 items-center">
        <FaBook />
        <span>{formatNumber(activityData.total_reads || 0)}</span>
      </button>

      <button className="flex gap-2.5 items-center">
        <FaShare />
      </button>
    </div>
  );
}
