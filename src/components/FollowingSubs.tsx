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
    <div className="bg-white border border-gray-400 flex flex-col items-center">
      <div className="flex flex-col">
        {subs?.map((sub) => (
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

        {subs && subs.length === 0 && (
          <p className="text-xs p-1">팔로우하고 있는 커뮤니티가 없습니다.</p>
        )}

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
      {subs && subs.length >= 1 && (
        <Link href={`/u/${user?.username}/posts`} className="text-xs py-3">
          가입한 커뮤니티의 글만 보아보기
        </Link>
      )}
    </div>
  );
}

export default FollowingSubs;
