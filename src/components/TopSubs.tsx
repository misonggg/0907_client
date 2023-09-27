"use client";
import { useAuthState } from "@/context/auth";
import { Sub } from "@/types";
import axios from "axios";
import Link from "next/link";
import React from "react";
import useSWR from "swr";
import { FcFlashOn } from "react-icons/fc";

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
    <div className="flex bg-white items-center w-full mt-5">
      <div className="flex flex-col w-full">
        <div className="flex items-center py-2 border-b border-gray-300">
          <FcFlashOn className="text-2xl ml-1" />
          <p className="font-semibold">상위 커뮤니티</p>
        </div>
        <div className="pt-2 px-2">
          {topSubs?.map((sub) => (
            <div key={sub.name} className="flex flex-row mb-2">
              <Link
                href={`/c/${sub.name}`}
                className="flex flex-row items-center hover:underline"
              >
                <img
                  src={sub.imageUrl}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p className="text-sm ml-2">{sub.name}</p>
              </Link>
            </div>
          ))}
        </div>

        {authenticated && (
          <div className="flex p-3 w-full">
            <Link
              href="/community/new"
              className="bg-blue-500 px-3 py-2 text-white rounded-full text-sm w-full text-center hover:opacity-60"
            >
              커뮤니티 생성
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopSubs;
