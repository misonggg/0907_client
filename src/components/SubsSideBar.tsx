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
    <div className="bg-white border border-gray-300 w-full p-2">
      <div>
        <p>커뮤니티에 대하여</p>
        <p>섭 만들어진 날짜 :{dayjs(sub?.createdAt).format("YYYY.MM.DD")}</p>
        <p>섭 네임 : {sub?.name}</p>
        <p>섭 설명 : {sub?.description}</p>
        <p>섭 포스트 카운트 : {sub?.postCount}</p>
        <p>섭 타이틀 : {sub?.title}</p>
        <p>섭 유저네임 : {sub?.username}</p>
      </div>
      {authenticated && (
        <div>
          <Link
            href={`/c/${sub?.name}/new`}
            className="px-2 py-1 bg-gray-500 text-white"
          >
            포스트 생성
          </Link>
        </div>
      )}
    </div>
  );
}

export default SubsSideBar;
