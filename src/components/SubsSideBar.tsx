"use client";
import { useAuthState } from "@/context/auth";
import { Sub } from "@/types";
import React from "react";
import Link from "next/link";
import dayjs from "dayjs";

type Props = {
  sub: Sub;
};

function SubsSideBar({ sub }: Props) {
  const { authenticated } = useAuthState();
  return (
    <div className="w-full flex flex-col items-center mt-2 p-2">
      <div className="w-full px-1">
        <p className="font-semibold border-b border-gray-400 pb-2">
          {sub?.name}
        </p>
        <p className="font-semibold text-sm mt-2">{sub?.title}</p>
        <p className="text-sm">
          🎂 {dayjs(sub?.createdAt).format("YYYY년 MM월 DD일")}
        </p>
        <p className="text-sm">{sub?.postCount}개의 포스트</p>
        <p className="text-sm">by @ {sub?.username}</p>
      </div>
      {authenticated && (
        <div className="mt-3 w-full">
          <Link
            href={`/c/${sub?.name}/new`}
            className="text-sm px-3 py-1 bg-blue-400 text-white rounded-full w-full hover:bg-blue-500"
          >
            포스트 생성
          </Link>
        </div>
      )}
    </div>
  );
}

export default SubsSideBar;
