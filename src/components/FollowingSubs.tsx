"use client";
import { useAuthState } from "@/context/auth";
import { Sub } from "@/types";
import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import useSWR from "swr";

function FollowingSubs() {
  const { authenticated, user } = useAuthState();

  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  console.log("유저네임 : ", user?.username);

  const apiUrl = `http://localhost:4000/api/users/${user?.username}/subs`;
  const { data: subs } = useSWR<Sub[]>(apiUrl, fetcher);

  return (
    <div className="flex flex-col bg-white items-center w-full mt-2">
      <div className="flex flex-col w-full">
        <div className="flex items-center py-2 border-b border-gray-300 px-3">
          <p className="font-semibold">내가 가입한 커뮤니티</p>
        </div>
        {subs?.map((sub) => (
          <div key={sub.name} className="m-1 flex flex-row mt-2 px-1">
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

        {subs && subs.length === 0 && (
          <p className="text-xs p-2">팔로우하고 있는 커뮤니티가 없습니다. 🔇</p>
        )}
      </div>
      {subs && subs.length >= 1 && (
        <Link
          href={`/u/${user?.username}/posts`}
          className="text-xs py-3 px-1 hover:font-bold"
        >
          내가 가입한 커뮤니티의 글만 보아보기 👉🏻
        </Link>
      )}
    </div>
  );
}

export default FollowingSubs;
