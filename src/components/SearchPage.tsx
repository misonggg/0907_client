"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { usePathname } from "next/navigation";
import dayjs from "dayjs";

function SearchPage() {
  const pathname = usePathname();
  const pathParts = pathname.split("search/");
  const searchKeyword = pathParts[1];
  const keyword = decodeURIComponent(searchKeyword);

  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  const apiUrl = `http://localhost:4000/api/search/${keyword}`;

  const { data, error, mutate } = useSWR<any>(apiUrl, fetcher);

  return (
    <div>
      <div>
        <div>
          <p>유저 검색 결과</p>
          {/* 검색 결과가 없을 경우 대비해서 조건부 렌더링 */}
          {data?.users.length > 0 ? (
            data.users.map((user: any) => (
              <div
                key={user.id}
                className="border border-gray-300 p-2 flex flex-row items-center mb-2"
              >
                <img
                  src={user.imageUrl}
                  alt="유저이미지"
                  className="h-16 w-16 rounded-full"
                />
                <p>{user.username}</p>
                <p>{dayjs(user.createdAt).format("YYYY년 MM월 DD일 가입")}</p>
              </div>
            ))
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
          <p className="mt-10">서브 검색 결과</p>
          {/* 검색 결과가 없을 경우 대비해서 조건부 렌더링 */}
          {data?.subs.length > 0 ? (
            data.subs.map((sub: any) => (
              <div
                key={sub.id}
                className="border border-gray-300 p-2 flex flex-row items-center mb-2"
              >
                <img
                  src={sub.imageUrl}
                  alt="유저이미지"
                  className="h-16 w-16 rounded-full"
                />
                <p>{sub.name}</p>
                <p>{dayjs(sub.createdAt).format("YYYY년 MM월 DD일 생성")}</p>
              </div>
            ))
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
