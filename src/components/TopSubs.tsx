"use client";
import { useAuthState } from "@/context/auth";
import { Sub } from "@/types";
import axios from "axios";
import Link from "next/link";
import React from "react";
import useSWR from "swr";

function TopSubs() {
  const { authenticated } = useAuthState();

  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  const apiUrl = "http://localhost:4000/api/subs/sub/topSubs";
  const { data: topSubs } = useSWR<Sub[]>(apiUrl, fetcher);

  return (
    <div className="bg-white border border-gray-400 flex items-center">
      <div className="flex flex-col">
        {topSubs?.map((sub) => (
          <div key={sub.name} className="m-1 flex flex-row">
            <Link
              href={`/c/${sub.name}`}
              className="flex flex-row items-center"
            >
              <img
                src={sub.imageUrl}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="text-sm font-bold ml-2">{sub.name}</p>
            </Link>
          </div>
        ))}

        <div className="mt-10 flex">
          {authenticated && (
            <Link
              href="/community/new"
              className="bg-blue-500 px-3 py-1 text-white"
            >
              커뮤니티 생성
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopSubs;
